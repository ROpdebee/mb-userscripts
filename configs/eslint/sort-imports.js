import simpleImportSort from 'eslint-plugin-simple-import-sort';

import { builtinModules } from 'node:module';
const builtinModulesJoined = builtinModules.join('|');

/** @type {import('eslint').Linter.Config[]} */
export default [{
    plugins: {
        'simple-import-sort': simpleImportSort,
    },
    rules: {
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
    },
}];
