import fs from 'fs/promises';

import { getPreviousReleaseVersion, userscriptHasChanged } from './versions';

if (!process.env.GITHUB_ACTIONS) {
    throw new Error('Refusing to run outside of CI, sorry :(');
}

const distRepo = process.argv[2];

async function checkUserscriptsChanged(): Promise<void> {
    const userscriptDirs = (await fs.readdir('./src'))
        .filter((name) => name.startsWith('mb_'));

    for (const scriptName of userscriptDirs) {
        console.log(`Checking ${scriptName}`);
        const previousVersion = await getPreviousReleaseVersion(scriptName, distRepo);

        if (!previousVersion) {
            throw new Error('I encountered a userscript which has not been deployed yet!');
        }

        if (await userscriptHasChanged(scriptName, previousVersion, distRepo)) {
            throw new Error(`Userscript ${scriptName} would be changed`);
        }
    }
}

checkUserscriptsChanged().catch((err) => {
    console.error(err);
    process.exit(1);
});
