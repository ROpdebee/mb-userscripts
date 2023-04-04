import { exec } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import simpleGit from 'simple-git';

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

async function buildTempUserscript(scriptName: string): Promise<string> {
    const outputDir = await fs.mkdtemp(scriptName);

    // Need to run this in its own process because we may need to change the
    // versions of dependencies and ensure the node process uses the correct
    // version. We also can't just change the `build.ts` script to accept
    // arguments because we may need to compare to a version in which the script
    // hadn't been changed yet.
    const builderSource = `
        import { buildUserscript } from "build/rollup";
        buildUserscript("${scriptName}", "0.0.0", "${path.resolve(outputDir)}")
            .catch((err) => {
                console.error(err);
                process.exit(1);
            });
    `;
    await fs.writeFile('isolatedBuilder.ts', builderSource);
    const command = 'npm i --no-audit --production=false && npx ts-node -r tsconfig-paths/register isolatedBuilder.ts';
    const { stderr, stdout } = await promisify(exec)(command);
    if (stderr) console.error(stderr);
    if (stdout) console.log(stdout);

    const content = fs.readFile(path.join(outputDir, `${scriptName}.user.js`), 'utf8');
    await fs.rm(outputDir, { recursive: true });
    return content;
}

export async function userscriptHasChanged(scriptName: string, compareToRef: string): Promise<{ changed: boolean; diff: string }> {
    // We'll check whether the userscript has changed by building both the
    // latest code as well as the code at `baseRef`, then diffing them.
    // If there's a diff, we assume it needs a new release.

    // Build previous version before current version so that the current
    // dependency versions are installed after everything is finished.

    // Temporarily check out the base ref
    const repo = simpleGit();
    await repo.checkout(['-f', compareToRef]);
    let previousVersion: string;
    try {
        previousVersion = await buildTempUserscript(scriptName);
    } finally {
        await repo.checkout(['-f', '-']);
    }

    const currentVersion = await buildTempUserscript(scriptName);

    const changed = currentVersion !== previousVersion;
    let diff = '';

    // Generate diff for the two versions. We can't simply write the new version
    // to the dist branch and perform a `git diff` on it, since this will also
    // display differences from previous changes where CD was skipped.
    if (changed) {
        const tmpDir = await fs.mkdtemp(`${scriptName}-diff`);
        const oldPath = path.join(tmpDir, 'old.js');
        const newPath = path.join(tmpDir, 'new.js');
        await fs.writeFile(oldPath, previousVersion);
        await fs.writeFile(newPath, currentVersion);
        diff = await repo.diff(['--no-index', oldPath, newPath]);
        await fs.rm(tmpDir, { recursive: true });
    }

    return { changed, diff };
}
