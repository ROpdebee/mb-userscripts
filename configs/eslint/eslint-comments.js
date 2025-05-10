// @ts-expect-error -- missing type defs
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments/configs';

/** @type {import('eslint/lib/types').Linter.Config[]} */
export default [
    eslintComments.recommended,
    {
        rules: {
            '@eslint-community/eslint-comments/no-unused-disable': 'warn',
            '@eslint-community/eslint-comments/disable-enable-pair': ['warn', {
                allowWholeFile: true,
            }],
        },
    }];
