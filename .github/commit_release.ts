import simpleGit from 'simple-git';
import { pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs/promises';
import type { UserscriptMetadata } from 'userscriptMetadata';

const beforeSha = process.argv[2];
const afterSha = process.argv[3];

const git = simpleGit();

if (!process.env.GITHUB_ACTIONS) {
    throw new Error('Refusing to run outside of CI, sorry :(');
}

function loadMetaTsContents(ref: string, metaPath: string): Promise<string | null> {
    try {
        return git.show(`${ref}:${metaPath}`);
    } catch {
        // First introduction of this file?
        // If the commit exists, then it is. If the commit doesn't exist, the
        // following line should throw.
        git.show(ref);
        return Promise.resolve(null);
    }
}

async function importMetaTs(ref: string, metaPath: string): Promise<UserscriptMetadata | null> {
    const content = await loadMetaTsContents(ref, metaPath);
    if (!content) return null;
    // Need to place this in the same directory because of the imports,
    // we'll remove it again later. I tried data: URLs but TS was very angry.
    const tmpPath = path.resolve(path.parse(metaPath).dir, ref + '_meta.ts');
    await fs.writeFile(tmpPath, content);

    const metadataFile = pathToFileURL(tmpPath).href;
    const metadata = (await import(metadataFile)).default;
    await fs.unlink(tmpPath);
    return metadata;
}

async function commitIfUpdated(scriptName: string): Promise<boolean> {
    console.log(`Checking ${scriptName}…`);
    const metaPath = `src/${scriptName}/meta.ts`;
    const metaBefore = await importMetaTs(beforeSha, metaPath);
    const metaAfter = await importMetaTs(afterSha, metaPath);

    if (metaAfter === null) {
        throw new Error('Where is the metadata?');
    }

    if (metaBefore === null) {
        console.log(`First release: ${metaAfter.version}`);
        await commitUpdate(scriptName, metaAfter.version);
    } else if (metaBefore.version !== metaAfter.version) {
        // Could be downgrade too, but if we deliberately downgrade the version,
        // the built scripts should be updated anyway.
        console.log(`${metaBefore.version} -> ${metaAfter.version}`);
        await commitUpdate(scriptName, metaAfter.version);
    }

    return metaBefore === null || metaBefore.version !== metaAfter.version;
}

async function commitUpdate(scriptName: string, version: string) {
    await git
        // Force add because dist/ is in .gitignore
        .add(['-f', `dist/${scriptName}.*`])
        .commit(`🤖 ${scriptName} ${version}`);
}

async function scanAndPush() {
    const userscriptDirs = (await fs.readdir('./src'))
        .filter((name) => name.startsWith('mb_'));

    let anyUpdates = false;
    for (const scriptName of userscriptDirs) {
        anyUpdates ||= await commitIfUpdated(scriptName);
    }

    if (anyUpdates) {
        console.log('Pushing…');
        await git.push();
    }
}

await scanAndPush();
