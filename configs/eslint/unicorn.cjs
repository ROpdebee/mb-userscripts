module.exports = {
    extends: ['plugin:unicorn/recommended'],
    rules: {
        // Override configuration defaults for some rules
        'unicorn/better-regex': ['error', {
            sortCharacterClasses: false,
        }],
        'unicorn/numeric-separators-style': ['warn', {
            hexadecimal: {
                minimumDigits: 0,
                groupLength: 8,
            },
        }],
        'unicorn/prevent-abbreviations': ['error', {
            replacements: {
                /* eslint-disable unicorn/prevent-abbreviations -- Chicken and egg problem. */
                elmt: {
                    element: true,
                },
                init: {
                    initial: true,
                    initialize: true,
                    initialization: true,
                },
                img: {
                    image: true,
                },
                resp: {
                    response: true,
                },
                /* eslint-enable unicorn/prevent-abbreviations */
            },
            checkShorthandProperties: true,
            checkProperties: true,
        }],
        'unicorn/switch-case-braces': ['error', 'avoid'],

        // Disable certain rules that are enabled by recommended presets

        // All places where this warned were either led to type errors or were
        // places where in my opinion, an explicit `undefined` reduced confusion.
        'unicorn/no-useless-undefined': 'off',

        // Not available in all supported browsers, and too expensive to polyfill.
        'unicorn/prefer-at': 'off',

        // Not available in `jsdom`, so using it breaks tests.
        'unicorn/prefer-blob-reading-methods': 'off',

        // Too opinionated.
        'unicorn/no-negated-condition': 'off',

        // Too opinionated.
        'unicorn/no-null': 'off',

        // Needed in CI scripts.
        'unicorn/no-process-exit': 'off',

        // Doesn't always work with transpiling into userscripts, ts-node, etc.
        'unicorn/prefer-top-level-await': 'off',
    },
};
