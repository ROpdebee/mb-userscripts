import command from 'webdriver/build/command';
import { WebDriverProtocol } from '@wdio/protocols';
import Helper from '@codeceptjs/helper';
import type nodeFetchType from 'node-fetch';
import { dynamicImport } from './superUglyNodeModulesESMImportWorkaround';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type nodeFetchType = typeof import('node-fetch')['default'];
const fetch = dynamicImport<nodeFetchType>('node-fetch', 'default');

type ProtocolType = Record<string, Record<string, WDIOProtocols.CommandEndpoint>>;

function setCommandFromSpec(
    browser: WebdriverIO.BrowserObject,
    protocol: ProtocolType, name: string, method: string, endpoint: string,
    options?: { attachToElement?: boolean; newCommand?: boolean },
): void {
    const newCommand = command(method, endpoint, protocol[endpoint][method]);
    const client = browser as unknown as (WebdriverIO.BrowserObject & { isSeleniumStandalone: boolean });
    if (options?.newCommand) {
        browser.addCommand(name, async function(...args: unknown[]) {
            return newCommand.call(client, ...args);
        }, options.attachToElement);
    } else {
        browser.overwriteCommand(name as keyof WebdriverIO.BrowserObject, async (_originalCommand, ...args: unknown[]) => {
            return newCommand.call(client, ...args);
        }, options?.attachToElement);
    }
}

function getBrowserVersion(browser: WebdriverIO.BrowserObject): { name: string; major: number } {
    // On old FF versions, these fields are in browser.capabilities.values,
    // not browser.capabilities.
    // @ts-expect-error bad type declarations?
    const { browserName, browserVersion }: typeof browser.capabilities = browser.capabilities.value ?? browser.capabilities;
    return {
        name: browserName ?? '',
        major: parseInt(browserVersion?.split('.')[0] ?? '0'),
    };
}

function overrideFirefoxCommands(browser: WebdriverIO.BrowserObject): void {
    // Old Firefox versions with geckodriver have some incompatibilities.
    // We'll override the commands to fix them here.

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const protocol = WebDriverProtocol as Record<string, Record<string, WDIOProtocols.CommandEndpoint>>;
    // Webdriver declarations are a bit messy.
    const client = browser as unknown as (WebdriverIO.BrowserObject & {isSeleniumStandalone: boolean});

    const browserInfo = getBrowserVersion(browser);
    if (browserInfo.name !== 'firefox' || browserInfo.major > 52) {
        return;
    }

    // For switchToWindow, WebdriverIO uses JSONWire, but FF expects the
    // parameters from the W3C spec.
    setCommandFromSpec(browser, protocol, 'switchToWindow', 'POST', '/session/:sessionId/window');

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

function addWaitUntilNumberOfWindows(browser: WebdriverIO.BrowserObject): void {
    browser.addCommand('waitUntilNumberOfWindows', async function(numberOfWindows: number, waitUntilOptions?: WebdriverIO.WaitUntilOptions) {
        return this.waitUntil(async () => {
            return (await this.getWindowHandles()).length === numberOfWindows;
        }, waitUntilOptions);
    });
}

class BrowserCompat extends Helper {
    override _before(): void {
        overrideFirefoxCommands(this._browser);
        addWaitUntilNumberOfWindows(this._browser);
    }

    get _webdriver(): CodeceptJS.WebDriver {
        return this.helpers.WebDriver;
    }

    get _browser(): WebdriverIO.BrowserObject {
        // @ts-expect-error Bad type declarations
        return this._webdriver.browser;
    }

    async pasteText(selector: CodeceptJS.LocatorOrString, text: string): Promise<void> {
        // The codecept typings are a bit wrong, but WebDriver._locate returns
        // an array of Webdriver elements that match the selector.
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
        const fieldEls = await (this._webdriver._locate(selector) as unknown as Promise<WebdriverIO.ElementArray>);

        // We can't use setValue because it types out every character
        // individually, we want them all at once.

        // Old Selenoid images do not support setting clipboard values, so set
        // the value programmatically by running JS on the page.
        const browserInfo = getBrowserVersion(this._browser);
        if ((browserInfo.name === 'firefox' && browserInfo.major <= 52)
            || (browserInfo.name === 'chrome' && browserInfo.major <= 64)) {
            await this._browser.executeScript(`
                arguments[0].value = arguments[1];
                arguments[0].dispatchEvent(new Event('input'));
            `, [fieldEls[0], text]);
            return;
        }

        // Send text to clipboard through Selenoid
        const clipboardApiUrl = 'http://localhost:4444/clipboard/' + this._browser.sessionId;
        await (await fetch)(clipboardApiUrl, {
            method: 'POST',
            body: text,
        });

        await fieldEls[0].setValue(['Control', 'V']);
    }
}

export default BrowserCompat;
module.exports = BrowserCompat;
