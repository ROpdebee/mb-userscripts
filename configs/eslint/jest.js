import eslintJest from 'eslint-plugin-jest';
import eslintJestExtended from 'eslint-plugin-jest-extended';

/** @type {import('eslint').Linter.Config[]} */
export default [
    eslintJest.configs['flat/all'],
    eslintJestExtended.configs['flat/all'],
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

            // TODO: Enable this one. It'd be better practice not to rely on
            // injected globals but it'll require tinkering with TypeScript
            // declarations so that `jest-extended` `expect` extensions are
            // available.
            'jest/prefer-importing-jest-globals': 'off',

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
            // Test data.
            'sonarjs/pseudo-random': 'off',
            'sonarjs/no-hardcoded-ip': 'off',
            'sonarjs/no-clear-text-protocols': 'off',
            // Doesn't recognise `itBehavesLike` inside a `describe` as a test.
            'sonarjs/no-empty-test-file': 'off',
            // Sonar counts nested `describe` and `it` as nested functions too.
            'sonarjs/no-nested-functions': 'off',
        },
    }];
