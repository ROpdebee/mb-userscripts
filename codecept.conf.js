if (!process.env.profile) throw new Error('profile is required');

const browser = process.env.profile;
const [browserName, browserVersion] = browser.split(':');

exports.config = {
    tests: 'tests/e2e/**/*.test.ts',
    output: './e2e_output',
    helpers: {
        WebDriver: {
            url: 'https://test.musicbrainz.org/',
            browser: browserName,
            desiredCapabilities: {
                version: browserVersion,
            }
        }
    },
    // bootstrap: () => {console.log('hello')},
    name: 'mb-userscripts',
    plugins: {
        pauseOnFail: {},
        retryFailedStep: {
            enabled: true
        },
        tryTo: {
            enabled: true
        },
        screenshotOnFail: {
            enabled: true
        },
        selenoid: {
            enabled: true,
            deletePassed: true,
            autoCreate: true,
            autoStart: true,
            sessionTimeout: '30m',
            enableVideo: true,
            enableLog: true,
        },
    },
};
