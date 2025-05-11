import tseslint from 'typescript-eslint';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray} */
export default [
    tseslint.configs.eslintRecommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
        rules: {
            // Override configuration defaults for some rules
            '@typescript-eslint/array-type': ['error', {
                default: 'array-simple',
            }],
            '@typescript-eslint/consistent-type-assertions': ['error', {
                assertionStyle: 'as',
                objectLiteralTypeAssertions: 'allow-as-parameter',
            }],
            '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
            '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
            // In strict mode, minimum description length is set to 10, which is a bit too strict.
            '@typescript-eslint/ban-ts-comment': ['error', { minimumDescriptionLength: 3 }],

            // Enable rules not included in the recommended presets
            '@typescript-eslint/consistent-type-exports': 'error',
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-member-accessibility': 'error',
            '@typescript-eslint/no-loop-func': 'error',
            '@typescript-eslint/no-shadow': 'error',
            '@typescript-eslint/no-unsafe-unary-minus': 'error',
            '@typescript-eslint/no-unused-expressions': 'error',
            '@typescript-eslint/prefer-enum-initializers': 'error',
            '@typescript-eslint/prefer-readonly': 'error',
            '@typescript-eslint/require-array-sort-compare': 'error',
            '@typescript-eslint/return-await': 'error',
            '@typescript-eslint/sort-type-constituents': 'error',

            // Disable certain rules that are enabled by recommended presets

            // Disabled because we rarely use non-null assertions, and if we do,
            // it's only to fix TS false positives.
            '@typescript-eslint/no-non-null-assertion': 'off',

            // Disabled because we explicitly use template literals to convert to
            // strings.
            '@typescript-eslint/restrict-template-expressions': 'off',

            // Temporarily disabled so we can inspect each warning one-by-one
            // TODO: Enable these.
            // We want this one to be enabled, but it'll produce a lot of warnings,
            // so leaving it as a placeholder to enable at the end.
            '@typescript-eslint/prefer-readonly-parameter-types': 'off',
        },
    }];
