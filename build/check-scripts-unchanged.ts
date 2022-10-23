import fs from 'node:fs/promises';

import { buildUserscript } from './rollup';
import { getPreviousReleaseVersion, userscriptHasChanged } from './versions';

if (!process.env.GITHUB_ACTIONS) {
    throw new Error('Refusing to run outside of CI, sorry :(');
}

const distRepo = process.argv[2];

async function checkUserscriptsChanged(): Promise<void> {
    const srcContents = await fs.readdir('./src');
    const userscriptDirs = srcContents.filter((name) => name.startsWith('mb_'));

    for (const scriptName of userscriptDirs) {
        console.log(`Checking ${scriptName}`);
        const previousVersion = await getPreviousReleaseVersion(scriptName, distRepo);

        if (!previousVersion) {
            throw new Error('I encountered a userscript which has not been deployed yet!');
        }

        // Check against the main branch.
        if (await userscriptHasChanged(scriptName, 'main')) {
            // Build it again into the dist repo so that the changes can be
            // displayed.
            await buildUserscript(scriptName, previousVersion, distRepo);
            throw new Error(`Userscript ${scriptName} would be changed`);
        }
    }
}

checkUserscriptsChanged().catch((err) => {
    console.error(err);
    process.exit(1);
});
