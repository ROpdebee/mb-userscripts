module.exports = {
    env: {
        node: true,
        es2021: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    plugins: [
        '@typescript-eslint',
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
    },
    overrides: [
        {
            files: ['*.ts'],
            parserOptions: {
                parser: '@typescript-eslint/parser',
            },
            rules: {
                '@typescript-eslint/explicit-function-return-type': ['warn'],
            }
        }]
};
