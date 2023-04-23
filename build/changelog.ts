import fs from 'node:fs/promises';
import path from 'node:path';

import conventionalCommitsParser from 'conventional-commits-parser';

import { filterNonNull } from '@lib/util/array';

import type { PullRequestInfo } from './types-deploy';

const CC_TYPE_TO_TITLE: Record<string, string | undefined> = {
    'feat': 'New feature',
    'fix': 'Bug fix',
    'perf': 'Performance improvements',
    // We'll call the rest 'Internal changes'
};

export interface ChangeInfo {
    type: string;
    subject: string;
}

// Incomplete.
interface CCInfo {
    type: string | null;
    scope: string | null;
    subject: string;
}

export function parsePullRequestTitle(prInfo: PullRequestInfo): Promise<ChangeInfo> {
    return new Promise((resolve, reject) => {
        const ccParser = conventionalCommitsParser();
        ccParser.on('readable', () => {
            const ccInfo = ccParser.read() as CCInfo;

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

export async function updateChangelog(scriptName: string, version: string, distRepo: string, prInfo: PullRequestInfo): Promise<void> {
    const changelogEntry = await generateChangelogEntry(version, prInfo);
    const changelogPath = path.join(distRepo, scriptName + '.changelog.md');
    await fs.writeFile(changelogPath, await renderChangelog(changelogPath, changelogEntry));
}

async function renderChangelog(changelogPath: string, changelogEntry: string): Promise<string> {
    const existing = await readChangelog(changelogPath);
    return `${changelogEntry}\n${existing}`;
}

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

interface ChangelogEntry {
    version: string;
    title: string;
    subject: string;
    prNumber: number;
}

export async function parseChangelogEntries(changelogPath: string): Promise<ChangelogEntry[]> {
    const contents = await readChangelog(changelogPath);
    return filterNonNull(contents.split('\n').map((line) => parseChangelogEntry(line)));
}

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
