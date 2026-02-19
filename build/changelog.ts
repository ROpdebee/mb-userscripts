import fs from 'node:fs/promises';
import path from 'node:path';

import { CommitParser } from 'conventional-commits-parser';

import { filterNonNull } from '@lib/util/array';

import type { PullRequestInfo } from './types-deploy';

const CC_TYPE_TO_TITLE: Record<string, string | undefined> = {
    feat: 'New feature',
    fix: 'Bug fix',
    perf: 'Performance improvements',
    // We'll call the rest 'Internal changes'
};

export interface ChangeInfo {
    type: string;
    subject: string;
}

export function parsePullRequestTitle(prInfo: PullRequestInfo): Promise<ChangeInfo> {
    return new Promise((resolve, reject) => {
        const ccParser = new CommitParser();
        const ccInfo = ccParser.parse(prInfo.title);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (ccInfo.type === null || ccInfo.type === undefined || ccInfo.subject === null) {
            reject(new Error('Could not parse pull request title'));
        } else {
            resolve({
                type: ccInfo.type,
                subject: ccInfo.subject,
            });
        }
    });
}

// Exported for tests
export async function generateChangelogEntry(scriptVersion: string, prInfo: PullRequestInfo): Promise<string> {
    try {
        const changeInfo = await parsePullRequestTitle(prInfo);
        const changelogTitle = CC_TYPE_TO_TITLE[changeInfo.type] ?? 'Internal changes';
        return `- **${scriptVersion}**: ${changelogTitle}: ${changeInfo.subject} ([#${prInfo.number}](${prInfo.url}))`;
    } catch (error) {
        console.error(error);
        return `- **${scriptVersion}**: UNKNOWN CHANGE TYPE: ${prInfo.title} ([#${prInfo.number}](${prInfo.url}))`;
    }
}

export async function updateChangelog(scriptName: string, version: string, distributionRepo: string, prInfo: PullRequestInfo): Promise<void> {
    const changelogEntry = await generateChangelogEntry(version, prInfo);
    const changelogPath = path.join(distributionRepo, scriptName + '.changelog.md');
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
    } catch {
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
    const match = re.exec(line);
    if (match === null) {
        // Malformed
        return null;
    }
    return {
        version: match[1],
        title: match[2],
        subject: match[3],
        prNumber: Number.parseInt(match[4]),
    };
}
