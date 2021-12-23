const restrictedGlobals = require('confusing-browser-globals');

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
    ],
    plugins: [
        '@typescript-eslint',
        '@delagen/deprecation',
    ],
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
        '@typescript-eslint/semi': ['error', 'always'],
        'arrow-parens': ['error', 'always'],
        '@typescript-eslint/comma-dangle': ['warn', 'always-multiline'],
        'no-restricted-globals': ['error', 'origin'].concat(restrictedGlobals),
        '@delagen/deprecation/deprecation': 'warn',
        'eslint-comments/no-unused-disable': 'warn',
        'eslint-comments/disable-enable-pair': ['warn', {
            allowWholeFile: true
        }],

        // Require non-initialised variables to have a type annotation. Per
        // https://github.com/typescript-eslint/typescript-eslint/issues/4342#issuecomment-1000452796
        'no-restricted-syntax': ['error', {
            selector: ':not(ForOfStatement) > VariableDeclaration > VariableDeclarator[init = null] > Identifier.id:not([typeAnnotation])',
            message: 'Variable declaration without initialiser requires a type annotation'
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
        '@typescript-eslint/member-delimiter-style': 'error',
        '@typescript-eslint/no-base-to-string': 'error',
        '@typescript-eslint/no-confusing-void-expression': 'error',
        '@typescript-eslint/no-invalid-void-type': 'error',
        '@typescript-eslint/no-loop-func': 'error',
        '@typescript-eslint/no-namespace': ['error', {
            allowDeclarations: true
        }],
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-throw-literal': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'error',
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
        '@typescript-eslint/return-await': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/unified-signatures': 'error',

        // Disable some recommended rules

        // Disabled because we rarely use non-null assertions, and if we do,
        // it's only to fix TS false positives.
        '@typescript-eslint/no-non-null-assertion': 'off',

        // Temporarily disabled so we can inspect each warning one-by-one
        // TODO: Enable these.
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/unbound-method': 'off',
        // We want this one to be enabled, but it'll produce a lot of warnings,
        // so leaving it as a placeholder to enable at the end.
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    },
    overrides: [{
            // Override per eslint-plugin-jest documentation.
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
                'jest/require-top-level-describe': 'off',
                // Allow shadowing in tests as we sometimes use it to define
                // common data, but refine the data in some specific test cases
                '@typescript-eslint/no-shadow': 'off',
            },
        }, {
            files: ['*.d.ts'],
            rules: {
                '@typescript-eslint/init-declarations': 'off',
            },
        }],
};
