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
            },
            restart: false,
        },
        BrowserCompatHelper: {
            require: './tests/e2e/setup/BrowserCompat',
        },
        UserscriptInstaller: {
            require: './tests/e2e/setup/UserscriptInstaller',
            userscriptManagerName: userscriptManagerName,
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
        stepByStepReport: {
            enabled: !process.env.CI,
            deleteSuccessful: false,
        },
        autoLogin: {
            enabled: true,
            users: {
                user: {
                    /** @param {CodeceptJS.I} I */
                    login: (I) => {
                        I.amOnPage('/login');
                        I.fillField('Username', 'ROpdebee');
                        I.fillField('Password', 'mb');  // We should be running on test.MB, where all passwords were reset
                        I.checkOption('Keep me logged in');
                        I.click('button=Log In');
                        // Wait until the form is submitted. Not all browsers
                        // do this, apparently.
                        I.waitInUrl('ROpdebee', 5);
                        I.see('ROpdebee', '.menu');
                    },
                    /** @param {CodeceptJS.I} I */
                    check: (I) => {
                        I.amOnPage('/');
                        I.see('ROpdebee', '.menu');
                    },
                },
            },
        },
        selenoid: {
            enabled: true,
            autoCreate: false,
            autoStart: false,
            sessionTimeout: '5m',
            // Don't enable video or logging on CI, since it slows runs down.
            enableVideo: !process.env.CI,
            enableLog: !process.env.CI,
            deletePassed: !!process.env.CI,
        },
    },
};
