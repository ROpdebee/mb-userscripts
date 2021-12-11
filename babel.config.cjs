// CommonJS module since we're using it in Jest to transpile TypeScript,
// ESM -> CJS, and add rewire support to the modules.
const testConfig = {
    plugins: [
        '@babel/plugin-transform-typescript',
        '@babel/plugin-transform-modules-commonjs',
    ]
};

const prodConfig = {
    presets: [
        ['@babel/preset-typescript', {
            isTSX: true,
            allExtensions: true,
        }],
        ['@babel/preset-env', {
            corejs: '3.13',
            useBuiltIns: 'entry',
        }],
    ],
    plugins: [
        '@babel/plugin-syntax-jsx',
        ['@babel/plugin-transform-runtime', {
            regenerator: true,
            helpers: false,
        }]
    ],
    sourceType: 'unambiguous',
};

module.exports = (process.env.NODE_ENV === 'test' ? testConfig : prodConfig);
