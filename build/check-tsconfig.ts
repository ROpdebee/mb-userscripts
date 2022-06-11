import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

import type { TsConfigJson } from 'type-fest';
import globCb from 'glob';

const glob = promisify(globCb);

// Assumes that comments start on their own line.
function stripComments(jsonContent: string): string {
    return jsonContent
        .split('\n')
        .filter((line) => !line.trim().startsWith('//'))
        .join('\n');
}

async function check(): Promise<void> {
    // Ensure all subprojects are referenced in the glue tsconfig.json.

    // Scan repo for subproject configurations.
    // Don't match any configs in node_modules. This also requires the config
    // to be in a subdirectory, which we want, as we don't want to match the
    // root config.
    const subprojectConfigs = await glob('!(node_modules)/**/tsconfig.json');

    const rootConfigContent = await fs.readFile('tsconfig.json', {
        encoding: 'utf8',
    });
    const rootConfig = JSON.parse(stripComments(rootConfigContent)) as TsConfigJson;

    const referencedProjects = new Set(rootConfig.references?.map((ref) => path.resolve(ref.path)));

    for (const subprojectConfig of subprojectConfigs) {
        const subproject = path.parse(path.resolve(subprojectConfig)).dir;
        if (!referencedProjects.has(subproject)) {
            throw new Error(`Subproject ${subprojectConfig} is not referenced in root project`);
        }
    }
}

check()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
