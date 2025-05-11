import js from '@eslint/js';
import restrictedGlobals from 'confusing-browser-globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
    js.configs.recommended,
    {
        rules: {
            'id-denylist': [
                'error',
                // Clashes with the `it` function used in tests.
                'it',
            ],
            'no-restricted-globals': ['error', 'origin', ...restrictedGlobals],
            'no-restricted-syntax': ['error',
                {
                    // Require non-initialised variables to have a type annotation. Per
                    // https://github.com/typescript-eslint/typescript-eslint/issues/4342#issuecomment-1000452796
                    selector: ':not(ForOfStatement) > VariableDeclaration > VariableDeclarator[init = null] > Identifier.id:not([typeAnnotation])',
                    message: 'Variable declaration without initialiser requires a type annotation',
                }, {
                    // Disallow ES private (#) field and method declarations in favour
                    // of TypeScript access modifiers. ES modifiers need to be
                    // transpiled, TS modifiers only exist at compile time.
                    selector: ':matches(MethodDefinition, PropertyDefinition) > PrivateIdentifier',
                    message: 'Use TypeScript `private` instead.',
                },
            ],
        },
    }];
