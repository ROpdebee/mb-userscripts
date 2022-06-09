import fs from 'node:fs/promises';
import path from 'node:path';

import simpleGit from 'simple-git';

import type { DeployedScript, DeployInfo, PullRequestInfo } from './types-deploy';
import { updateChangelog } from './changelog';
import { buildUserscript } from './rollup';
import { getPreviousReleaseVersion, incrementVersion, userscriptHasChanged } from './versions';

if (!process.env.GITHUB_ACTIONS) {
    throw new Error('Refusing to run outside of CI, sorry :(');
}

const distRepo = process.argv[2];

if (!process.env.PR_INFO) {
    throw new Error('Missing PR info');
}

const prInfo = JSON.parse(process.env.PR_INFO) as PullRequestInfo;

// We're using a separate clone of the same repo here. gitDist is checked out
// to the `dist` branch of our repo. We're using the separate copy  so we can
// simultaneously build from the main branch into the dist branch, while also
// committing to dist, without constantly having to change branches.
const gitDist = simpleGit(distRepo);

async function commitIfUpdated(scriptName: string): Promise<DeployedScript | undefined> {
    console.log(`Checking ${scriptName}…`);
    const previousVersion = await getPreviousReleaseVersion(scriptName, distRepo);
    const nextVersion = incrementVersion(previousVersion);

    if (!previousVersion) {
        console.log(`First release: ${nextVersion}`);
        return commitUpdate(scriptName, nextVersion);
    } else if (await userscriptHasChanged(scriptName, previousVersion, distRepo)) {
        console.log(`${previousVersion} -> ${nextVersion}`);
        return commitUpdate(scriptName, nextVersion);
    }

    console.log('No release needed');
    return undefined;
}

async function commitUpdate(scriptName: string, version: string): Promise<DeployedScript> {
    // Update the changelog
    await updateChangelog(scriptName, version, distRepo, prInfo);
    // Build the userscripts with the new version into the dist repository.
    await buildUserscript(scriptName, version, distRepo);
    // Update the version.json file, which we'll use to dynamically create badges
    await fs.writeFile(path.join(distRepo, scriptName + '.metadata.json'), JSON.stringify({
        version,
    }));
    // Create the commit.
    const commitResult = await gitDist
        .add([`${scriptName}.*`])
        .commit(`🤖 ${scriptName} ${version}\n\n${prInfo.title} (#${prInfo.number})`);
    return {
        name: scriptName,
        version,
        commit: commitResult.commit,
    };
}

function encodeOutput(output: DeployInfo): string {
    return JSON.stringify(output)
        .replaceAll('%', '%25')
        .replaceAll('\n', '%0A')
        .replaceAll('\r', '%0D');
}

async function scanAndPush(): Promise<void> {
    if (prInfo.labels.includes('skip cd')) {
        console.log('`skip cd` label set on PR, skipping...');
        return;
    }

    const userscriptDirs = (await fs.readdir('./src'))
        .filter((name) => name.startsWith('mb_'));

    const updates: DeployedScript[] = [];
    for (const scriptName of userscriptDirs) {
        const update = await commitIfUpdated(scriptName);
        if (update) updates.push(update);
    }

    if (updates.length) {
        if (!process.env.SKIP_PUSH) {
            console.log('Pushing…');
            await gitDist.push();
        }

        // Logging this message, it should get picked up by the Actions runner
        // to set the step output.
        console.log('::set-output name=deployment-info::' + encodeOutput({ scripts: updates }));
    }
}

scanAndPush().catch((err) => {
    console.error(err);
    process.exit(1);
});
