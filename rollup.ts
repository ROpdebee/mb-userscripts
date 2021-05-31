import fs from 'fs';
import path from 'path';

import postcssPresetEnv from 'postcss-preset-env';
import { OutputPlugin, Plugin, RenderedChunk, rollup, RollupOutput, SourceMapInput } from 'rollup';
import { babel, RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import virtual from '@rollup/plugin-virtual';
import del from 'rollup-plugin-delete';
import postcss from 'rollup-plugin-postcss';
import progress from 'rollup-plugin-progress';
import { minify, MinifyOptions } from 'terser';

import { userscript } from './rollup/plugin-userscript.js';

const OUTPUT_DIR = 'dist';
const VENDOR_CHUNK_NAME = 'vendor';

const EXTENSIONS = ['.js', '.ts'];

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
            await fs.promises.stat(filePath);
            return filePath;
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
        plugins: [minifyPlugin],
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
async function buildUserscriptPassTwo(passOneResult: RollupOutput, userscriptDir: string): Promise<void> {
    const fileMapping = passOneResult.output.reduce((acc, curr) => {
        if (curr.type === 'chunk') acc[curr.fileName] = curr.code;
        return acc;
    }, {} as { [fileName: string]: string });

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

function getVendorMinifiedPreamble(chunk: RenderedChunk): string {
    const bundledModules = Object.keys(chunk.modules)
        .filter((module) => !module.startsWith('\x00'))
        .map((module) => path.relative('./node_modules', module))
        .map((module) => module.split(path.sep)[0]);

    const uniqueBundledModules = [...new Set(bundledModules)];
    return `/* minified: babel helpers, ${uniqueBundledModules.join(', ')} */`;
}

const minifyPlugin: OutputPlugin = {
    name: 'customMinifier',
    async renderChunk(
        code: string,
        chunk: RenderedChunk,
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
            .then((result) => result?.code ? { code: result.code } : null);
    },
};

buildUserscripts();
