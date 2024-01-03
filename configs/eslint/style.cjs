// eslint-disable-next-line @typescript-eslint/no-var-requires
const stylistic = require('@stylistic/eslint-plugin');

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const stylisticCustom = stylistic.configs.customize({
    indent: 4,
    quotes: 'single',
    semi: true,
    braceStyle: '1tbs',
    jsx: true,
    arrowParens: true,
});

module.exports = {
    plugins: [
        '@stylistic',
    ],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    rules: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ...stylisticCustom.rules,
        // @stylistic sets an override to forbid semicolons in multiline interfaces.
        // We want them anyway.
        '@stylistic/member-delimiter-style': ['error', {
            overrides: {},
        }],
        // @stylistic sets `avoidEscape` to false.
        '@stylistic/quotes': ['error', 'single', {
            avoidEscape: true,
        }],
    },
};
