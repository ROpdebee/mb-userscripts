import restrictedGlobals from 'confusing-browser-globals';
// @ts-expect-error -- Missing type declarations.
import nounsanitized from 'eslint-plugin-no-unsanitized';

/** @type {import('eslint/lib/types').Linter.Config[]} */
export default [
    nounsanitized.configs.recommended,
    {
        rules: {
            // Also restrict usage of the GM object, we should always go through the
            // compat layer. Restrict the usage of `fetch` too, we should use the
            // unified request interface instead.
            'no-restricted-globals': ['error', 'origin', 'GM', 'fetch', ...restrictedGlobals],
        },
    }];
