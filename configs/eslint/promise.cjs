module.exports = {
    extends: [
        'plugin:promise/recommended',
    ],
    rules: {
        'promise/catch-or-return': ['warn', {
            allowFinally: true,
        }],
        'promise/always-return': ['error', {
            ignoreLastCallback: true,
        }],
    },
};
