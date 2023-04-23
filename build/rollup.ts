import fs from 'node:fs';
import path from 'node:path';

import type { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import type { OutputPlugin, Plugin, RenderedChunk, RollupOutput } from 'rollup';
import type { MinifyOptions } from 'terser';
import alias from '@rollup/plugin-alias';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import virtual from '@rollup/plugin-virtual';
import postcssPresetEnv from 'postcss-preset-env';
import { rollup } from 'rollup';
import postcss from 'rollup-plugin-postcss';
import progress from 'rollup-plugin-progress';
import { minify } from 'terser';

import { parseChangelogEntries } from './changelog';
import { consts } from './plugin-consts';
import { logger } from './plugin-logger';
import { nativejsx } from './plugin-nativejsx';
import { updateNotifications } from './plugin-update-notifications';
import { MetadataGenerator, userscript } from './plugin-userscript';

const OUTPUT_DIR = 'dist';
const VENDOR_CHUNK_NAME = 'vendor';
const BUILTIN_LIB_CHUNK_NAME = 'lib';

const EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx'];

const BABEL_OPTIONS: RollupBabelInputPluginOptions = {
    babelHelpers: 'bundled',
    exclude: 'node_modules/core-js*/**',
    include: ['**/*'],
    extensions: EXTENSIONS,
};

const TERSER_OPTIONS: MinifyOptions = {
    ecma: 5,
    safari10: true,  // Supported by MB
    compress: {
        passes: 4,
    },
    // Don't garble top-level names
    module: false,
};

const SKIP_PACKAGES = new Set(['lib', 'types']);
const MAX_FEATURE_HISTORY = 10;  // Include only the last 10 new features of the changelog

export async function buildUserscripts(version: string, outputDir: string = OUTPUT_DIR): Promise<void> {
    const sourceDirs = await fs.promises.readdir('./src');
    const userscriptDirs = sourceDirs
        .filter((name) => !SKIP_PACKAGES.has(name) && !name.startsWith('.') && fs.statSync(path.resolve('./src', name)).isDirectory());

    // Build sequentially, to prevent console output from mangling
    for (const userscriptName of userscriptDirs) {
        await buildUserscript(userscriptName, version, outputDir);
    }
}

export async function buildUserscript(userscriptName: string, version: string, outputDir: string): Promise<void> {
    console.log(`Building ${userscriptName}`);
    const userscriptMetaGenerator = await MetadataGenerator.create({
        userscriptName,
        version,
        branchName: 'dist',
    });
    const passOneOutput = await buildUserscriptPassOne(userscriptName, userscriptMetaGenerator, outputDir);
    await buildUserscriptPassTwo(passOneOutput, userscriptName, userscriptMetaGenerator, outputDir);
}

/**
 * Builds the first pass of a userscript.
 *
 * Generates the userscript into two bundles, the first containing the main
 * userscript code, the second containing a minified bundle of all external
 * dependencies which aren't present as a @require. Note that userscript
 * metadata isn't embedded yet.
 *
 * @param      {String}   userscriptDir  The userscript directory.
 * @return     {Promise}  Promise that resolves to the output as described
 *                        above.
 */
async function buildUserscriptPassOne(userscriptDir: string, userscriptMetaGenerator: MetadataGenerator, outputDir: string): Promise<RollupOutput> {
    let inputPath: string;
    try {
        inputPath = await Promise.any(EXTENSIONS.map(async (ext) => {
            const filePath = path.resolve('./src', userscriptDir, 'index' + ext);
            return fs.promises.stat(filePath)
                .then(() => filePath);
        }));
    } catch {
        throw new Error(`No top-level file found in ${userscriptDir}`);
    }

    const changelogEntries = await parseChangelogEntries(path.join(outputDir, `${userscriptDir}.changelog.md`));
    const featureHistory = changelogEntries
        .filter((entry) => entry.title === 'New feature')
        .map((entry) => ({
            versionAdded: entry.version,
            description: entry.subject,
        }))
        // Limit the number of entries we store, otherwise the scripts might grow very large.
        .slice(0, MAX_FEATURE_HISTORY - 1);
    const changelogUrl = userscriptMetaGenerator.gitURLs
        .constructBlobURL(
            userscriptMetaGenerator.options.branchName,
            `${userscriptDir}.changelog.md`,
        );

    const plugins = [
        updateNotifications({
            include: inputPath,
        }),
        logger({
            include: inputPath,
        }),
        // To resolve some aliases, like @lib
        alias({
            entries: {
                '@lib': path.resolve('./src/lib'),
                '@src': path.resolve('./src'),
            },
        }),
        consts({
            'userscript-id': userscriptDir,
            'userscript-feature-history': featureHistory,
            'changelog-url': changelogUrl,
            'debug-mode': process.env.NODE_ENV !== 'production',
        }),
        // To resolve node_modules imports
        nodeResolve({
            extensions: EXTENSIONS,
        }),
        // To import with CJS require() statements
        commonjs(),
        // Transpilation
        babel(BABEL_OPTIONS),
        // NativeJSX transformations. Must be run after babel to remove
        // TypeScript syntax. Using NativeJSX instead of builtin babel
        // transpilation with custom createElement pragmas because NativeJSX
        // produces more natural code. However, it doesn't support all JSX
        // features yet.
        nativejsx({
            prototypes: 'module',
            acorn: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            include: '**/*.tsx',
        }),
        // To bundle and import CSS/SCSS etc
        postcss({
            inject: false,
            minimize: true,
            plugins: [
                // Transpile CSS for older browsers
                postcssPresetEnv,
            ],
            extensions: ['.css', '.scss', '.sass'],
        }),
    ];

    // Progress in CI just leads to noisy logs.
    if (!process.env.CI) {
        plugins.unshift(progress() as Plugin);
    }

    const bundle = await rollup({
        input: inputPath,
        plugins,
    });

    const output = await bundle.generate({
        format: 'es',
        manualChunks: (modulePath) => {
            if (isExternalLibrary(modulePath)) return VENDOR_CHUNK_NAME;
            if (isBuiltinLib(modulePath)) return BUILTIN_LIB_CHUNK_NAME;
            return null;
        },
        plugins: process.env.NODE_ENV == 'production' ? [minifyPlugin] : [],
    });

    await bundle.close();
    return output;
}

/**
 * Builds the second pass of a userscript.
 *
 * Bundles the userscript and the external dependencies into one IIFE, prepends
 * the userscript header, and writes a .user.js and .meta.js file to the output
 * directory.
 *
 * @param      {?}        passOneResult   The result of the first build pass.
 * @param      {String}   userscriptDir  The userscript directory.
 * @return     {Promise}  Promise that resolves once the files have been
 *                        written.
 */
async function buildUserscriptPassTwo(passOneResult: Readonly<RollupOutput>, userscriptDir: string, userscriptMetaGenerator: MetadataGenerator, outputDir: string): Promise<void> {
    const fileMapping: Record<string, string> = {};
    for (const outputChunk of passOneResult.output) {
        if (outputChunk.type === 'chunk') {
            fileMapping[outputChunk.fileName] = outputChunk.code;
        }
    }

    const bundle = await rollup({
        input: 'index.js',
        plugins: [
            // Feed the code of the previous pass as virtual files
            virtual(fileMapping),
            userscript({
                include: /index\.js/,
            }, userscriptMetaGenerator),
        ],
    });

    await bundle.write({
        format: 'iife',
        file: path.resolve(outputDir, `${userscriptDir}.user.js`),
    });

    await bundle.close();
}

function isExternalLibrary(modulePath: string): boolean {
    const relPath = path.relative('.', modulePath);
    // Don't mark `consts:...` modules are external libraries. They're fake
    // modules whose default exports get replaced by constants by the `consts`
    // plugin. Also don't consider any first party code we inject as 3rd party
    // (marked with the _virtualSource_ suffix).
    return !(relPath.startsWith('src') || relPath.startsWith('consts:') || modulePath.endsWith('_virtualSource_'));
}

function isBuiltinLib(modulePath: string): boolean {
    return path.relative('.', modulePath).startsWith(['src', 'lib'].join(path.sep));
}

function getVendorMinifiedPreamble(chunk: Readonly<RenderedChunk>): string {
    if (chunk.name === BUILTIN_LIB_CHUNK_NAME) return '/* minified: lib */';

    const bundledModules = Object.keys(chunk.modules)
        .filter((module) => !module.startsWith('\u0000'))
        .map((module) => path.relative('./node_modules', module))
        .map((module) => module
            .split(path.sep)
            .slice(0, module.startsWith('@') ? 2 : 1)
            .join('/'));

    const uniqueBundledModules = [...new Set(bundledModules)];
    if ('\u0000rollupPluginBabelHelpers.js' in chunk.modules) {
        uniqueBundledModules.unshift('babel helpers');
    }

    if (uniqueBundledModules.length === 0) return '';

    return `/* minified: ${uniqueBundledModules.join(', ')} */`;
}

const minifyPlugin: OutputPlugin = {
    name: 'customMinifier',
    async renderChunk(
        code: string,
        chunk: Readonly<RenderedChunk>,
    ): Promise<{ code: string; map?: string } | null> {
        // Only minify the vendor and lib chunks
        if (![VENDOR_CHUNK_NAME, BUILTIN_LIB_CHUNK_NAME].includes(chunk.name)) return null;
        const terserOptions = {
            ...TERSER_OPTIONS,
            format: {
                preamble: getVendorMinifiedPreamble(chunk),
            },
        };

        const result = await minify(code, terserOptions);
        return result.code ? { code: result.code, map: (typeof result.map === 'string') ? result.map : result.map?.mappings } : null;
    },
};
