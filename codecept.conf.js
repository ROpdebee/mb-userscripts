/* eslint-disable @typescript-eslint/no-var-requires */
require('ts-node').register({
    transpileOnly: true,
});
const installUserscriptEngine = require('./tests/e2e/setup/UserscriptAddons').default;

if (!process.env.profile) throw new Error('profile is required');

const [browser, userscriptManagerName] = process.env.profile.split('/');
if (!browser || !userscriptManagerName) throw new Error('malformed profile');
const [browserName, browserVersion] = browser.split(':');

exports.config = {
    tests: 'tests/e2e/**/*.test.ts',
    output: './tests/e2e/output',
    helpers: {
        WebDriver: {
            url: 'https://test.musicbrainz.org/',
            browser: browserName,
            desiredCapabilities: {
                version: browserVersion === 'latest' ? undefined : browserVersion,
            }
        },
        UserscriptInstaller: {
            require: './tests/e2e/setup/UserscriptInstaller',
            userscriptManagerName: userscriptManagerName,
        },
        BrowserCompatHelper: {
            require: './tests/e2e/setup/BrowserCompat',
        },
    },
    bootstrap: async () => installUserscriptEngine(browserName, browserVersion, userscriptManagerName),
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
            deletePassed: false,
            autoCreate: false,
            autoStart: false,
            sessionTimeout: '30m',
            enableVideo: true,
            enableLog: true,
            enableVnc: true,
        },
    },
};
