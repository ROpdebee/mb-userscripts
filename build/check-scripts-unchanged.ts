/**
 * Script to check whether changes to the compiled userscripts would be made following a dependabot
 * or renovatebot dependency update. If such changes are made, this script will cause CI to fail and
 * prevent the PR from being merged automatically.
 *
 * Expects one argument: the path to a directory containing the latest released compiled
 * userscripts.
 *
 * Can only be run inside of the CI environment.
 */

import fs from 'node:fs/promises';

import { getPreviousReleaseVersion, userscriptHasChanged } from './versions';

if (!process.env.GITHUB_ACTIONS) {
    throw new Error('Refusing to run outside of CI, sorry :(');
}

const distRepo = process.argv[2];

/**
 * Check whether any of the deployed userscripts have changed, throw an error in case they have.
 *
 * This is intended to be used in CI to verify whether changes that shouldn't change the
 * userscripts, indeed don't change the userscripts.
 */
async function checkUserscriptsChanged(): Promise<void> {
    const srcContents = await fs.readdir('./src');
    const userscriptDirs = srcContents.filter((name) => name.startsWith('mb_'));
    let anyScriptChanged = false;

    for (const scriptName of userscriptDirs) {
        console.log(`Checking ${scriptName}`);
        const previousVersion = await getPreviousReleaseVersion(scriptName, distRepo);

        if (!previousVersion) {
            throw new Error('I encountered a userscript which has not been deployed yet!');
        }

        // Check against the main branch.
        const { changed, diff } = await userscriptHasChanged(scriptName, 'main');
        if (changed) {
            console.log(`${scriptName} would be changed`);
            anyScriptChanged = true;
            console.log(diff);
        }
    }

    if (anyScriptChanged) {
        throw new Error('Some userscripts would be changed');
    }
}

checkUserscriptsChanged().catch((err) => {
    console.error(err);
    process.exit(1);
});
