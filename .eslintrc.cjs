const restrictedGlobals = require('confusing-browser-globals');
// For eslint-plugin-simple-import-sort
const builtinModulesJoined = require('module').builtinModules.join('|');

// eslint-config-adjunct is logging stuff to the console, which is breaking
// LSP-eslint in my IDE. This turns off the logging. Need to do it here since
// the LSP plugin doesn't support setting env variables for the command, it seems.
process.env.NO_LOGS = 'true';

module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:eslint-comments/recommended',
        'adjunct',
    ],
    plugins: [
        '@typescript-eslint',
        'deprecation',
        'simple-import-sort',
        'disable',
    ],
    processor: 'disable/disable',
    settings: {
        'disable/plugins': [
            // scanjs-rules is deprecated and its warnings are a bit stupid.
            'scanjs-rules',
            // Too many false positives
            'security',
            'no-secrets',
            'pii',
            'xss',
            // Seems broken and unmaintained?
            'const-case',
        ],
    },
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        project: 'configs/tsconfig.glue-eslint.json',
        extraFileExtensions: ['.cjs'],
    },
    rules: {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single', {
            avoidEscape: true
        }],
        'newline-per-chained-call': 'warn',
        'padded-blocks': ['warn', 'never'],
        'no-multiple-empty-lines': 'warn',

        '@typescript-eslint/semi': ['error', 'always'],
        '@typescript-eslint/comma-spacing': 'error',
        'arrow-parens': ['error', 'always'],
        '@typescript-eslint/comma-dangle': ['warn', 'always-multiline'],
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
        '@typescript-eslint/lines-between-class-members': ['warn', 'always', {
            exceptAfterSingleLine: true,
        }],
        '@typescript-eslint/member-delimiter-style': 'error',
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
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
        '@typescript-eslint/unified-signatures': 'error',

        'unicorn/better-regex': ['warn', {
            sortCharacterClasses: false,
        }],
        'unicorn/catch-error-name': ['warn', {
            name: 'err',
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

        // Disable some recommended rules

        // Disabled because we rarely use non-null assertions, and if we do,
        // it's only to fix TS false positives.
        '@typescript-eslint/no-non-null-assertion': 'off',
        // Disabled because otherwise we have to unnecessarily insert
        // Promise.resolve everywhere.
        '@typescript-eslint/require-await': 'off',
        // Disabled because we explicitly use template literals to convert to
        // strings.
        '@typescript-eslint/restrict-template-expressions': 'off',

        // Temporarily disabled so we can inspect each warning one-by-one
        // TODO: Enable these.
        // We want this one to be enabled, but it'll produce a lot of warnings,
        // so leaving it as a placeholder to enable at the end.
        '@typescript-eslint/prefer-readonly-parameter-types': 'off',

        // I don't agree with this.
        'promise/always-return': 'off',

        // All places where this warned were either led to type errors or were
        // places where in my opinion, an explicit `undefined` reduced confusion.
        'unicorn/no-useless-undefined': 'off',

        // Doesn't always work with transpiling into userscripts, ts-node, etc.
        'unicorn/prefer-top-level-await': 'off',

        'unicorn/no-negated-condition': 'off',
        'unicorn/no-process-exit': 'off',
        // Clashes with switch-case/no-case-curly
        'unicorn/switch-case-braces': 'off',

        // Already included in unicorn/better-regex and doesn't allow disabling the sorting
        'optimize-regex/optimize-regex': 'off',
    },
    overrides: [{
        // Override per eslint-plugin-jest documentation.
        files: ['tests/**'],
        plugins: ['jest'],
        extends: [
            'plugin:jest/all',
            'plugin:jest-formatting/strict',
        ],
        settings: {
            'disable/plugins': [
                'no-unsanitized',
                'scanjs-rules',
                'security',
                'no-secrets',
                'pii',
                'xss',
                'const-case',
            ],
        },
        rules: {
            '@typescript-eslint/unbound-method': 'off',
            'jest/unbound-method': 'error',
            'jest/prefer-expect-assertions': 'off',
            'jest/no-hooks': 'off',
            'jest/require-top-level-describe': 'off',
            'jest/no-conditional-in-test': 'off',
            // Allow shadowing in tests as we sometimes use it to define
            // common data, but refine the data in some specific test cases
            '@typescript-eslint/no-shadow': 'off',
        },
    }, {
        files: ['*.d.ts'],
        rules: {
            '@typescript-eslint/init-declarations': 'off',
            'unicorn/no-static-only-class': 'off',
        },
    }],
};
