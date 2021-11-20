import Helper from '@codeceptjs/helper';
import { retryTimes } from '../../../src/lib/util/async';
import { recorder } from 'codeceptjs';

async function installViolentmonkeyScripts(vmBaseUrl: string, browser: WebdriverIO.BrowserObject): Promise<void> {
    // To install scripts in VM, there are a number of different options.
    // One is to navigate the browser to the userscript URL on the userscript
    // server, however, this breaks in Firefox, as this will hang the driver.
    // This is potentially related to https://bugzilla.mozilla.org/show_bug.cgi?id=1418273
    // as VM intercepts the page load to displays its installation page.
    //
    // Another option is to open the VM page and call some JS function through
    // browser.executeScript, however, VM's source is webpacked, so retrieving
    // those functions is impossible.
    //
    // Thirdly, we could open the "New userscript" dialog and paste the sources
    // in, but that could be slow and is somewhat tricky.
    //
    // The option we're going with is to use automating the browser through
    // "Install from URL".

    await browser.navigateTo(vmBaseUrl + '/options/index.html');
    // Open the dropdown menu
    const dropdownButton = await browser.$('.vl-dropdown-toggle');
    await dropdownButton.click();

    // Open the install from URL dialog
    const importFromUrlAnchor = await browser.$('a=Install from URL');
    await importFromUrlAnchor.click();

    // Enter the URL and submit
    const urlInput = await browser.$('.vl-modal input');
    // On Chrome, we don't seem to be able to set the value immediately, possibly
    // because of the animation of the dialog. We can't really wait for that to
    // be done, so retry on failure.
    await retryTimes(() => urlInput.setValue('http://userscriptserver/mb_enhanced_cover_art_uploads.user.js'), 5, 100);
    const submitButton = await browser.$('button=OK');
    await submitButton.click();

    // Switch to the newly-opened window. We may need to wait until the window is opened.
    await browser.waitUntil(async () => (await browser.getWindowHandles()).length > 1);
    await browser.switchWindow(new RegExp(`^${vmBaseUrl}/confirm/index\\.html`));

    // Need to wait until the button becomes clickable.
    const installButton = await browser.$('button=Confirm installation');
    await installButton.waitForEnabled({
        timeout: 5000,
    });
    await installButton.click();

    // Close the installation page and switch back to the original page.
    await browser.closeWindow();
    await browser.switchWindow(/./);
}

module.exports = class UserscriptInstaller extends Helper {
    override _before(): void {
        recorder.add('install userscripts', async () => {
            const { WebDriver } = this.helpers;
            const browser: WebdriverIO.BrowserObject = WebDriver.browser;
            // @ts-expect-error incomplete declarations
            const config = this.config;
            const addonBaseUrl: string = config.userscriptManagerBaseUrl;
            const userscriptManagerName: string = config.userscriptManagerName;

            switch(userscriptManagerName) {
            case 'violentmonkey':
                await installViolentmonkeyScripts(addonBaseUrl, browser);
                break;
            default:
                throw new Error('Unsupported userscript manager: ' + userscriptManagerName);
            }
        });
    }
};
