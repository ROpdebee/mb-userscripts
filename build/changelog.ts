import fs from 'fs/promises';
import path from 'path';

import conventionalCommitsParser from 'conventional-commits-parser';

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

            if (ccInfo.type === null || typeof ccInfo.type === 'undefined') {
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
    const changeInfo = await parsePullRequestTitle(prInfo);
    const changelogTitle = CC_TYPE_TO_TITLE[changeInfo.type] ?? 'Internal changes';
    return `- **${scriptVersion}**: ${changelogTitle}: ${changeInfo.subject} ([#${prInfo.number}](${prInfo.url}))`;
}

export async function updateChangelog(scriptName: string, version: string, distRepo: string, prInfo: PullRequestInfo): Promise<void> {
    const changelogEntry = await generateChangelogEntry(version, prInfo);
    const changelogPath = path.join(distRepo, scriptName + '.changelog.md');
    await fs.writeFile(changelogPath, await renderChangelog(changelogPath, changelogEntry));
}

async function renderChangelog(changelogPath: string, changelogEntry: string): Promise<string> {
    try {
        const existing = await fs.readFile(changelogPath, {
            encoding: 'utf-8',
        });
        return `${changelogEntry}\n${existing}`;
    } catch (e) {
        // Changelog doesn't exist yet
        return changelogEntry + '\n';
    }
}
