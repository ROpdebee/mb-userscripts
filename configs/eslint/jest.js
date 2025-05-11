import eslintJest from 'eslint-plugin-jest';

/** @type {import('eslint').Linter.Config[]} */
export default [
    eslintJest.configs['flat/all'],
    {
        plugins: {
            jest: eslintJest,
        },
        rules: {
            // Enable rules not covered by recommended preset.
            'jest/unbound-method': 'error',

            //
            // Disable some rules for specific reasons.
            //

            // I disagree.
            'jest/no-conditional-in-test': 'off',

            // Unreasonable.
            'jest/no-hooks': 'off',

            // Too verbose.
            'jest/prefer-expect-assertions': 'off',

            // Too verbose, already implied by test file name.
            'jest/require-top-level-describe': 'off',

            //
            // Disable rules from other presets that conflict with testing code.
            //

            // Turn off this stylistic rule because we need the ["key"] notation
            // to access private object properties.
            '@typescript-eslint/dot-notation': 'off',

            // Allow shadowing in tests as we sometimes use it to define
            // common data, but refine the data in some specific test cases
            '@typescript-eslint/no-shadow': 'off',

            // Conflicts with `jest/unbound-method`.
            '@typescript-eslint/unbound-method': 'off',

            // Turn off the warnings emitted by the `no-unsanitized` plugin.
            // These are non-issues in tests.
            'no-unsanitized/method': 'off',
            'no-unsanitized/property': 'off',

            // Strings are often repeated in test code, which is not a big problem.
            'sonarjs/no-duplicate-string': 'off',
        },
    }];
