import fs from 'fs';
import path from 'path';

import type { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import type { OutputPlugin, Plugin, RenderedChunk, RollupOutput, SourceMapInput } from 'rollup';
import type { MinifyOptions } from 'terser';
import alias from '@rollup/plugin-alias';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import virtual from '@rollup/plugin-virtual';
import postcssPresetEnv from 'postcss-preset-env';
import { rollup } from 'rollup';
import consts from 'rollup-plugin-consts';
import postcss from 'rollup-plugin-postcss';
import progress from 'rollup-plugin-progress';
import { minify } from 'terser';

import { nativejsx } from './plugin-nativejsx';
import { userscript } from './plugin-userscript';

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

export async function buildUserscripts(version: string, outputDir: string = OUTPUT_DIR): Promise<void> {
    const userscriptDirs = await fs.promises.readdir('./src');

    await Promise.all(userscriptDirs
        .filter((name) => !SKIP_PACKAGES.has(name) && !name.startsWith('.') && fs.statSync(path.resolve('./src', name)).isDirectory())
        .map((userscriptName) => buildUserscript(userscriptName, version, outputDir)));
}

export async function buildUserscript(userscriptName: string, version: string, outputDir: string): Promise<void> {
    console.log(`Building ${userscriptName}`);
    const passOneOutput = await buildUserscriptPassOne(userscriptName);
    await buildUserscriptPassTwo(passOneOutput, userscriptName, version, outputDir);
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
async function buildUserscriptPassOne(userscriptDir: string): Promise<RollupOutput> {
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

    const bundle = await rollup({
        input: inputPath,
        plugins: [
            progress() as Plugin,
            // To resolve some aliases, like @lib
            alias({
                entries: {
                    '@lib': path.resolve('./src/lib'),
                    '@src': path.resolve('./src'),
                },
            }),
            consts({
                'userscript-name': userscriptDir,
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
        ],
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
async function buildUserscriptPassTwo(passOneResult: Readonly<RollupOutput>, userscriptDir: string, version: string, outputDir: string): Promise<void> {
    const fileMapping = passOneResult.output.reduce<Record<string, string>>((acc, curr) => {
        if (curr.type === 'chunk') acc[curr.fileName] = curr.code;
        return acc;
    }, {});

    const bundle = await rollup({
        input: 'index.js',
        plugins: [
            // Feed the code of the previous pass as virtual files
            virtual(fileMapping),
            userscript({
                userscriptName: userscriptDir,
                version: version,
                branchName: 'dist',
                include: /index\.js/,
            }),
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
    // plugin.
    return !(relPath.startsWith('src') || relPath.startsWith('consts:'));
}

function isBuiltinLib(modulePath: string): boolean {
    return path.relative('.', modulePath).startsWith(['src', 'lib'].join(path.sep));
}

function getVendorMinifiedPreamble(chunk: Readonly<RenderedChunk>): string {
    if (chunk.name === BUILTIN_LIB_CHUNK_NAME) return '/* minified: lib */';

    const bundledModules = Object.keys(chunk.modules)
        .filter((module) => !module.startsWith('\x00'))
        .map((module) => path.relative('./node_modules', module))
        .map((module) => module.split(path.sep).slice(0, module.startsWith('@') ? 2 : 1).join('/'));

    const uniqueBundledModules = [...new Set(bundledModules)];
    if ('\x00rollupPluginBabelHelpers.js' in chunk.modules) {
        uniqueBundledModules.unshift('babel helpers');
    }

    if (!uniqueBundledModules.length) return '';

    return `/* minified: ${uniqueBundledModules.join(', ')} */`;
}

const minifyPlugin: OutputPlugin = {
    name: 'customMinifier',
    async renderChunk(
        code: string,
        chunk: Readonly<RenderedChunk>,
    ): Promise<{ code: string; map?: SourceMapInput } | null> {
        // Only minify the vendor and lib chunks
        if (![VENDOR_CHUNK_NAME, BUILTIN_LIB_CHUNK_NAME].includes(chunk.name)) return null;
        const terserOptions = {
            ...TERSER_OPTIONS,
            format: {
                preamble: getVendorMinifiedPreamble(chunk),
            },
        };

        const result = await minify(code, terserOptions);
        return result.code ? { code: result.code, map: result.map } : null;
    },
};
