/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const esModules = ['node-fetch', 'fetch-blob'].join('|');
export default {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    },
    setupFilesAfterEnv: ['jest-extended'],
    collectCoverageFrom: [
        'src/**/*.{js,ts}',
    ],
    transformIgnorePatterns: [
        `/node_modules/(?!${esModules})`,
    ],
};
