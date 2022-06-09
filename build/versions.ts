import fs from 'node:fs/promises';
import path from 'node:path';

import simpleGit from 'simple-git';

import { buildUserscript } from './rollup';

export function getVersionForToday(): string {
    const today = new Date();
    return `${today.getUTCFullYear()}.${today.getUTCMonth() + 1}.${today.getUTCDate()}`;
}

export function extractVersion(fileContent: string): string {
    const version = fileContent.match(/\/\/\s*@version\s+(\S+)/)?.[1];
    if (!version) {
        throw new Error('Could not extract version of existing built script!');
    }
    return version;
}

export function incrementVersion(lastVersion: string | undefined): string {
    const nextVersion = getVersionForToday();

    if (!lastVersion) return nextVersion;

    if (!lastVersion.startsWith(nextVersion)) {
        // New version should be later than old version
        return nextVersion;
    }

    if (lastVersion === nextVersion) {
        // We already released today, add a .2 suffix (e.g. 2021.10.17.2)
        return nextVersion + '.2';
    }

    // We already released at least twice today, current version already is
    // e.g. 2021.10.17.*. Increment it.
    const currSuffix = parseInt(lastVersion.split('.')[3]);
    return `${nextVersion}.${currSuffix + 1}`;
}

export async function getPreviousReleaseVersion(userscriptName: string, buildDir: string): Promise<string | undefined> {
    const distMetaFile = path.resolve(buildDir, userscriptName + '.meta.js');
    let metaContent: string;
    try {
        metaContent = await fs.readFile(distMetaFile, 'utf8');
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
            // File doesn't exist -> First build, version is undefined.
            return;
        }
        // Some other error, rethrow it.
        throw err;
    }

    return extractVersion(metaContent);
}

export async function userscriptHasChanged(scriptName: string, previousVersion: string, distRepo: string): Promise<boolean> {
    // We'll check whether the userscript has changed by building the latest
    // code and diffing it against the previous released version. If there's a
    // diff, we assume it needs a new release. To prevent diffs caused solely
    // by version bumps, we're building the script with the same version as
    // before.
    await buildUserscript(scriptName, previousVersion, distRepo);
    const gitDist = simpleGit(distRepo);
    const diffSummary = await gitDist.diffSummary();
    return !!diffSummary.changed;
}
