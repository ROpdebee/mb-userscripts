// CommonJS module since we're using it in Jest to transpile TypeScript,
// ESM -> CJS, and add rewire support to the modules.
const testConfig = {
    plugins: [
        '@babel/plugin-transform-typescript',
        '@babel/plugin-transform-modules-commonjs',
    ],
};

const prodConfig = {
    presets: [
        ['@babel/preset-typescript', {
            isTSX: true,
            allExtensions: true,
        }],
        ['@babel/preset-env', {
            corejs: '3.19',
            useBuiltIns: 'entry',
            exclude: [
                // Don't transform async functions and async generators using
                // babel itself, this is handled by a plugin.
                '@babel/plugin-transform-async-to-generator',
                '@babel/plugin-proposal-async-generator-functions',
            ],
        }],
    ],
    plugins: [
        '@babel/plugin-syntax-jsx',
        // Transform async/await into promises. Need to do this before plugin-transform-runtime
        // as that will transpile to generators with regenerator. This will skip
        // complex async things, like async generators, those will still be handled
        // by babel itself. However, transforming "simple" async/await to promises
        // leads to a severely smaller footprint in the output.
        ['babel-plugin-transform-async-to-promises', {
            externalHelpers: true,
        }],
        ['@babel/plugin-transform-runtime', {
            regenerator: true,
            helpers: false,
        }],
    ],
    sourceType: 'unambiguous',
    comments: false,
};

module.exports = (process.env.NODE_ENV === 'test' ? testConfig : prodConfig);
