export default {
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
