import fs from 'node:fs/promises';
import path from 'node:path';

import simpleGit from 'simple-git';

import type { DeployedScript, DeployInfo, PullRequestInfo, PushEventPayload, RepositoryDispatchEventPayload } from './types-deploy';
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
// to the `dist` branch of our repo. We're using the separate copy so we can
// simultaneously build from the main branch into the dist branch, while also
// committing to dist, without constantly having to change branches.
const gitDist = simpleGit(distRepo);

async function commitIfUpdated(scriptName: string): Promise<DeployedScript | undefined> {
    console.log(`Checking ${scriptName}…`);
    const previousVersion = await getPreviousReleaseVersion(scriptName, distRepo);
    const isNewScript = !previousVersion;
    const nextVersion = incrementVersion(previousVersion);

    // Always deploy new scripts.
    if (isNewScript) {
        console.log(`First release: ${nextVersion}`);
        return commitUpdate(scriptName, nextVersion);
    }

    const isPreview = process.env.GITHUB_EVENT_NAME !== 'push';
    const payloadText = await fs.readFile(process.env.GITHUB_EVENT_PATH!, 'utf8');
    const payload = JSON.parse(payloadText) as unknown;
    // The commit before the changes we want to deploy differs for previews and
    // actual deployments. For previews, make sure we compare to the base branch's
    // HEAD rather than the commit on which the PR is based, which may be outdated.
    const baseRef = isPreview
        ? (payload as RepositoryDispatchEventPayload).client_payload.pull_request.base.ref
        : (payload as PushEventPayload).before;

    // For existing scripts, we need to check whether the newly pushed changes
    // lead to a change in the compiled scripts. We don't check against the
    // previously deployed version, since there may have been changes that were
    // not deployed following a `skip cd` tag.
    // See https://github.com/ROpdebee/mb-userscripts/issues/600
    const { changed: hasChanged } = await userscriptHasChanged(scriptName, baseRef);
    if (hasChanged) {
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

    const srcContents = await fs.readdir('./src');
    const userscriptDirs = srcContents.filter((name) => name.startsWith('mb_'));

    const updates: DeployedScript[] = [];
    for (const scriptName of userscriptDirs) {
        const update = await commitIfUpdated(scriptName);
        if (update) updates.push(update);
    }

    if (updates.length > 0) {
        if (!process.env.SKIP_PUSH) {
            console.log('Pushing…');
            await gitDist.push();
        }

        // Set the step's output
        // Need to ensure that the trailing EOF always appears on its own line.
        // https://github.com/orgs/community/discussions/25753
        const stepOutput = [
            'deployment-info<<EOF',
            encodeOutput({ scripts: updates }),
            'EOF\n',
        ].join('\n');
        await fs.appendFile(process.env.GITHUB_OUTPUT!, stepOutput);
    }
}

scanAndPush().catch((err) => {
    console.error(err);
    process.exit(1);
});
