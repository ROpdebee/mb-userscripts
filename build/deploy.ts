import simpleGit from 'simple-git';
import fs from 'fs/promises';
import { getPreviousReleaseVersion, incrementVersion } from './versions.js';
import { buildUserscript } from './rollup.js';

const distRepo = process.argv[2];

// We're using a separate clone of the same repo here. gitDist is checked out
// to the `dist` branch of our repo. We're using the separate copy  so we can
// simultaneously build from the main branch into the dist branch, while also
// committing to dist, without constantly having to change branches.
const gitDist = simpleGit(distRepo);

if (!process.env.GITHUB_ACTIONS) {
    throw new Error('Refusing to run outside of CI, sorry :(');
}

async function userscriptHasChanged(scriptName: string, previousVersion: string): Promise<boolean> {
    // We'll check whether the userscript has changed by building the latest
    // code and diffing it against the previous released version. If there's a
    // diff, we assume it needs a new release. To prevent diffs caused solely
    // by version bumps, we're building the script with the same version as
    // before.
    await buildUserscript(scriptName, previousVersion, distRepo);
    const diffSummary = await gitDist.diffSummary();
    return !!diffSummary.changed;
}

async function commitIfUpdated(scriptName: string): Promise<boolean> {
    console.log(`Checking ${scriptName}…`);
    const previousVersion = await getPreviousReleaseVersion(scriptName, distRepo);
    const nextVersion = incrementVersion(previousVersion);

    if (!previousVersion) {
        console.log(`First release: ${nextVersion}`);
        await commitUpdate(scriptName, nextVersion);
        return true;
    } else if (await userscriptHasChanged(scriptName, previousVersion)) {
        console.log(`${previousVersion} -> ${nextVersion}`);
        await commitUpdate(scriptName, nextVersion);
        return true;
    }

    console.log('No release needed');
    return false;
}

async function commitUpdate(scriptName: string, version: string): Promise<void> {
    // Build the userscripts with the new version into the dist repository.
    await buildUserscript(scriptName, version, distRepo);
    // Create the commit.
    await gitDist
        .add([`${scriptName}.*`])
        .commit(`🤖 ${scriptName} ${version}`);
}

async function scanAndPush(): Promise<void> {
    const userscriptDirs = (await fs.readdir('./src'))
        .filter((name) => name.startsWith('mb_'));

    let anyUpdates = false;
    for (const scriptName of userscriptDirs) {
        anyUpdates ||= await commitIfUpdated(scriptName);
    }

    if (anyUpdates) {
        console.log('Pushing…');
        await gitDist.push();
    }
}

await scanAndPush();
