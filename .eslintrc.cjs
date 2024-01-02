const restrictedGlobals = require('confusing-browser-globals');
// For eslint-plugin-simple-import-sort
const builtinModulesJoined = require('module').builtinModules.join('|');
const stylistic = require('@stylistic/eslint-plugin');

const stylisticCustom = stylistic.configs.customize({
    flat: false,
    indent: 4,
    quotes: 'single',
    semi: true,
    braceStyle: '1tbs',
    jsx: true,
    arrowParens: true,
});

const stylisticRules = {
    ...stylisticCustom.rules,
    // @stylistic sets an override to forbid semicolons in multiline interfaces.
    // We want them anyway.
    '@stylistic/member-delimiter-style': ['error', {
        overrides: {}
    }],
    // @stylistic sets `avoidEscape` to false.
    '@stylistic/quotes': ['error', 'single', {
        avoidEscape: true,
    }],
}

const baseJsConfig = {
    env: {
        node: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'plugin:eslint-comments/recommended',
        'plugin:sonarjs/recommended',
        'plugin:unicorn/recommended',
        'plugin:array-func/recommended',
        'plugin:promise/recommended',
        'plugin:no-unsanitized/DOM',
    ],
    plugins: [
        '@typescript-eslint',
        '@stylistic',
        'deprecation',
        'simple-import-sort',
        'no-constructor-bind',
        'no-use-extend-native',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        project: 'configs/tsconfig.glue-eslint.json',
    },
    rules: {
        'no-constructor-bind/no-constructor-bind': 'error',
        'no-constructor-bind/no-constructor-state': 'error',
        'no-use-extend-native/no-use-extend-native': 'error',

        'no-restricted-globals': ['error', 'origin'].concat(restrictedGlobals),
        'deprecation/deprecation': 'warn',
        'eslint-comments/no-unused-disable': 'warn',
        'eslint-comments/disable-enable-pair': ['warn', {
            allowWholeFile: true
        }],
        'simple-import-sort/imports': ['error', {
            groups: [
                // For each group, put type-only imports (ending with null character) first.
                // Side-effect imports
                ['^\\u0000'],
                // Node builtin modules
                [`^(?:node:)?(${builtinModulesJoined})(/.*)?\\u0000$`, `^(?:node:)?(${builtinModulesJoined})(/|$)`],
                // 3rd party packages. Need a negative lookahead in the first
                // to prevent type-only imports from our mapped paths from matching.
                // Doesn't matter for the second one, since simple-import-sort
                // prefers the longer match, and the group below will always have
                // the longer match.
                ['^@?(?!src|test-utils|lib)\\w.*\\u0000$', '^@?\\w'],
                // Our aliases
                ['^@(src|test-utils|lib).*\\u0000$', '^@(src|test-utils|lib).*'],
                // Relative imports, parent first, then current directory
                ['^\\.\\..*\\u0000', '^\\..*\\u0000', '^\\.\\.', '^\\.'],
                // Styles and constants
                ['^consts:.+', '^.+\\.s?css$'],
            ],
        }],
        'simple-import-sort/exports': 'error',

        // Restrict certain variable names.
        'id-denylist': [
            'error',
            // Clashes with the `it` function used in tests.
            'it',
        ],

        'no-restricted-syntax': [
            'error', {
                // Require non-initialised variables to have a type annotation. Per
                // https://github.com/typescript-eslint/typescript-eslint/issues/4342#issuecomment-1000452796
                selector: ':not(ForOfStatement) > VariableDeclaration > VariableDeclarator[init = null] > Identifier.id:not([typeAnnotation])',
                message: 'Variable declaration without initialiser requires a type annotation'
            }, {
                // Disallow ES private (#) field and method declarations in favour
                // of TypeScript access modifiers. ES modifiers need to be
                // transpiled, TS modifiers only exist at compile time.
                selector: ':matches(MethodDefinition, PropertyDefinition) > PrivateIdentifier',
                message: 'Use TypeScript `private` instead.'
            }],

        // TypeScript-specific linting rules as the default, since 99% of the
        // linted files are TS.
        '@typescript-eslint/array-type': ['error', {
            default: 'array-simple'
        }],
        '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
        '@typescript-eslint/consistent-type-assertions': ['error', {
            assertionStyle: 'as',
            objectLiteralTypeAssertions: 'allow-as-parameter',
        }],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/consistent-type-imports': ['error', {
            prefer: 'type-imports',
            disallowTypeAnnotations: true,
        }],
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-member-accessibility': 'error',
        '@typescript-eslint/no-base-to-string': 'error',
        '@typescript-eslint/no-confusing-void-expression': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-invalid-void-type': 'error',
        '@typescript-eslint/no-loop-func': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/no-namespace': ['error', {
            allowDeclarations: true
        }],
        '@typescript-eslint/no-redundant-type-constituents': 'error',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-throw-literal': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'error',
        '@typescript-eslint/no-unsafe-argument': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'error',
        '@typescript-eslint/no-unsafe-call': 'error',
        '@typescript-eslint/no-unsafe-member-access': 'error',
        '@typescript-eslint/no-unsafe-return': 'error',
        '@typescript-eslint/no-unused-expressions': 'error',
        '@typescript-eslint/non-nullable-type-assertion-style': 'error',
        '@typescript-eslint/prefer-enum-initializers': 'error',
        '@typescript-eslint/prefer-for-of': 'error',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/prefer-includes': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/prefer-readonly': 'error',
        '@typescript-eslint/prefer-reduce-type-parameter': 'error',
        '@typescript-eslint/prefer-return-this-type': 'error',
        '@typescript-eslint/prefer-string-starts-ends-with': 'error',
        '@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/require-array-sort-compare': 'error',
        '@typescript-eslint/restrict-plus-operands': 'error',
        '@typescript-eslint/return-await': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
        '@typescript-eslint/unified-signatures': 'error',

        'unicorn/better-regex': ['warn', {
            sortCharacterClasses: false,
        }],
        'unicorn/numeric-separators-style': ['warn', {
            hexadecimal: {
                minimumDigits: 0,
                groupLength: 8,
            },
        }],
        'promise/catch-or-return': ['warn', {
            allowFinally: true,
        }],
        'promise/always-return': ['error', {
            ignoreLastCallback: true,
        }],
        'unicorn/switch-case-braces': ['error', 'avoid'],

        // Disable some recommended rules

        // Disabled because we rarely use non-null assertions, and if we do,
        // it's only to fix TS false positives.
        '@typescript-eslint/no-non-null-assertion': 'off',
        // Disabled because we explicitly use template literals to convert to
        // strings.
        '@typescript-eslint/restrict-template-expressions': 'off',

        // Temporarily disabled so we can inspect each warning one-by-one
        // TODO: Enable these.
        // We want this one to be enabled, but it'll produce a lot of warnings,
        // so leaving it as a placeholder to enable at the end.
        '@typescript-eslint/prefer-readonly-parameter-types': 'off',

        // All places where this warned were either led to type errors or were
        // places where in my opinion, an explicit `undefined` reduced confusion.
        'unicorn/no-useless-undefined': 'off',

        // Not available in browsers, and too expensive to polyfill.
        'unicorn/prefer-at': 'off',
        'unicorn/prefer-blob-reading-methods': 'off',  // Actually not available in jsdom, used in tests.
        'unicorn/prefer-string-replace-all': 'off',

        // Doesn't always work with transpiling into userscripts, ts-node, etc.
        'unicorn/prefer-top-level-await': 'off',

        'unicorn/no-negated-condition': 'off',
        'unicorn/no-process-exit': 'off',

        'unicorn/filename-case': 'error',
        'unicorn/no-array-for-each': 'error',
        'unicorn/no-null': 'off',
        'unicorn/prefer-number-properties': 'error',
        'unicorn/prefer-optional-catch-binding': 'error',
        'unicorn/prevent-abbreviations': ['error', {
            replacements: {
                'elmt': {
                    'element': true,
                },
                'init': {
                    'initial': true,
                    'initialize': true,
                    'initialization': true,
                },
                'img': {
                    'image': true,
                },
                'resp': {
                    'response': true,
                }
            },
            checkShorthandProperties: true,
            checkProperties: true,
        }],
        'sonarjs/no-duplicate-string': 'error',
        // Conflicts with unicorn/prefer-spread
        'array-func/prefer-array-from': 'off',
        'array-func/prefer-flat': 'error',
        'array-func/prefer-flat-map': 'error',

        ...stylisticRules,
    },
};

