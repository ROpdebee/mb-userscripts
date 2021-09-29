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
    ],
    plugins: [
        '@typescript-eslint',
        'jest',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    ignorePatterns: [
        'dist/',
        'node_modules/',
        // Ignore top-level scripts for now
        'mb_*.js',
        'lib/',
    ],
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
                '@typescript-eslint/array-type': ['warn', {
                    default: 'array-simple',
                }],
                '@typescript-eslint/consistent-indexed-object-style': ['warn', 'record'],
                '@typescript-eslint/consistent-type-assertions': ['warn', {
                    assertionStyle: 'as',
                    objectLiteralTypeAssertions: 'allow-as-parameter',
                }],
                '@typescript-eslint/consistent-type-imports': ['warn', {
                    prefer: 'type-imports',
                    disallowTypeAnnotations: true,
                }],
                '@typescript-eslint/explicit-function-return-type': ['warn'],
                '@typescript-eslint/member-delimiter-style': ['warn', {
                    multiline: {
                        delimiter: 'none',
                    },
                }],
                '@typescript-eslint/no-base-to-string': ['warn'],
                '@typescript-eslint/no-confusing-void-expression': ['warn'],
                '@typescript-eslint/no-invalid-void-type': ['warn'],
                '@typescript-eslint/no-unnecessary-condition': ['warn'],
                '@typescript-eslint/no-unsafe-argument': ['warn'],
                '@typescript-eslint/prefer-nullish-coalescing': ['warn'],
                '@typescript-eslint/prefer-optional-chain': ['warn'],
                '@typescript-eslint/prefer-reduce-type-parameter': ['warn'],
                '@typescript-eslint/prefer-ts-expect-error': ['warn'],
                '@typescript-eslint/type-annotation-spacing': ['warn'],
            }
        }, { // Override per eslint-plugin-jest documentation.
            files: ['tests/**'],
            plugins: ['jest'],
            rules: {
                '@typescript-eslint/unbound-method': 'off',
                'jest/unbound-method': 'error',
            },
        }]
};
