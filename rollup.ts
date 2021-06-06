import fs from 'fs';
import path from 'path';

import type { OutputPlugin, Plugin, RenderedChunk, RollupOutput, SourceMapInput } from 'rollup';
import type { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import type { MinifyOptions, MinifyOutput } from 'terser';

import postcssPresetEnv from 'postcss-preset-env';
import { rollup } from 'rollup';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import virtual from '@rollup/plugin-virtual';
import del from 'rollup-plugin-delete';
import postcss from 'rollup-plugin-postcss';
import progress from 'rollup-plugin-progress';
import { minify } from 'terser';

import { nativejsx } from './rollup/plugin-nativejsx.js';
import { userscript } from './rollup/plugin-userscript.js';

const OUTPUT_DIR = 'dist';
const VENDOR_CHUNK_NAME = 'vendor';

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
    module: true,
};

async function buildUserscripts(): Promise<void> {
    const userscriptDirs = await fs.promises.readdir('./src');

    await Promise.all(userscriptDirs
        .filter((name) => name !== 'lib' && !name.startsWith('.'))
        .map(buildUserscript));
}

async function buildUserscript(userscriptDir: string): Promise<void> {
    console.log(`Building ${userscriptDir}`);
    const passOneOutput = await buildUserscriptPassOne(userscriptDir);
    await buildUserscriptPassTwo(passOneOutput, userscriptDir);
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
    let inputPath;
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
            del({
                targets: OUTPUT_DIR,
            }),
            progress() as Plugin,
            // To resolve node_modules imports
            nodeResolve(),
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
                ]
            }),
        ],
    });

    const output = await bundle.generate({
        format: 'es',
        manualChunks: (modulePath) => {
            if (isExternalLibrary(modulePath)) return VENDOR_CHUNK_NAME;
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
async function buildUserscriptPassTwo(passOneResult: Readonly<RollupOutput>, userscriptDir: string): Promise<void> {
    const fileMapping = passOneResult.output.reduce<Record<string, string>>((acc, curr) => {
        if (curr.type === 'chunk') acc[curr.fileName] = curr.code;
        return acc;
    }, {});

    const bundle = await rollup({
        input: 'index.js',
        plugins: [
            // Feed the code of the previous pass as virtual files
            virtual(fileMapping) as Plugin,
            userscript({
                userscriptName: userscriptDir,
                branchName: 'main',
                outputDir: OUTPUT_DIR,
                include: /index\.js/,
            }),
        ],
    });

    await bundle.write({
        format: 'iife',
        file: path.resolve(OUTPUT_DIR, `${userscriptDir}.user.js`),
    });

    await bundle.close();
}

function isExternalLibrary(modulePath: string): boolean {
    return !path.relative('.', modulePath).startsWith('src');
}

function getVendorMinifiedPreamble(chunk: Readonly<RenderedChunk>): string {
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
        // Only minify the vendor chunks
        if (chunk.name !== VENDOR_CHUNK_NAME) return null;
        const terserOptions = {
            ...TERSER_OPTIONS,
            format: {
                preamble: getVendorMinifiedPreamble(chunk),
            },
        };

        return await minify(code, terserOptions)
            .then((result: Readonly<MinifyOutput>) =>
                result.code ? { code: result.code } : null);
    },
};

buildUserscripts();
