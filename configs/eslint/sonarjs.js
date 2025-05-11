import sonarjs from 'eslint-plugin-sonarjs';

/** @type {import('eslint').Linter.Config[]} */
export default [
    sonarjs.configs.recommended,
    {
        rules: {
            'sonarjs/no-duplicate-string': 'error',

            // Let's not fail CI just because of TODOs and FIXMEs, shall we?
            'sonarjs/fixme-tag': 'off',
            'sonarjs/todo-tag': 'off',

            // This is already covered by TSESLint, no need for more false positives.
            'sonarjs/different-types-comparison': 'off',

            // I disagree with this. Providing a custom name to built-in types is
            // good documentation and enables future refactoring.
            'sonarjs/redundant-type-aliases': 'off',

            // Too much effort, less of a problem in TypeScript.
            'sonarjs/function-return-type': 'off',
        },
    }];
