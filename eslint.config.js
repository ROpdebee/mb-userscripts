import eslintJson from 'eslint-plugin-json';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import arrays from './configs/eslint/arrays.js';
import browser from './configs/eslint/browser.js';
import eslintComments from './configs/eslint/eslint-comments.js';
import general from './configs/eslint/general.js';
import jest from './configs/eslint/jest.js';
import noUseExtendNative from './configs/eslint/no-use-extend-native.js';
import promise from './configs/eslint/promise.js';
import sonarjs from './configs/eslint/sonarjs.js';
import sortImports from './configs/eslint/sort-imports.js';
import style from './configs/eslint/style.js';
import typescript from './configs/eslint/typescript.js';
import unicorn from './configs/eslint/unicorn.js';

const nodeGlobals = {
    ...globals.node,
    ...globals.es2021,
};

const browserGlobals = {
    ...globals.browser,
    ...globals.es2021,
};

/** @type {import('typescript-eslint/dist/config-helper').ConfigWithExtends} */
const baseEslintConfig = {
    languageOptions: {
        parserOptions: {
            ecmaVersion: 12,
            sourceType: 'module',
            project: 'configs/tsconfig.glue-eslint.json',
        },
        globals: nodeGlobals,
    },
    extends: [
        ...general,
        ...typescript,
        ...style,
        ...sortImports,
        ...eslintComments,
        ...sonarjs,
        ...unicorn,
        ...arrays,
        ...promise,
        ...noUseExtendNative,
    ],
};

const JAVASCRIPT_EXTENSIONS = ['ts', 'js', 'cjs', 'mjs', 'tsx', 'jsx'];
const JAVASCRIPT_EXTENSIONS_PATTERN = `{${JAVASCRIPT_EXTENSIONS.join(',')}}`;

export default tseslint.config({
    ignores: [
        './dist/**',
        './coverage/*',
        // Ignore top-level scripts for now
        './mb_*.js',
        './lib/*',
        './node_modules/**',
        './.tsc-build/**',
        // Auxiliary files of jest HTML reporter
        './jest-html-reporters-attach/**',
    ],
}, {
    files: [`**/*.${JAVASCRIPT_EXTENSIONS_PATTERN}`],
    ...baseEslintConfig,
}, {
    // Specialised configuration for userscript source files.
    files: [`src/**/*.${JAVASCRIPT_EXTENSIONS_PATTERN}`],
    ...baseEslintConfig,
    languageOptions: {
        ...baseEslintConfig.languageOptions,
        globals: browserGlobals,
    },
    extends: [
        ...baseEslintConfig.extends ?? [],
        browser,
    ],
}, {
    // Override per eslint-plugin-jest documentation.
    files: [`tests/**/*.${JAVASCRIPT_EXTENSIONS_PATTERN}`],
    ...baseEslintConfig,
    extends: [
        ...baseEslintConfig.extends ?? [],
        jest,
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
    extends: [eslintJson.configs.recommended],
}, {
    files: ['**/tsconfig*.json'],
    extends: [eslintJson.configs['recommended-with-comments']],
});
