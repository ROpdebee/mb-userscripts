declare module 'setup-polly-jest/jest-environment-jsdom' {
    import JestJSDOMEnvironment from 'jest-environment-jsdom';
    export default class JSDOMEnvironment extends JestJSDOMEnvironment {}
}
