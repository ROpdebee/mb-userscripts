import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

import type { Plugin } from 'rollup';
import type { PackageJson } from 'type-fest';

import type { UserscriptMetadata, AllUserscriptMetadata } from 'userscriptMetadata';

interface UserscriptOptions {
    userscriptName: string
    outputDir: string
    include: Readonly<RegExp>
    branchName?: string
    metadataOrder?: readonly string[]
}

interface _UserscriptOptionsWithDefaults extends UserscriptOptions {
    metadataOrder: readonly string[]
    branchName: string
}


const DEFAULT_OPTIONS = {
    branchName: 'main',
    metadataOrder: [
        'name', 'description', 'version', 'author', 'license', 'namespace',
        'homepageURL', 'supportURL', 'downloadURL', 'updateURL',
        'match', 'exclude', 'require', 'resource', 'run-at', 'grant', 'connect',
    ],
};

function _userscript(options: Readonly<_UserscriptOptionsWithDefaults>): Plugin {
    const longestMetadataFieldLength = Math.max(...options.metadataOrder.map((field) => field.length));

    interface GitURLs {
        homepageURL: string
        rawURL: string
        issuesURL: string
    }

    /**
     * Derive a number of GitHub-related URLs from a git+ repo URL.
     *
     * @param      {Object}   gitRepoObject  The package.json repository
     *                                       object. Assumed to contain a
     *                                       "branch" property, in case of
     *                                       absence, uses the provided
     *                                       default.
     * @return     {GitURLs}  GitHub related URLs.
     */
    function deriveBaseURLsFromGitRepo(gitRepoObject: string | { url: string }): GitURLs {
        let repoUrl;
        if (typeof gitRepoObject === 'string') {
            repoUrl = gitRepoObject;
        } else {
            repoUrl = gitRepoObject.url;
        }

        const baseRepo = repoUrl.match(/:\/\/github\.com\/(.+?\/.+?)(?:\.git)?$/)?.[1];
        if (!baseRepo) throw new Error(`Cannot parse GitHub URL ${repoUrl}`);

        const homepageURL = `https://github.com/${baseRepo}`;
        const rawURL = `https://raw.github.com/${baseRepo}`;
        return {
            homepageURL,
            rawURL,
            issuesURL: `${homepageURL}/issues`
        };
    }


    /**
     * Insert missing metadata from defaults.
     *
     * @param      {UserscriptMetadata}              specificMetadata  The userscript-specific metadata.
     * @return     {Promise<AllUserscriptMetadata>}  The specific metadata amended with defaults.
     */
    async function insertDefaultMetadata(specificMetadata: Readonly<UserscriptMetadata>): Promise<AllUserscriptMetadata> {
        const npmPackage: PackageJson = await fs.promises.readFile('package.json', {
            encoding: 'utf-8',
        }).then((content) => JSON.parse(content));

        if (!npmPackage.repository) {
            throw new Error('No repository defined in package.json');
        }
        const githubURLs = deriveBaseURLsFromGitRepo(npmPackage.repository);

        function constructRawURL(fileName: string): string {
            return [
                githubURLs.rawURL,
                options.branchName,
                options.outputDir,
                fileName
            ].join('/');
        }

        if (!npmPackage.author) {
            throw new Error('No author set in package.json');
        }

        const defaultMetadata = {
            author: typeof npmPackage.author === 'string' ? npmPackage.author : npmPackage.author.name,
            license: npmPackage.license,
            supportURL: (typeof npmPackage.bugs === 'string' ? npmPackage.bugs : npmPackage.bugs?.url) ?? githubURLs.issuesURL,
            homepageURL: githubURLs.homepageURL,
            downloadURL: constructRawURL(`${options.userscriptName}.user.js`),
            updateURL: constructRawURL(`${options.userscriptName}.meta.js`),
            namespace: githubURLs.homepageURL, // often used as homepage URL (has the widest support)
            grant: ['none'],
        };

        return {...defaultMetadata, ...specificMetadata};
    }

    /**
     * Loads the userscript's metadata.
     *
     * @return     {Promise<UserscriptMetadata>}  The userscript's metadata.
     */
    async function loadMetadata(): Promise<AllUserscriptMetadata> {
        // use file URLs for compatibility with Windows, otherwise drive letters are recognized as an invalid protocol
        const metadataFile = pathToFileURL(path.resolve('./src', options.userscriptName, 'meta.ts')).href;
        const specificMetadata: UserscriptMetadata = (await import(metadataFile)).default;
        return insertDefaultMetadata(specificMetadata);
    }

    /**
     * Create a line of metadata.
     *
     * @param      {string}  metadataField  The metadata field
     * @param      {string}  metadataValue  The metadata value
     * @return     {string}  Metadata line.
     */
    function createMetadataLine(metadataField: string, metadataValue: string): string {
        const fieldIndented = metadataField.padEnd(longestMetadataFieldLength);
        return `@${fieldIndented}  ${metadataValue}`;
    }

    /**
     * Create separate lines of metadata.
     *
     * @param      {string}  [metadataField, metadataValue]  The metadata field and value.
     * @return     {Array}   Metadata lines.
     */
    function createMetadataLines(
        [metadataField, metadataValue]: readonly [string, string | readonly string[]]
    ): string[] {
        if (typeof metadataValue === 'string') {
            return [createMetadataLine(metadataField, metadataValue)];
        }

        return metadataValue.map((value) => createMetadataLine(metadataField, value));
    }

    /**
     * Creates the userscript's metadata block.
     *
     * @param      {AllUserscriptMetadata}  metadata  The userscript metadata.
     * @return     {string}                 The metadata block for the
     *                                      userscript.
     */
    function createMetadataBlock(metadata: Readonly<AllUserscriptMetadata>): string {
        let metadataLines = Object.entries<string | readonly string[]>(metadata)
            .sort((a: readonly [string, unknown], b: readonly [string, unknown]) =>
                options.metadataOrder.indexOf(a[0]) - options.metadataOrder.indexOf(b[0]))
            .flatMap(createMetadataLines);
        metadataLines.unshift('==UserScript==');
        metadataLines.push('==/UserScript==');

        metadataLines = metadataLines
            .map((line) => `// ${line}`);

        return metadataLines.join('\n');
    }

    // Will be set to the string content of the metadata block during the build
    // phase, and will be used again during the output phase.
    let metadataBlock: string;

    return {
        name: 'UserscriptPlugin',

        /**
         * Hook for the plugin. Emits the .meta.js file. Doesn't actually
         * transform the code, but we need it to run sequentially.
         *
         * @param      {string}              _code    The chunk's code.
         * @param      {string}              id      The chunk's identifier.
         * @return     {Promise<undefined>}  Nothing, resolves after emitted.
         */
        async transform(_code: string, id: string): Promise<undefined> {
            // We're not using createFilter from @rollup/pluginutils here,
            // since that filters out the virtual files, which we actually
            // need
            if (!id.match(options.include)) return;

            metadataBlock = createMetadataBlock(await loadMetadata());

            this.emitFile({
                type: 'asset',
                fileName: `${options.userscriptName}.meta.js`,
                source: metadataBlock,
            });

            return;
        },

        // Using renderChunk rather than banner because with banner, it adds
        // an empty line at the top for some reason.

        /**
         * Prepend the metadata block to the output.
         *
         * @param      {String}  code    The code
         * @return     {String}  The code with the metadata block prepended.
         */
        renderChunk(code: string): string {
            return `${metadataBlock}\n\n${code}`;
        }
    };
}

export function userscript(options: Readonly<UserscriptOptions>): Plugin {
    return _userscript({...DEFAULT_OPTIONS, ...options} as _UserscriptOptionsWithDefaults);
}
