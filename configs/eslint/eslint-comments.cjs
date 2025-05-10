module.exports = {
    extends: ['plugin:@eslint-community/eslint-comments/recommended'],
    rules: {
        '@eslint-community/eslint-comments/no-unused-disable': 'warn',
        '@eslint-community/eslint-comments/disable-enable-pair': ['warn', {
            allowWholeFile: true,
        }],
    },
};
