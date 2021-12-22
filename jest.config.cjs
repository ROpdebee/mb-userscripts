// ES modules which need to be transformed by babel for use in jest.
const esModules = ['node-fetch', 'fetch-blob', 'p-throttle', 'warcio'].join('|');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    testEnvironment: 'setup-polly-jest/jest-environment-jsdom',
    moduleNameMapper: {
        '^@lib/(.*)$': '<rootDir>/src/lib/$1',
        '^@test-utils/(.*)$': '<rootDir>/tests/utils/$1',
        '^@src/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: [
        'jest-extended/all',
        './tests/utils/setup-gm-mocks.ts',
        './tests/utils/fix-jsdom-env.ts',
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