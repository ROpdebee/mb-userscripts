/**
 * Script to check whether all TypeScript subprojects are referenced in the main `tsconfig.json`
 * file. The latter is used as an entrypoint for the TS type checker, so if any project is not
 * referenced, it will not be type-checked.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

import type { TsConfigJson } from 'type-fest';
import { glob } from 'glob';


/**
 * Strip comments from JSON content.
 *
 * Assumes that comments start on their own line.
 *
 * @param      {string}  jsonContent  The JSON file content.
 * @return     {string}  `jsonContent` with comments stripped.
 */
function stripComments(jsonContent: string): string {
    return jsonContent
        .split('\n')
        .filter((line) => !line.trim().startsWith('//'))
        .join('\n');
}


/**
 * Ensure all subprojects are referenced in the glue `tsconfig.json` file. Throws error if not.
 */
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
