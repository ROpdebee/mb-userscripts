import fs from 'fs/promises';
import Helper from '@codeceptjs/helper';
import { retryTimes } from '@lib/util/async';

class UserscriptInstaller extends Helper {
    alreadyRan = false;

    override async _before(): Promise<void> {
        const { WebDriver } = this.helpers;
        // If the browser doesn't get restarted between tests and we already
        // installed the userscripts, then we don't need to do it again.
        if (!WebDriver.options.restart && this.alreadyRan) return;

        const userscriptFilenames = (await fs.readdir('./dist'))
            .filter((fileName) => fileName.endsWith('.user.js'));
        await this.installUserscripts(userscriptFilenames);

        this.alreadyRan = true;
    }

    async installUserscripts(userscriptFilenames: string[]): Promise<void> {
        const { WebDriver } = this.helpers;
        const browser: WebdriverIO.BrowserObject = WebDriver.browser;
        // @ts-expect-error incomplete declarations
        const config = this.config;
        const addonBaseUrl: string = config.userscriptManagerBaseUrl;
        const userscriptManagerName: string = config.userscriptManagerName;

        let installer: typeof this.installViolentmonkeyScripts;
        switch(userscriptManagerName) {
        case 'violentmonkey': installer = this.installViolentmonkeyScripts; break;
        case 'tampermonkey': installer = this.installTampermonkeyScripts; break;
        case 'greasemonkey': installer = this.installGreasemonkeyScripts; break;
        case 'greasemonkey3': installer = this.installGreasemonkey3Scripts; break;
        default:
            throw new Error('Unsupported userscript manager: ' + userscriptManagerName);
        }

        return installer.call(this, addonBaseUrl, browser, userscriptFilenames);
    }

    async installViolentmonkeyScripts(vmBaseUrl: string, browser: WebdriverIO.BrowserObject, userscriptFilenames: string[]): Promise<void> {
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

        for (const userscriptName of userscriptFilenames) {
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
            await retryTimes(() => urlInput.setValue(`http://userscriptserver/${userscriptName}`), 5, 100);
            const submitButton = await browser.$('button=OK');
            await submitButton.click();

            // Switch to the newly-opened window. We may need to wait until the window is opened.
            await browser.waitUntilNumberOfWindows(2);
            await browser.switchWindow(new RegExp(`^${vmBaseUrl}/confirm/index\\.html`));

            // Need to wait until the button becomes clickable.
            const installButton = await browser.$('button=Confirm installation');
            await installButton.waitForEnabled({
                timeout: 30000,
            });
            await installButton.click();

            // Close the installation page and switch back to the original page.
            await browser.closeWindow();
            await browser.switchWindow(/./);
        }
    }

    async installTampermonkeyScripts(tmBaseUrl: string, browser: WebdriverIO.BrowserObject, userscriptFilenames: string[]): Promise<void> {
        // Tampermonkey's options page has a utils tab which allows installing
        // userscripts from a URL. We use it here.
        // Tampermonkey also offers a way to export and import .txt and ZIP files
        // containing userscript data. Might be something to look into if this ever
        // starts failing.

        if (!this.alreadyRan) {
            // Tampermonkey spams a changelog when first installed. Wait for it to pop
            // up and close it.
            await browser.waitUntilNumberOfWindows(2, {
                timeout: 5000,
            });
            await browser.switchToWindow((await browser.getWindowHandles())[1]);
            await browser.closeWindow();
            await browser.switchToWindow((await browser.getWindowHandles())[0]);
        }

        await browser.navigateTo(tmBaseUrl + '/options.html#nav=utils');

        for (const userscriptFilename of userscriptFilenames) {
            // Enter script URL into the input box.
            const urlInput = await browser.$('input.updateurl_input');
            await urlInput.setValue(`http://userscriptserver/${userscriptFilename}`);
            const submitButton = await browser.$('input.updateurl_input + .button');
            await submitButton.click();

            // This will open a new tab (although it may take a while), so wait for
            // that to happen and switch the driver to operate on that tab.
            await browser.waitUntilNumberOfWindows(2, {
                timeout: 30000,
            });
            await browser.switchWindow(new RegExp(`^${tmBaseUrl}/ask\\.html`));

            // Grab the userscript name, we'll need it later
            const userscriptName = await (await browser.$('.viewer_info > h3 > span')).getText();

            // Click the confirmation button
            let installButton = await browser.$('input[value="Install"]');
            try {
                await installButton.waitForExist();
            } catch {
                // Old TM versions use a button element
                installButton = await browser.$('button=Install');
                await installButton.waitForExist();
            }
            await installButton.click();

            // Switch back to the original page.
            await browser.switchWindow(/./);

            // Tampermonkey is fairly strict in its cross-origin requests, and asks the
            // user for confirmation. We'll circumvent this by manually adding allow
            // rules to each of the installed scripts. We can't do this in a global
            // configuration, unfortunately, so we need to adjust each script's settings
            // individually.
            // NB: Although it looks like we can extract script IDs from the confirm
            // page, they actually change after the script is installed.

            // Refresh the page to allow TM to register the installation
            await browser.refresh();
            // Switch to the main dashboard. Need to use a character translation
            // hack since old TM versions use  "Installed userscripts" whereas
            // newer ones use "Installed Userscripts"
            await browser.$('//*[translate(text(), "U", "u") = "Installed userscripts"]').then((tab) => tab.click());
            // Find the row with the script we just installed and open its tab
            // TM4.3 truncates the span content if the userscript name is too
            // long, so we have to match by title. However, the span title also
            // includes the userscript description, so we should match a prefix.
            const row = await browser.$(`span[title*="${userscriptName}"]`);
            await row.waitForClickable().then(() => row.click());
            // Open the settings tab within this tab
            await browser.$('.details [tvid="settings"]').then((tab) => tab.click());
            // Find the container for "User domain whitelist" in the XHR security section
            const container = await browser.$('span=User domain whitelist').then((span) => span.parentElement());
            // Click the "Add..." button
            await container.$('button=Add...').then((btn) => btn.click());
            // Enter the '*' wildcard in the resulting prompt
            await browser.sendAlertText('*');
            // Confirm the prompt
            await browser.acceptAlert();
            // Close the editing tab
            await browser.$('.tv_tab_close').then((btn) => btn.click());

            // Navigate back to the utilities tab to install the next script
            await browser.$('//*[text()="Utilities"]').then((tab) => tab.click());
        }
    }

