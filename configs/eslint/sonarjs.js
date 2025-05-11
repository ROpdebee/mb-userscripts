import sonarjs from 'eslint-plugin-sonarjs';

/** @type {import('eslint').Linter.Config[]} */
export default [
    sonarjs.configs.recommended,
    {
        rules: {
            'sonarjs/no-duplicate-string': 'error',
        },
    }];
