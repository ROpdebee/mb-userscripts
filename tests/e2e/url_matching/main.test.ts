import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import tmp from 'tmp-promise';
import type { UserscriptMetadata } from 'userscriptMetadata';
import { MetadataGenerator, DEFAULT_OPTIONS } from '../../../build/plugin-userscript';

tmp.setGracefulCleanup();

Feature('URL matching');

async function loadMetadata(srcName: string): Promise<UserscriptMetadata> {
    return (await import(path.resolve(`./src/${srcName}/meta.ts`))).default;
}

function randomId(): string {
    return crypto.randomBytes(12).toString('base64');
}

/**
 * Generate a test script for URL testing.
 *
 * This will generate a random script name based on the one provided in the
 * metadata. It will then generate a script which uses the provided metadata
 * and appends a DOM element to the page when the script is loaded. The ID of
 * this DOM element will be the script name. The generated script will be
 * sent to the userscript server, and the generated script name and ID will be
 * returned. Callers must install the script via its name, and can then detect
 * whether the script is loaded on a given page by querying the DOM for its ID.
 * The generated script will automatically be removed on exit.
 */
async function generateUrlTestScript(metadata: UserscriptMetadata): Promise<{ scriptName: string; scriptId: string }> {
    const id = randomId();
    const adaptedName = metadata.name + ' ' + id;
    const adaptedMetadata = {
        ...metadata,
        name: adaptedName,
    };
    const metaGen = new MetadataGenerator({
        ...DEFAULT_OPTIONS,
        userscriptName: metadata.name,
        version: '1.0.0',
        include: /./,
        ignoredFields: [...DEFAULT_OPTIONS.ignoredFields, 'resource', 'require', 'downloadURL', 'updateURL'],
    });
    const metaBlock = metaGen.createMetadataBlock(await metaGen.insertDefaultMetadata(adaptedMetadata));

    const scriptContent = `${metaBlock}
var d = document.createElement('div');
d.id = '${adaptedName}';
document.body.append(d);`;

    const { fd, path: scriptPath } = await tmp.file({
        postfix: '.user.js',
        tmpdir: './dist/',
        mode: 0o644,
    });
    await new Promise<void>((resolve, reject) => {
        fs.write(fd, scriptContent, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    return {
        scriptName: path.basename(scriptPath),
        scriptId: adaptedName,
    };
}

// Dynamically generate the scenarios for each of the scripts
for (const userscriptSrcName of fs.readdirSync('./src')) {
    if (userscriptSrcName.startsWith('.')
        || userscriptSrcName === 'lib'
        || !fs.statSync(path.resolve('./src/' + userscriptSrcName)).isDirectory()) {
        continue;
    }

    Scenario(`URL matching for ${userscriptSrcName}`, async ({ I }) => {
        // To test URL matching patterns, we generate and install a small helper
        // script which adds a unique element to the DOM when loaded. We can
        // then check whether this element exists for pages we want to match,
        // and does not exist for pages which we don't want to run on.
        // The URL examples might point to live MB instances, but we're not
        // logging in, so we can't do any harm.

        // Generate the script to test inclusion
        const scriptMeta = await loadMetadata(userscriptSrcName);
        const { scriptName, scriptId } = await generateUrlTestScript(scriptMeta);

        I.installUserscripts([scriptName]);

        // For each page we expect to match, check whether we do
        for (const matchedUrl of scriptMeta.matchedUrlExamples) {
            I.amOnPage(matchedUrl);
            // Script ID can contain characters like +, so we shouldn't do a
            // simple CSS ID selector.
            // Need to wait since element might not exist immediately. If it
            // doesn't exist after the waiting, this will throw.
            I.waitForElement(`[id="${scriptId}"]`, 10);
        }
        // For each page we don't expect to match, check whether we don't
        for (const matchedUrl of scriptMeta.unmatchedUrlExamples) {
            I.amOnPage(matchedUrl);
            // Also need to wait here, but we can't wait for an element not to
            // exist if it should never exist at all, so we have to wait manually.
            I.wait(5);
            I.dontSeeElementInDOM(`[id="${scriptId}"]`);
        }
    });
}
