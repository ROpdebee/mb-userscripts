module.exports = {
    extends: ['plugin:array-func/recommended'],
    rules: {
        // Enable additional rules not enabled in the recommended preset
        'array-func/prefer-flat': 'error',
        'array-func/prefer-flat-map': 'error',

        // Disable this rule because it conflicts with `unicorn/prefer-spread`
        'array-func/prefer-array-from': 'off',
    },
};
