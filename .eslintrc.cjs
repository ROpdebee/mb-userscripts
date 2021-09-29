module.exports = {
    env: {
        node: true,
        es2021: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/all',
        'plugin:jest-formatting/strict',
    ],
    plugins: [
        '@typescript-eslint',
        'jest',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
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
            'single'
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
                '@typescript-eslint/member-delimiter-style': ['error', {
                    multiline: {
                        delimiter: 'none',
                    },
                }],
                '@typescript-eslint/no-base-to-string': ['error'],
                '@typescript-eslint/no-confusing-void-expression': ['error'],
                '@typescript-eslint/no-invalid-void-type': ['error'],
                '@typescript-eslint/no-unnecessary-condition': ['error'],
                '@typescript-eslint/no-unsafe-argument': ['error'],
                '@typescript-eslint/prefer-nullish-coalescing': ['error'],
                '@typescript-eslint/prefer-optional-chain': ['error'],
                '@typescript-eslint/prefer-reduce-type-parameter': ['error'],
                '@typescript-eslint/prefer-ts-expect-error': ['error'],
                '@typescript-eslint/type-annotation-spacing': ['error'],
            }
        }, { // Override per eslint-plugin-jest documentation.
            files: ['tests/**'],
            plugins: ['jest'],
            rules: {
                '@typescript-eslint/unbound-method': 'off',
                'jest/unbound-method': 'error',
                'jest/prefer-expect-assertions': 'off',
                'jest/no-hooks': 'off',
            },
        }]
};
