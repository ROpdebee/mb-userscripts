// ES modules which need to be transformed by babel for use in jest.
const esModules = [
    'node-fetch',
    'p-retry',
    'warcio',
    'conventional-commits-parser',
    // Imported by node-fetch
    'fetch-blob',
    'data-uri-to-buffer',
    'formdata-polyfill',
    // Imported by p-retry
    'is-network-error',
    // Imported by warcio
    'to-data-view',
    'base32-encode',
].join('|');

/** @type {import('@jest/types').Config} */
module.exports = {
    testEnvironment: './tests/unit/utils/extended-jsdom-environment.ts',
    moduleNameMapper: {
        '^@lib/(.*)$': '<rootDir>/src/lib/$1',
        '^@test-utils/(.*)$': '<rootDir>/tests/unit/utils/$1',
        '^@src/(.*)$': '<rootDir>/src/$1',
        // FIXME: For whatever reason, jest cannot resolve this module properly.
        'conventional-commits-parser': '<rootDir>/node_modules/conventional-commits-parser/dist',
    },
    setupFilesAfterEnv: [
        'jest-extended/all',
        './tests/unit/utils/setup-gm-mocks.ts',
    ],
    collectCoverageFrom: [
        'src/**/*.{js,ts}',
        '!**/meta.ts',
    ],
    transformIgnorePatterns: [
        // Don't transform any module in `node_modules`, except for the ES
        // modules. We need to transform ESM because jest expects CJS.
        `/node_modules/(?!${esModules})`,
    ],
    reporters: [
        'default',
        'jest-html-reporters',
    ],
};
