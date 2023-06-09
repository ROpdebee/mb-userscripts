/**
 * Main build module.
 */

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

/** Default output directory for the compiled scripts. */
const OUTPUT_DIR = 'dist';
/** Intermediate chunk name for 3rd party dependencies. Will be merged into the main file at the end. */
const VENDOR_CHUNK_NAME = 'vendor';
/** Intermediate chunk name for 1st party common code. Will be merged into the main file at the end. */
const BUILTIN_LIB_CHUNK_NAME = 'lib';

/** Supported JavaScript source extensions. */
const EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx'];

/** Options for the babel transpiler. */
const BABEL_OPTIONS: RollupBabelInputPluginOptions = {
    babelHelpers: 'bundled',
    exclude: 'node_modules/core-js*/**',
    include: ['**/*'],
    extensions: EXTENSIONS,
};

/** Options for the terser minification tool. */
const TERSER_OPTIONS: MinifyOptions = {
    ecma: 5,
    safari10: true,  // Supported by MB
    compress: {
        passes: 4,
    },
    // Don't garble top-level names
    module: false,
};

/** Packages to skip compiling, i.e., those that are not userscripts. */
const SKIP_PACKAGES = new Set(['lib', 'types']);
/**
 * Maximum number of new features to include in the embedded changelog that is injected into the
 * userscripts.
 */
const MAX_FEATURE_HISTORY = 10;

/**
 * Scan the source directory and build all userscripts, injecting a given version number.
 *
 * @param      {string}         version    The version number to use.
 * @param      {string}         outputDir  The output directory.
 */
export async function buildUserscripts(version: string, outputDir: string = OUTPUT_DIR): Promise<void> {
    const sourceDirs = await fs.promises.readdir('./src');
    const userscriptDirs = sourceDirs
        .filter((name) => !SKIP_PACKAGES.has(name) && !name.startsWith('.') && fs.statSync(path.resolve('./src', name)).isDirectory());

    // Build sequentially, to prevent console output from mangling
    for (const userscriptName of userscriptDirs) {
        await buildUserscript(userscriptName, version, outputDir);
    }
}

/**
 * Build a given userscript, injecting a given version number.
 *
 * @param      {string}         userscriptName  Name of the userscript to build.
 * @param      {string}         version         The version number to use.
 * @param      {string}         outputDir       The output directory.
 */
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
 * Build the first pass of a userscript.
 *
 * Generate the userscript into three chunks:
 *  - Chunk containing the main userscript code, transpiled and without comments.
 *  - Chunk containing used first-party common library code, transpiled and minified.
 *  - Chunk containing all used external dependencies which aren't present as a `@require`,
 *    transpiled and minified.
 *
 * Note that userscript metadata isn't embedded yet.
 *
 * @param      {String}             userscriptName           The name of the userscript.
 * @param      {MetadataGenerator}  userscriptMetaGenerator  The userscript metadata generator.
 * @param      {string}             outputDir                The output directory.
 * @return     {Promise}            The output chunks as described above.
 */
async function buildUserscriptPassOne(userscriptName: string, userscriptMetaGenerator: MetadataGenerator, outputDir: string): Promise<RollupOutput> {
    let inputPath: string;
    try {
        inputPath = await Promise.any(EXTENSIONS.map(async (ext) => {
            const filePath = path.resolve('./src', userscriptName, 'index' + ext);
            return fs.promises.stat(filePath)
                .then(() => filePath);
        }));
    } catch {
        throw new Error(`No top-level file found in ${userscriptName}`);
    }

    const changelogEntries = await parseChangelogEntries(path.join(outputDir, `${userscriptName}.changelog.md`));
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
            `${userscriptName}.changelog.md`,
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
            'userscript-id': userscriptName,
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
 * Build the second pass of a userscript.
 *
 * Bundle the userscript and the minified chunks into one IIFE. Prepend the userscript header, and
 * write a `.user.js` and `.meta.js` file to the output directory.
 *
 * @param      {RollupOutput}       passOneResult            The result of the first build pass.
 * @param      {String}             userscriptName           The name of the userscript.
 * @param      {MetadataGenerator}  userscriptMetaGenerator  The userscript metadata generator.
 * @param      {string}             outputDir                The output directory.
 */
async function buildUserscriptPassTwo(passOneResult: Readonly<RollupOutput>, userscriptName: string, userscriptMetaGenerator: MetadataGenerator, outputDir: string): Promise<void> {
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
        file: path.resolve(outputDir, `${userscriptName}.user.js`),
    });

    await bundle.close();
}

/**
 * Determine whether a module is an external library by checking its path.
 *
 * @param      {string}   modulePath  The module path.
 * @return     {boolean}  `true` if external library, `false` otherwise.
 */
function isExternalLibrary(modulePath: string): boolean {
    const relPath = path.relative('.', modulePath);
    // Don't mark `consts:...` modules are external libraries. They're fake
    // modules whose default exports get replaced by constants by the `consts`
    // plugin. Also don't consider any first party code we inject as 3rd party
    // (marked with the _virtualSource_ suffix).
    return !(relPath.startsWith('src') || relPath.startsWith('consts:') || modulePath.endsWith('_virtualSource_'));
}

/**
 * Determine whether a module is a built-in library by checking its path.
 *
 * @param      {string}   modulePath  The module path.
 * @return     {boolean}  `true` if built-in library, `false` otherwise.
 */
function isBuiltinLib(modulePath: string): boolean {
    return path.relative('.', modulePath).startsWith(['src', 'lib'].join(path.sep));
}

/**
 * Get the code comment explaining the minified contents of a chunk.
 *
 * @param      {Readonly<RenderedChunk>}  chunk   The chunk.
 * @return     {string}                   Code comment explaining chunk comments.
 */
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

/** Rollup plugin to minify third-party and first-party library chunks. */
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
