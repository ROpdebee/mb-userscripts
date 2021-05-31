module.exports = {
    env: {
        node: true,
        es2021: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    ignorePatterns: [
        'dist/',
        'node_modules/',
        'tmp_build/',
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
    }
};
