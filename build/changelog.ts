import fs from 'node:fs/promises';
import path from 'node:path';

import conventionalCommitsParser from 'conventional-commits-parser';

import { filterNonNull } from '@lib/util/array';

import type { PullRequestInfo } from './types-deploy';

/** Mapping from conventional commit type to changelog entry title. */
const CC_TYPE_TO_TITLE: Record<string, string | undefined> = {
    'feat': 'New feature',
    'fix': 'Bug fix',
    'perf': 'Performance improvements',
    // We'll call the rest 'Internal changes'
};

/** * Information on the changes in a pull request, parsed from PR titles. */
export interface ChangeInfo {
    /** Conventional commit type. */
    type: string;
    /** PR title without conventional commits prefix. */
    subject: string;
}

/** Information parsed from conventional commit. Incomplete. */
interface CCInfo {
    /** Conventional commit type. */
    type?: string | null;
    /** Conventional commit scope. */
    scope: string | null;
    /** Subject of the commit. */
    subject: string;
}

/**
 * Parse the title of a pull request.
 *
 * @param      {PullRequestInfo}      prInfo  Pull request information.
 * @return     {Promise<ChangeInfo>}  Parsed PR information. May reject if the conventional commit
 *                                    could not be parsed.
 */
export function parsePullRequestTitle(prInfo: PullRequestInfo): Promise<ChangeInfo> {
    return new Promise((resolve, reject) => {
        const ccParser = conventionalCommitsParser();
        ccParser.on('readable', () => {
            const ccInfo = ccParser.read() as CCInfo;

            if (ccInfo.type === null || ccInfo.type === undefined) {
                reject(new Error('Could not parse pull request title'));
            } else {
                resolve({
                    type: ccInfo.type,
                    subject: ccInfo.subject,
                });
            }
        });

        ccParser.write(prInfo.title);
    });
}


/**
 * Generate a changelog entry.
 *
 * @param      {string}           scriptVersion  The version of the script.
 * @param      {PullRequestInfo}  prInfo         Pull request information.
 * @return     {Promise<string>}  Changelog entry. The returned promise will always resolve.
 */
// Exported for tests
export async function generateChangelogEntry(scriptVersion: string, prInfo: PullRequestInfo): Promise<string> {
    try {
        const changeInfo = await parsePullRequestTitle(prInfo);
        const changelogTitle = CC_TYPE_TO_TITLE[changeInfo.type] ?? 'Internal changes';
        return `- **${scriptVersion}**: ${changelogTitle}: ${changeInfo.subject} ([#${prInfo.number}](${prInfo.url}))`;
    } catch (err) {
        console.error(err);
        return `- **${scriptVersion}**: UNKNOWN CHANGE TYPE: ${prInfo.title} ([#${prInfo.number}](${prInfo.url}))`;
    }
}

/**
 * Update the changelog for a given script release.
 *
 * @param      {string}           scriptName  The script name.
 * @param      {string}           version     The script version.
 * @param      {string}           distRepo    Path to the directory in which the changelog resides.
 * @param      {PullRequestInfo}  prInfo      Pull request information.
 */
export async function updateChangelog(scriptName: string, version: string, distRepo: string, prInfo: PullRequestInfo): Promise<void> {
    const changelogEntry = await generateChangelogEntry(version, prInfo);
    const changelogPath = path.join(distRepo, scriptName + '.changelog.md');
    await fs.writeFile(changelogPath, await renderChangelog(changelogPath, changelogEntry));
}


/**
 * Append a changelog entry to the contents of the changelog file.
 *
 * Does not write the resulting changelog. If the changelog does not exist yet, will return a
 * newly-rendered changelog containing the single entry.
 *
 * @param      {string}           changelogPath   Path to the changelog.
 * @param      {string}           changelogEntry  The changelog entry to append.
 * @return     {Promise<string>}  Content of the new changelog.
 */
async function renderChangelog(changelogPath: string, changelogEntry: string): Promise<string> {
    const existing = await readChangelog(changelogPath);
    return `${changelogEntry}\n${existing}`;
}


/**
 * Read the changelog contents at the given path.
 *
 * @param      {string}           changelogPath  Path to the changelog.
 * @return     {Promise<string>}  Changelog contents, or empty string if the file at `changelogPath`
 *                                does not exist.
 */
async function readChangelog(changelogPath: string): Promise<string> {
    try {
        return await fs.readFile(changelogPath, {
            encoding: 'utf8',
        });
    } catch (err) {
        // Changelog doesn't exist yet
        return '';
    }
}


/** Information in a changelog. */
interface ChangelogEntry {
    /** Script version. */
    version: string;
    /** Change title, e.g. "New feature". */
    title: string;
    /** Short description of the change. */
    subject: string;
    /** Number of the pull request in which the change was made. */
    prNumber: number;
}

/**
 * Parse a changelog into an array of its entries.
 *
 * @param      {string}                     changelogPath  Path to the changelog.
 * @return     {Promise<ChangelogEntry[]>}  Array of changelog entry information.
 */
export async function parseChangelogEntries(changelogPath: string): Promise<ChangelogEntry[]> {
    const contents = await readChangelog(changelogPath);
    return filterNonNull(contents.split('\n').map((line) => parseChangelogEntry(line)));
}


/**
 * Parse a single changelog entry.
 *
 * @param      {string}                 line    Line in the changelog file.
 * @return     {(ChangelogEntry|null)}  Parsed entry information, or `null` if parsing failed.
 */
function parseChangelogEntry(line: string): ChangelogEntry | null {
    const re = /- \*\*([\d.]+)\*\*: ([\w\s]+): (.+?) \(\[#(\d+)]\(.+\)\)/;
    const match = line.match(re);
    if (match === null) {
        // Malformed
        return null;
    }
    return {
        version: match[1],
        title: match[2],
        subject: match[3],
        prNumber: parseInt(match[4]),
    };
}
