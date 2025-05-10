// @ts-expect-error -- Missing type declarations.
import eslintPluginNoUseExtendNative from 'eslint-plugin-no-use-extend-native';

/** @type {import('eslint/lib/types').Linter.Config[]} */
export default [
    {
        plugins: {
            'no-use-extend-native': eslintPluginNoUseExtendNative,
        },
        rules: {
            'no-use-extend-native/no-use-extend-native': 'error',
        },
    },
]
