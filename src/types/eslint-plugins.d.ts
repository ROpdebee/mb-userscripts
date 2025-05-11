// Type declarations for untyped ESLint plugins.

declare module 'eslint-plugin-array-func' {
    import type { Linter } from 'eslint';

    export const configs: {
        all: Linter.Config;
        recommended: Linter.Config;
    }
}

declare module 'eslint-plugin-no-unsanitized' {
    import type { Linter } from 'eslint';

    export const configs: {
        recommended: Linter.Config;
    };
}

declare module '@eslint-community/eslint-plugin-eslint-comments/configs' {
    import type { Linter } from 'eslint';

    const plugin: {
        recommended: Linter.Config;
    };
    export default plugin;
}

declare module 'eslint-plugin-no-use-extend-native' {
    import type { ESLint } from 'eslint';

    const plugin: ESLint.Plugin;
    export default plugin;
}

declare module 'eslint-plugin-promise' {
    import type { Linter } from 'eslint';

    export const configs: Record<string, Linter.Config>;
}

declare module 'eslint-plugin-json' {
    import type { Linter } from 'eslint';

    export const configs: Record<string, Linter.Config>;
}