const JAVASCRIPT_EXTENSIONS = ['ts', 'js', 'cjs', 'mjs', 'tsx', 'jsx'];
const JAVASCRIPT_EXTENSIONS_PATTERN = `{${JAVASCRIPT_EXTENSIONS.join(',')}}`;


module.exports = {
    overrides: [{
        files: [`**/*.${JAVASCRIPT_EXTENSIONS_PATTERN}`],
        ...baseJsConfig,
    }, {
        // Override per eslint-plugin-jest documentation.
        files: [`tests/**/*.${JAVASCRIPT_EXTENSIONS_PATTERN}`],
        ...baseJsConfig,
        plugins: [
            ...baseJsConfig.plugins,
            'jest',
        ],
        extends: [
            ...baseJsConfig.extends,
            'plugin:jest/all',
            'plugin:jest-formatting/strict',
        ],
        rules: {
            ...baseJsConfig.rules,
            '@typescript-eslint/unbound-method': 'off',
            'jest/unbound-method': 'error',
            'jest/prefer-expect-assertions': 'off',
            'jest/no-hooks': 'off',
            'jest/require-top-level-describe': 'off',
            'jest/no-conditional-in-test': 'off',
            // Allow shadowing in tests as we sometimes use it to define
            // common data, but refine the data in some specific test cases
            '@typescript-eslint/no-shadow': 'off',
            // Turn off this stylistic rule because we need the ["key"] notation
            // to access private object properties.
            '@typescript-eslint/dot-notation': 'off',
            // Turn off the warnings emitted by the `no-unsanitized` plugin.
            // These are non-issues in tests.
            'no-unsanitized/method': 'off',
            'no-unsanitized/property': 'off',
            // Strings are often repeated in test code, which is not a big problem.
            'sonarjs/no-duplicate-string': 'off',
        },
    }, {
        files: ['**/*.d.ts'],
        ...baseJsConfig,
        rules: {
            ...baseJsConfig.rules,
            '@typescript-eslint/init-declarations': 'off',
            'unicorn/no-static-only-class': 'off',
        },
    }, {
        files: ['**/*.json'],
        extends: ["plugin:json/recommended"],
    }, {
        files: ['**/tsconfig*.json'],
        extends: ["plugin:json/recommended-with-comments"],
    }],
};
