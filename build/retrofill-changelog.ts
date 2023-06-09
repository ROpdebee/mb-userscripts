/**
 * Script to retroactively generate a changelog for scripts in the `dist` branch.
 */

import fs from 'node:fs/promises';

import type { SimpleGit } from 'simple-git';
import simpleGit from 'simple-git';

import { generateChangelogEntry } from './changelog';

/**
 * Iterate over the commits in a repository, parse the deployment commits, generate a changelog from
 * these commits and write the changelog.
 *
 * @param      {SimpleGit}      repo    The repository, checked out on the distribution branch.
 */
async function iterCommits(repo: SimpleGit): Promise<void> {
    const commits = await repo.log();
    const changelogEntries: Map<string, string[]> = new Map();

    for (const commit of commits.all) {
        // Skip commits which aren't deployments by the bot
        if (!commit.message.startsWith('🤖')) continue;

        const messageMatch = commit.message.match(/🤖 (\w+) ([\d.]+)$/);
        if (messageMatch === null) throw new Error(`Malformed commit? ${commit.message}`);
        const [scriptName, version] = messageMatch.slice(1);
        let entryList = changelogEntries.get(scriptName);
        if (entryList === undefined) {
            entryList = [];
            changelogEntries.set(scriptName, entryList);
        }

        const bodyMatch = commit.body.trim().match(/(.+?) \(#(\d+)\)$/);
        if (bodyMatch === null) {
            // Malformed body? Fix manually
            entryList.push(`- **${version}**: FAILED!!! ${commit.message} ${commit.body.trim()}`);
            continue;
        }
        const [title, prNumber] = bodyMatch.slice(1);

        try {
            const changelogEntry = await generateChangelogEntry(version, {
                title: title,
                number: parseInt(prNumber),
                labels: [],
                url: `https://github.com/ROpdebee/mb-userscripts/pull/${prNumber}`,
            });
            entryList.push(changelogEntry);
        } catch (err) {
            // Fix manually, probably not adhering to conventional commits
            entryList.push(`- **${version}**: FAILED!!! ${commit.body.trim()}`);
        }
    }

    for (const [scriptName, scriptEntries] of changelogEntries) {
        const content = scriptEntries.join('\n');
        await fs.writeFile(`${scriptName}.changelog.md`, content);
    }
}

/**
 * Run the script in the current repository.
 *
 * Check out the `dist` branch, make sure it's up-to-date, generate and write the changelog for the
 * branch, and switch back to the original branch.
 */
async function run(): Promise<void> {
    const repo = simpleGit('.');
    await repo.checkout('dist');
    await repo.pull();

    try {
        await iterCommits(repo);
    } finally {
        await repo.checkout('-');
    }
}

run().catch(console.error);
