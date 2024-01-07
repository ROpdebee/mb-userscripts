import fs from 'node:fs/promises';

import { getPreviousReleaseVersion, userscriptHasChanged } from './versions';

if (!process.env.GITHUB_ACTIONS) {
    throw new Error('Refusing to run outside of CI, sorry :(');
}

const distributionRepo = process.argv[2];

async function checkUserscriptsChanged(): Promise<void> {
    const sourceContents = await fs.readdir('./src');
    const userscriptDirectories = sourceContents.filter((name) => name.startsWith('mb_'));
    let anyScriptChanged = false;

    for (const scriptName of userscriptDirectories) {
        console.log(`Checking ${scriptName}`);
        const previousVersion = await getPreviousReleaseVersion(scriptName, distributionRepo);

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

checkUserscriptsChanged().catch((error) => {
    console.error(error);
    process.exit(1);
});
