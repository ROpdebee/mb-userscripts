import simpleGit from 'simple-git';
import fs from 'fs/promises';
import path from 'path';
import { getPreviousReleaseVersion, incrementVersion } from './versions.js';
import { buildUserscript } from './rollup.js';

const distRepo = process.argv[2];
const prTitle = process.argv[3];

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

async function commitIfUpdated(scriptName: string): Promise<string | undefined> {
    console.log(`Checking ${scriptName}…`);
    const previousVersion = await getPreviousReleaseVersion(scriptName, distRepo);
    const nextVersion = incrementVersion(previousVersion);

    if (!previousVersion) {
        console.log(`First release: ${nextVersion}`);
        return commitUpdate(scriptName, nextVersion);
    } else if (await userscriptHasChanged(scriptName, previousVersion)) {
        console.log(`${previousVersion} -> ${nextVersion}`);
        return commitUpdate(scriptName, nextVersion);
    }

    console.log('No release needed');
    return undefined;
}

async function commitUpdate(scriptName: string, version: string): Promise<string> {
    // Build the userscripts with the new version into the dist repository.
    await buildUserscript(scriptName, version, distRepo);
    // Update the version.json file, which we'll use to dynamically create badges
    await fs.writeFile(path.join(distRepo, scriptName + '.metadata.json'), JSON.stringify({
        version
    }));
    // Create the commit.
    const commitResult = await gitDist
        .add([`${scriptName}.*`])
        .commit(`🤖 ${scriptName} ${version}\n\n${prTitle}`);
    return `${scriptName} ${version} in ${commitResult.commit}`;
}

function escapeOutput(output: string): string {
    return output
        .replaceAll('%', '%25')
        .replaceAll('\n', '%0A')
        .replaceAll('\r', '%0D');
}

async function scanAndPush(): Promise<void> {
    const userscriptDirs = (await fs.readdir('./src'))
        .filter((name) => name.startsWith('mb_'));

    const updates: string[] = [];
    for (const scriptName of userscriptDirs) {
        const update = await commitIfUpdated(scriptName);
        if (update) updates.push(update);
    }

    if (updates.length) {
        console.log('Pushing…');
        await gitDist.push();
        const statusMessage = [`🚀 Released ${updates.length} new userscript version(s):`]
            .concat(updates.map((update) => '* ' + update))
            .join('\n');
        // Logging this message, it should get picked up by the Actions runner
        // to set the step output.
        console.log('::set-output name=deployMessage::' + escapeOutput(statusMessage));
    }
}

await scanAndPush();
