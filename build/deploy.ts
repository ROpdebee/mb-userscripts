/**
 * Script to build, deploy, and optionally release userscripts.
 *
 * Expects one argument: the path to a directory containing the latest released compiled
 * userscripts. This directory is expected to be a git repository.
 *
 * Also expects an environment variable `PR_INFO` to be present, which contains a JSON
 * representation containing information on the pull request which caused this deployment (either
 * because it was merged, or because a maintainer requested a deployment preview).
 *
 * If the `SKIP_PUSH` environment variable is set, this script will refrain from pushing the updated
 * userscripts to the repository.
 *
 * Can only be run inside of the CI environment.
 */

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

/**
 * Compile a script, check whether it has changed from the previously-deployed version, and commit
 * the updated script if it has.
 *
 * @param      {string}                               scriptName  Name of the userscript.
 * @return     {(Promise<DeployedScript|undefined>)}  Information on the deployed script, or
 *                                                    undefined if the script was not deployed
 *                                                    because no changes were made.
 */
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


/**
 * Commit an updated script.
 *
 * Write the compiled script into the distribution repository, update related metadata (changelog,
 * version file, ...), and create a git commit for the updated script.
 *
 * @param      {string}                   scriptName  The script name.
 * @param      {string}                   version     The version number of the new release.
 * @return     {Promise<DeployedScript>}  Information on the deployed script.
 */
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

/**
 * Encode the deployment information into a JSON representation that can be used to set GitHub
 * Actions results.
 *
 * @param      {DeployInfo}  output  The output to be encoded.
 * @return     {string}      The encoded output.
 */
function encodeOutput(output: DeployInfo): string {
    return JSON.stringify(output)
        .replaceAll('%', '%25')
        .replaceAll('\n', '%0A')
        .replaceAll('\r', '%0D');
}

/**
 * Scan the source repository for userscripts, deploy updates if necessary, and push the updates to
 * the distribution repository.
 *
 * If the pull request that triggered this deployment has the `skip cd` label set, the deployment
 * will be skipped.
 */
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
