import command from 'webdriver/build/command';
import { WebDriverProtocol } from '@wdio/protocols';
import Helper from '@codeceptjs/helper';

function overrideFirefoxCommands(browser: WebdriverIO.BrowserObject): void {
    // Old Firefox versions with geckodriver have some incompatibilities.
    // We'll override the commands to fix them here.

    // On old FF versions, these fields are in browser.capabilities.values,
    // not browser.capabilities.
    // @ts-expect-error bad type declarations?
    const { browserName, browserVersion }: typeof browser.capabilities = browser.capabilities.value ?? browser.capabilities;
    if (browserName !== 'firefox' || parseInt(browserVersion?.split('.')[0] ?? '0') > 55) {
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const protocol = WebDriverProtocol as Record<string, Record<string, WDIOProtocols.CommandEndpoint>>;
    // Webdriver declarations are a bit messy.
    const client = browser as unknown as (WebdriverIO.BrowserObject & {isSeleniumStandalone: boolean});

    // For switchToWindow, WebdriverIO uses JSONWire, but FF expects the
    // parameters from the W3C spec.
    const newSwitchToWindowCommand = command('POST', '/session/:sessionId/window', protocol['/session/:sessionId/window']['POST']);
    browser.overwriteCommand('switchToWindow', async (_originalCommand, handle: string) => {
        return newSwitchToWindowCommand.call(client, handle);
    });

    // For sendAlertText, FF expects the same parameters as elementSendKeys,
    // but Webdriver sends other arguments
    const newSpec = {...protocol['/session/:sessionId/alert/text']['POST']};
    newSpec.parameters = [{
        ...newSpec.parameters[0],
        name: 'value',
        type: 'string[]',
    }];
    const newSendAlertTextCommand = command('POST', '/session/:sessionId/alert_text', newSpec);
    browser.overwriteCommand('sendAlertText', async (_originalCommand, text: string) => {
        return newSendAlertTextCommand.call(client, text.split(''));
    });
}

function addWaitUntilNumberOfWindows(browser: WebdriverIO.Browser): void {
    browser.addCommand('waitUntilNumberOfWindows', async function(numberOfWindows: number, waitUntilOptions?: WebdriverIO.WaitUntilOptions) {
        return this.waitUntil(async () => {
            return (await this.getWindowHandles()).length === numberOfWindows;
        }, waitUntilOptions);
    });
}

module.exports = class BrowserCompat extends Helper {
    override _before(): void {
        const { WebDriver } = this.helpers;
        const browser: WebdriverIO.BrowserObject = WebDriver.browser;

        overrideFirefoxCommands(browser);
        addWaitUntilNumberOfWindows(browser);
    }
};
