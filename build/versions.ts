import fs from 'fs/promises';
import path from 'path';

export function getVersionForToday(): string {
    const today = new Date();
    return `${today.getUTCFullYear()}.${today.getUTCMonth() + 1}.${today.getUTCDate()}`;
}

export function extractVersion(fileContent: string): string {
    const version = fileContent.match(/\/\/\s*@version\s+([^\s]+)/)?.[1];
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
        metaContent = await fs.readFile(distMetaFile, 'utf-8');
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
