/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    },
    setupFilesAfterEnv: ['jest-extended'],
    collectCoverageFrom: [
        'src/**/*.{js,ts}',
    ],
};
