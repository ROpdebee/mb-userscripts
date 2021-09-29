import simpleGit from 'simple-git';
import { pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs/promises';
import type { UserscriptMetadata } from 'userscriptMetadata';

const beforeSha = process.argv[2];
const afterSha = process.argv[3];
const distRepo = process.argv[4];

// We're using two separate clones of the same repo here. gitSrc is checked out
// to the branch we're building from. gitDist is checked out to the `dist` branch.
// We're using two copies so we can simultaneously extract versions from the source,
// while also committing to the dist, without constantly having to change branches.
const gitSrc = simpleGit();
const gitDist = simpleGit(distRepo);

if (!process.env.GITHUB_ACTIONS) {
    throw new Error('Refusing to run outside of CI, sorry :(');
}

function loadMetaTsContents(ref: string, metaPath: string): Promise<string | null> {
    try {
        return gitSrc.show(`${ref}:${metaPath}`);
    } catch {
        // Above throws if the path doesn't exist in the ref. This could happen
        // in two cases: 1) The ref doesn't contain the file, and 2) the ref
        // itself doesn't exist.
        // Case 1 can occur if the script is entirely new, in which case an
        // update should be created.
        // Case 2 shouldn't occur, but can occur after the very first commit
        // of the repo (a problem we shouldn't run into), or when a branch was
        // force-pushed, in which case the beforeSha will no longer exist. This
        // again cannot occur, since force-pushes to main are disallowed.
        //
        // Nonetheless, we'll make sure this ref exists. The line below will
        // throw if it doesn't, which should never occur in practice.
        gitSrc.show(ref);
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

async function commitUpdate(scriptName: string, version: string): Promise<void> {
    // Copy over the compiled files to the dist repo
    await Promise.all(['.meta.js', '.user.js']
        .map((suffix) => scriptName + suffix)
        .map((distFileName) => {
            const srcPath = path.resolve('dist', distFileName);
            const destPath = path.resolve(distRepo, distFileName);
            return fs.copyFile(srcPath, destPath);
        }));
    await gitDist
        .add([`${scriptName}.*`])
        .commit(`🤖 ${scriptName} ${version}`);
}

async function scanAndPush(): Promise<void> {
    const userscriptDirs = (await fs.readdir('./src'))
        .filter((name) => name.startsWith('mb_'));

    let anyUpdates = false;
    for (const scriptName of userscriptDirs) {
        anyUpdates ||= await commitIfUpdated(scriptName);
    }

    if (anyUpdates) {
        console.log('Pushing…');
        await gitDist.push();
    }
}

await scanAndPush();
