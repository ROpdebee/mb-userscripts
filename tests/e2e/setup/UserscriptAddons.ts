import { writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';

import { container } from 'codeceptjs';
import FirefoxProfile from 'firefox-profile';

// Ugly workaround for TS issue where it transpiles dynamic imports to require()
// calls, leading to node errors.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
const fetch: Promise<typeof import('node-fetch')['default']> = eval('import("node-fetch").then((mod) => mod.default);');

export default async function installUserscriptEngine(browserName: string, browserVersion: string, userscriptManagerName: string): Promise<void> {
    switch (browserName) {
    case 'firefox':
        return installFirefoxUserscriptEngine(userscriptManagerName);
    case 'chrome':
        return installChromiumUserscriptEngine(userscriptManagerName, browserVersion);
    default:
        throw new Error('Unsupported browser: ' + browserName);
    }
}

async function download(url: string): Promise<Buffer> {
    const resp = await (await fetch)(url);
    return resp.buffer();
}

async function generateFirefoxProfile(userscriptManagerName: string): Promise<string> {
    // We install a Firefox userscript engine by downloading the addon and
    // adding it to the desired profile.

    // Download the addon. Note that we're always using the latest version of
    // the addon.
    const downloadUrls: Record<string, string> = {
        'violentmonkey': 'https://addons.mozilla.org/firefox/downloads/latest/violentmonkey',
    };
    const addonBuffer = await download(downloadUrls[userscriptManagerName]);

    // Write it to a temporary file.
    const tmpFilePath = join(tmpdir(), userscriptManagerName + '.xpi');
    await writeFile(tmpFilePath, addonBuffer);

    // Add the extension to a Firefox profile which we'll use in desired capabilities.
    const profile = new FirefoxProfile();
    const addonId = await new Promise<string>((resolve, reject) => {
        profile.addExtension(tmpFilePath, (err, addonDetails) => {
            if (err) reject(err);
            else if (!addonDetails) reject('Empty addon details');
            else resolve(addonDetails.id);
        });
    });

    // Firefox generates random UUIDs for each addon. This is bad, since we
    // need the UUID to access its pages, which we'll need to install the
    // userscripts. As a workaround, we'll manually generate the UUID and add
    // it to the preferences, so we always get the same UUID.
    const installedId = randomUUID();
    // Workaround for https://github.com/saadtazi/firefox-profile-js/issues/130
    profile.defaultPreferences['extensions.webextensions.uuids'] = JSON.stringify(JSON.stringify({
        [addonId]: installedId,
    }));
    profile.updatePreferences();
    // Also add it to the config of the userscript installer helper, it'll need it.
    container.helpers('UserscriptInstaller').config.userscriptManagerBaseUrl = `moz-extension://${installedId}`;

    const profileZipped = await new Promise<string>((resolve, reject) => {
        profile.encode((err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

    return profileZipped;
}

async function installFirefoxUserscriptEngine(userscriptManagerName: string): Promise<void> {
    const caps = container.helpers('WebDriver').config.desiredCapabilities;
    const profileZipped = await generateFirefoxProfile(userscriptManagerName);
    caps.firefoxOptions = caps.firefoxOptions ?? {};
    caps.firefoxOptions.profile = profileZipped;
}

async function installChromiumUserscriptEngine(userscriptManagerName: string, browserVersion: string): Promise<void> {
    // We install a Chromium userscript engine by downloading the extension,
    // base64-encoding it, and adding it to the desired capabilities.
    const extensionIds: Record<string, string> = {
        'violentmonkey': 'jinjaccalgkegednnccohejagnlnfdag',
    };

    let extensionId = extensionIds[userscriptManagerName];
    // Direct download URL. prodversion must be a Chrome version, but it seems like
    // it doesn't really matter which Chrome version.
    const downloadUrl = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=31.0.1609.0&acceptformat=crx2,crx3&x=id%3D${extensionId}%26uc`;
    const addonBuffer = await download(downloadUrl);
    const payload = addonBuffer.toString('base64');

    const caps = container.helpers('WebDriver').config.desiredCapabilities;
    caps.chromeOptions = caps.chromeOptions ?? {};
    caps.chromeOptions.extensions = caps.chromeOptions.extensions ?? [];
    caps.chromeOptions.extensions.push(payload);

    // For some reason the actual extension ID in Chrome 64 is different from the
    // one we download, although in latest Chrome, it isn't. It may have something
    // to do with manifest versions? There doesn't seem to be a straightforward
    // way of figuring the ID out programmatically: Parsing chrome://extensions
    // is bound to be unstable across Chrome versions and browser.management.getAll()
    // returns an empty result on Chrome 64 (something with permissions, I guess).
    // So we'll just hardcode it.
    if (userscriptManagerName === 'violentmonkey' && parseInt(browserVersion.split('.')[0]) <= 64) {
        extensionId = 'egppagfjpllnlgfobgchglknakfbjagd';
    }

    container.helpers('UserscriptInstaller').config.userscriptManagerBaseUrl = `chrome-extension://${extensionId}`;
}
