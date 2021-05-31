import fs from 'fs';
import path from 'path';

import { rollup } from 'rollup';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import virtual from '@rollup/plugin-virtual';
import progress from 'rollup-plugin-progress';
import { terser } from 'rollup-plugin-terser';

const OUTPUT_DIR = './dist';
const VENDOR_CHUNK_NAME = 'vendor';

const BABEL_OPTIONS = {
    babelHelpers: 'bundled',
    exclude: 'node_modules/core-js*/**',
};

const TERSER_OPTIONS = {
    ecma: 5,
    safari10: true,  // Supported by MB
    compress: {
        passes: 4,
    },
};

async function buildUserscripts() {
    const userscriptDirs = await fs.promises.readdir('./src');

    await Promise.all(userscriptDirs
        .filter((name) => name !== 'lib' && !name.startsWith('.'))
        .map(buildUserscript));
}

async function buildUserscript(userscriptDir) {
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
async function buildUserscriptPassOne(userscriptDir) {
    const bundle = await rollup({
        input: path.resolve('./src', userscriptDir, 'index.js'),
        plugins: [
            progress(),
            // To resolve node_modules imports
            nodeResolve(),
            // To import with CJS require() statements
            commonjs(),
            // Transpilation
            babel(BABEL_OPTIONS),
        ],
    });

    const output = await bundle.generate({
        format: 'es',
        manualChunks: (modulePath) => {
            if (isExternalLibrary(modulePath)) return 'vendor';
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
 * @param      {String}   userscriptName  The userscript name.
 * @return     {Promise}  Promise that resolves once the files have been
 *                        written.
 */
async function buildUserscriptPassTwo(passOneResult, userscriptName) {
    const bundle = await rollup({
        input: 'index.js',
        plugins: [
            // Feed the code of the previous pass as virtual files
            virtual(passOneResult.output.reduce((acc, curr) => {
                acc[curr.fileName] = curr.code;
                return acc;
            }, {}))
        ]
    });

    await bundle.write({
        format: 'iife',
        file: path.resolve(OUTPUT_DIR, `${userscriptName}.user.js`),
    });

    await bundle.close();
}

function isExternalLibrary(modulePath) {
    return !path.relative('.', modulePath).startsWith('src');
}

function getVendorMinifiedPreamble(chunk) {
    const bundledModules = Object.keys(chunk.modules)
        .filter((module) => !module.startsWith('\x00'))
        .map((module) => path.relative('./node_modules', module))
        .map((module) => module.split(path.sep)[0]);

    const uniqueBundledModules = [...new Set(bundledModules)];
    return `/* minified: babel helpers, ${uniqueBundledModules.join(', ')} */`;
}

const minifyPlugin = {
    name: 'customMinifier',
    async renderChunk(code, chunk, outputOptions) {
        // Only minify the vendor chunks
        if (chunk.name !== VENDOR_CHUNK_NAME) return;
        const terserOptions = {
            ...TERSER_OPTIONS,
            format: {
                preamble: getVendorMinifiedPreamble(chunk),
            },
        };
        return terser(terserOptions).renderChunk(code, chunk, outputOptions);
    },
};

buildUserscripts();
