import fs from 'node:fs/promises';

import { generateReadmeContent } from './generate-readme';
import { buildUserscript, buildUserscripts } from './rollup';
import { getVersionForToday } from './versions';

async function checkReadmeContent(): Promise<void> {
    const actualContent = await fs.readFile('README.md', 'utf8');
    const expectedContent = await generateReadmeContent();

    if (actualContent !== expectedContent) {
        throw new Error('README content has changed. Please regenerate (npm run generate-readme).');
    }
}

let buildPromise: Promise<void>;
if (process.argv.length > 2) {
    const scriptName = process.argv[2];
    buildPromise = buildUserscript(scriptName, getVersionForToday());
} else {
    buildPromise = buildUserscripts(getVersionForToday());
}

// Don't use await at the top level, this is incompatible with node and
// CommonJS modules.
buildPromise
    .then(checkReadmeContent)
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