    async installGreasemonkeyScripts(gmBaseUrl: string, browser: WebdriverIO.BrowserObject, userscriptFilenames: string[]): Promise<void> {
        // For Greasemonkey, we load the installation dialog with the URL to the
        // script.

        // To open this dialog, we can't just use browser.newWindow immediately.
        // Access will be denied since we're switching between page and content
        // contexts. We'll have to switch to the GM UI first.
        await browser.navigateTo(`${gmBaseUrl}/src/browser/monkey-menu.html`);

        for (const userscriptFilename of userscriptFilenames) {
            // Need to open in a new tab since it'll close itself automatically.
            // Using browser.newWindow will open a new window instead.
            const userscriptUrl = `http://userscriptserver/${userscriptFilename}`;
            const scriptInstallUrl = `${gmBaseUrl}/src/content/install-dialog.html?${encodeURI(userscriptUrl)}`;
            await browser.executeScript('chrome.tabs.create({ url: arguments[0] });', [scriptInstallUrl]);
            await browser.switchToWindow((await browser.getWindowHandles())[1]);

            const installButton = await browser.$('button=Install');
            // Wait for countdown to end
            const countdown = await installButton.$('span');
            await countdown.waitForExist({
                reverse: true,
            });
            await installButton.click();

            // Sometimes the tab will close itself, sometimes it will not.
            if ((await browser.getWindowHandles()).length > 1) {
                await browser.closeWindow();
            }

            await browser.switchWindow(/./);
        }
    }

    async installGreasemonkey3Scripts(_gmBaseUrl: string, browser: WebdriverIO.BrowserObject, userscriptFilenames: string[]): Promise<void> {
        // GM3 uses a different type of extension which we can't interact with easily.
        // Therefore, we'll use it's API directly.
        // Need to navigate to a chrome:// page to have access to the right context.
        await browser.navigateTo('chrome://greasemonkey/content/options.xul');

        for (const userscriptFilename of userscriptFilenames) {
            await browser.executeAsyncScript(`
                var scriptUrl = arguments[0];
                var done = arguments[1];
                Components.utils.import('chrome://greasemonkey-modules/content/remoteScript.js');
                var remoteScript = new RemoteScript(scriptUrl);

                remoteScript.download(function(status, type) {
                    // We need to wait until we have loaded the dependencies,
                    // otherwise the temporary dir doesn't exist and the script
                    // doesn't actually get installed. Even if the script has
                    // no dependencies, this CB will still be fired.
                    if (!remoteScript.done || type !== 'dependencies') return;
                    remoteScript.install();
                    done();
                });
            `, [`http://userscriptserver/${userscriptFilename}`]);
        }
    }
}

// Dual export to satisfy both Codecept and Typescript.
module.exports = UserscriptInstaller;
export default UserscriptInstaller;
