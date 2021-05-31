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
    sourceType: 'unambiguous',
};
