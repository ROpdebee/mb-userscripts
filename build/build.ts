import fs from 'node:fs/promises';

import { generateReadmeContent } from './generate-readme';
import { buildUserscripts } from './rollup';
import { getVersionForToday } from './versions';

async function checkReadmeContent(): Promise<void> {
    const actualContent = await fs.readFile('README.md', 'utf8');
    const expectedContent = await generateReadmeContent();

    if (actualContent !== expectedContent) {
        throw new Error('README content has changed. Please regenerate (npm run generate-readme).');
    }
}

// Don't use await at the top level, this is incompatible with node and
// CommonJS modules.
buildUserscripts(getVersionForToday())
    .then(checkReadmeContent)
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
