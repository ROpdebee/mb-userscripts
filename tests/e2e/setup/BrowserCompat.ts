import command from 'webdriver/build/command';
import { WebDriverProtocol } from '@wdio/protocols';
import Helper from '@codeceptjs/helper';

module.exports = class BrowserCompat extends Helper {
    override _before(): void {
        const { WebDriver } = this.helpers;
        const browser: WebdriverIO.BrowserObject = WebDriver.browser;

        // On old FF versions, these fields are in browser.capabilities.values,
        // not browser.capabilities.
        // @ts-expect-error bad type declarations?
        const { browserName, browserVersion }: typeof browser.capabilities = browser.capabilities.value ?? browser.capabilities;

        // Old Firefox versions with geckodriver have problems with switching
        // windows. WebdriverIO uses JSONWire, but FF expects the parameters
        // from the W3C spec.
        if (browserName === 'firefox' && parseInt(browserVersion?.split('.')[0] ?? '0') <= 55) {
            // @ts-expect-error bad type declarations?
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const newCommand = command('POST', '/session/:sessionId/window', WebDriverProtocol['/session/:sessionId/window']['POST']);
            browser.overwriteCommand('switchToWindow', async (_originalCommand, handle) => {
                // @ts-expect-error unsafe?
                return newCommand.call(browser, handle);
            });
        }
    }
};
