const restrictedGlobals = require('confusing-browser-globals');

module.exports = {
    env: {
        node: true,
        es2021: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:eslint-comments/recommended',
    ],
    plugins: [
        '@typescript-eslint',
        '@delagen/deprecation',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    rules: {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single',
            {
                avoidEscape: true,
            }
        ],
        'semi': [
            'error',
            'always'
        ],
        'arrow-parens': [
            'error',
            'always',
        ],
        'jest/unbound-method': ['off'],
        'no-restricted-globals': ['error', 'origin'].concat(restrictedGlobals),
        '@delagen/deprecation/deprecation': ['warn'],
        'eslint-comments/no-unused-disable': 'warn',
        'eslint-comments/disable-enable-pair': ['warn', { allowWholeFile: true }],
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            parserOptions: {
                parser: '@typescript-eslint/parser',
                project: './tsconfig.json',
            },
            rules: {
                '@typescript-eslint/array-type': ['error', {
                    default: 'array-simple',
                }],
                '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
                '@typescript-eslint/consistent-type-assertions': ['error', {
                    assertionStyle: 'as',
                    objectLiteralTypeAssertions: 'allow-as-parameter',
                }],
                '@typescript-eslint/consistent-type-imports': ['error', {
                    prefer: 'type-imports',
                    disallowTypeAnnotations: true,
                }],
                '@typescript-eslint/explicit-function-return-type': ['error'],
                '@typescript-eslint/member-delimiter-style': ['error'],
                '@typescript-eslint/no-base-to-string': ['error'],
                '@typescript-eslint/no-confusing-void-expression': ['error'],
                '@typescript-eslint/no-invalid-void-type': ['error'],
                '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
                '@typescript-eslint/no-unnecessary-condition': ['error'],
                '@typescript-eslint/no-unsafe-argument': ['error'],
                '@typescript-eslint/prefer-nullish-coalescing': ['error'],
                '@typescript-eslint/prefer-optional-chain': ['error'],
                '@typescript-eslint/prefer-reduce-type-parameter': ['error'],
                '@typescript-eslint/prefer-ts-expect-error': ['error'],
                '@typescript-eslint/require-array-sort-compare': ['error'],
                '@typescript-eslint/type-annotation-spacing': ['error'],
            }
        }, { // Override per eslint-plugin-jest documentation.
            files: ['tests/**'],
            plugins: ['jest'],
            extends: [
                'plugin:jest/all',
                'plugin:jest-formatting/strict',
            ],
            rules: {
                '@typescript-eslint/unbound-method': 'off',
                'jest/unbound-method': 'error',
                'jest/prefer-expect-assertions': 'off',
                'jest/no-hooks': 'off',
                'jest/require-top-level-describe': 'off'
            },
        }]
};
