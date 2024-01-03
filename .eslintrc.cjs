const baseEslintConfig = {
    env: {
        node: true,
        es2021: true,
    },
    extends: [
        './configs/eslint/general.cjs',
        './configs/eslint/typescript.cjs',
        './configs/eslint/style.cjs',
        './configs/eslint/deprecation.cjs',
        './configs/eslint/sort-imports.cjs',
        './configs/eslint/eslint-comments.cjs',
        './configs/eslint/sonarjs.cjs',
        './configs/eslint/unicorn.cjs',
        './configs/eslint/arrays.cjs',
        './configs/eslint/promise.cjs',
        './configs/eslint/no-constructor-bind.cjs',
        './configs/eslint/no-use-extend-native.cjs',
        'plugin:no-unsanitized/DOM',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        project: 'configs/tsconfig.glue-eslint.json',
    },
};

const JAVASCRIPT_EXTENSIONS = ['ts', 'js', 'cjs', 'mjs', 'tsx', 'jsx'];
const JAVASCRIPT_EXTENSIONS_PATTERN = `{${JAVASCRIPT_EXTENSIONS.join(',')}}`;


module.exports = {
    overrides: [{
        files: [`**/*.${JAVASCRIPT_EXTENSIONS_PATTERN}`],
        ...baseEslintConfig,
    }, {
        // Specialised configuration for userscript source files.
        files: [`src/**/*.${JAVASCRIPT_EXTENSIONS_PATTERN}`],
        ...baseEslintConfig,
        env: {
            browser: true,
            es2021: true,
        },
        extends: [
            ...baseEslintConfig.extends,
            './configs/eslint/browser.cjs',
        ],
    }, {
        // Override per eslint-plugin-jest documentation.
        files: [`tests/**/*.${JAVASCRIPT_EXTENSIONS_PATTERN}`],
        ...baseEslintConfig,
        extends: [
            ...baseEslintConfig.extends,
            './configs/eslint/jest.cjs',
        ],
    }, {
        files: ['**/*.d.ts'],
        ...baseEslintConfig,
        rules: {
            // Disable some rules for TypeScript declaration files.
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
