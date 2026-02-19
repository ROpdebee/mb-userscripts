// CommonJS module since we're using it in Jest to transpile TypeScript and ESM -> CJS
const testConfig = {
    plugins: [
        '@babel/plugin-transform-typescript',
        '@babel/plugin-transform-modules-commonjs',
    ],
};

const productionConfig = {
    presets: [
        ['@babel/preset-typescript', {
            isTSX: true,
            allExtensions: true,
        }],
        ['@babel/preset-env', {
            corejs: '3.19',
            useBuiltIns: 'entry',
        }],
    ],
    plugins: [
        '@babel/plugin-syntax-jsx',
        ['@babel/plugin-transform-runtime', {
            regenerator: true,
            helpers: false,
        }],
        ['@babel/plugin-transform-react-jsx', {
            pragma: 'h',
            pragmaFrag: 'Fragment',
        }],

    ],
    sourceType: 'unambiguous',
    comments: false,
};

module.exports = (process.env.NODE_ENV === 'test' ? testConfig : productionConfig);
