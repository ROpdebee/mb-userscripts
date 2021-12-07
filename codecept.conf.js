/* eslint-disable @typescript-eslint/no-var-requires */
require('ts-node').register({
    transpileOnly: true,
    require: ['tsconfig-paths/register'],
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
            url: 'https://localtest.musicbrainz.org/',
            browser: browserName,
            desiredCapabilities: {
                version: browserVersion === 'latest' ? undefined : browserVersion,
                acceptInsecureCerts: true,
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
        musicbrainzDatabase: {
            require: './tests/e2e/setup/DBPlugin',
            enabled: true,
        },
        autoLogin: {
            enabled: true,
            users: {
                user: {
                    /** @param {CodeceptJS.I} I */
                    login: (I) => {
                        I.amOnPage('/login');
                        I.fillField('Username', 'TestBot');
                        I.fillField('Password', 'sekrit');
                        I.checkOption('Keep me logged in');
                        I.click('button=Log In');
                        // Wait until the form is submitted. Not all browsers
                        // do this, apparently.
                        I.waitForText('TestBot', 10, '.menu');
                    },
                    /** @param {CodeceptJS.I} I */
                    check: (I) => {
                        I.amOnPage('/');
                        I.see('TestBot', '.menu');
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
