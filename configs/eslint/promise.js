// @ts-expect-error -- Missing type declarations.
import pluginPromise from 'eslint-plugin-promise';

/** @type {import('eslint/lib/types').Linter.Config[]} */
export default [
    pluginPromise.configs['flat/recommended'],
    {
        rules: {
            'promise/catch-or-return': ['warn', {
                allowFinally: true,
            }],
            'promise/always-return': ['error', {
                ignoreLastCallback: true,
            }],
        },
    }];
