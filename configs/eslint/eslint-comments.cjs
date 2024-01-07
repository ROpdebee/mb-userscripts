module.exports = {
    extends: ['plugin:eslint-comments/recommended'],
    rules: {
        'eslint-comments/no-unused-disable': 'warn',
        'eslint-comments/disable-enable-pair': ['warn', {
            allowWholeFile: true,
        }],
    },
};
