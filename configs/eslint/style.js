import stylistic from '@stylistic/eslint-plugin';

const stylisticCustom = stylistic.configs.customize({
    indent: 4,
    quotes: 'single',
    semi: true,
    braceStyle: '1tbs',
    jsx: true,
    arrowParens: true,
});

/** @type {import('eslint').Linter.Config[]} */
export default [{
    ...stylisticCustom,
    rules: {
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
}];
