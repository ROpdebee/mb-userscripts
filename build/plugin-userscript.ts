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
    branchName: 'dist',
    metadataOrder: [
        'name', 'description', 'version', 'author', 'license', 'namespace',
        'homepageURL', 'supportURL', 'downloadURL', 'updateURL',
        'match', 'exclude', 'require', 'resource', 'run-at', 'grant', 'connect',
    ],
};

class GitURLs {
    readonly #owner: string
    readonly #repoName: string

    constructor(repoUrl: string) {
        const [owner, repoName] = new URL(repoUrl).pathname.match(/^\/([^/]+)\/([^/]+?)(?:\.git|$)/)?.slice(1) ?? [];
        if (!owner || !repoName) throw new Error(`Malformed git URL ${repoUrl}`);

        this.#owner = owner;
        this.#repoName = repoName;
    }

    get homepageURL(): string {
        return `https://github.com/${this.#owner}/${this.#repoName}`;
    }

    get issuesURL(): string {
        return `${this.homepageURL}/issues`;
    }

    constructRawURL(branchName: string, filePath: string): string {
        return 'https://raw.github.com/' + [this.#owner, this.#repoName, branchName, filePath].join('/');
    }

    static fromPackageJson(npmPackage: PackageJson): GitURLs {
        if (!npmPackage.repository) {
            throw new Error('No repository defined in package.json');
        }
        if (typeof npmPackage.repository === 'string') {
            return new GitURLs(npmPackage.repository);
        } else {
            return new GitURLs(npmPackage.repository.url);
        }
    }
}

class MetadataGenerator {
    readonly options: Readonly<_UserscriptOptionsWithDefaults>
    readonly longestMetadataFieldLength: number

    constructor(options: Readonly<_UserscriptOptionsWithDefaults>) {
        this.options = options;
        this.longestMetadataFieldLength = Math.max(...options.metadataOrder.map((field) => field.length));
    }

    /**
     * Insert missing metadata from defaults.
     *
     * @param      {UserscriptMetadata}              specificMetadata  The userscript-specific metadata.
     * @return     {Promise<AllUserscriptMetadata>}  The specific metadata amended with defaults.
     */
    private async insertDefaultMetadata(specificMetadata: Readonly<UserscriptMetadata>): Promise<AllUserscriptMetadata> {
        const npmPackage: PackageJson = await fs.promises.readFile('package.json', {
            encoding: 'utf-8',
        }).then((content) => JSON.parse(content));
        const gitURLs = GitURLs.fromPackageJson(npmPackage);

        if (!npmPackage.author) {
            throw new Error('No author set in package.json');
        }

        const defaultMetadata = {
            author: typeof npmPackage.author === 'string' ? npmPackage.author : npmPackage.author.name,
            license: npmPackage.license,
            supportURL: (typeof npmPackage.bugs === 'string' ? npmPackage.bugs : npmPackage.bugs?.url) ?? gitURLs.issuesURL,
            homepageURL: gitURLs.homepageURL,
            downloadURL: gitURLs.constructRawURL(this.options.branchName, `${this.options.userscriptName}.user.js`),
            updateURL: gitURLs.constructRawURL(this.options.branchName, `${this.options.userscriptName}.meta.js`),
            namespace: gitURLs.homepageURL, // often used as homepage URL (has the widest support)
            grant: ['none'],
        };

        return {...defaultMetadata, ...specificMetadata};
    }

    /* istanbul ignore next: Covered by build, testing leads to segfault because of TS import */
    /**
     * Loads the userscript's metadata.
     *
     * @return     {Promise<UserscriptMetadata>}  The userscript's metadata.
     */
    private async loadMetadata(): Promise<AllUserscriptMetadata> {
        // use file URLs for compatibility with Windows, otherwise drive letters are recognized as an invalid protocol
        const metadataFile = pathToFileURL(path.resolve('./src', this.options.userscriptName, 'meta.ts')).href;
        const specificMetadata: UserscriptMetadata = (await import(metadataFile)).default;
        return this.insertDefaultMetadata(specificMetadata);
    }

    /**
     * Create a line of metadata.
     *
     * @param      {string}  metadataField  The metadata field
     * @param      {string}  metadataValue  The metadata value
     * @return     {string}  Metadata line.
     */
    private createMetadataLine(metadataField: string, metadataValue: string): string {
        const fieldIndented = metadataField.padEnd(this.longestMetadataFieldLength);
        return `@${fieldIndented}  ${metadataValue}`;
    }

    /**
     * Create separate lines of metadata.
     *
     * @param      {string}  [metadataField, metadataValue]  The metadata field and value.
     * @return     {Array}   Metadata lines.
     */
    private createMetadataLines(
        [metadataField, metadataValue]: readonly [string, string | readonly string[]]
    ): string[] {
        if (typeof metadataValue === 'string') {
            return [this.createMetadataLine(metadataField, metadataValue)];
        }

        return metadataValue.map((value) => this.createMetadataLine(metadataField, value));
    }

    /**
     * Creates the userscript's metadata block.
     *
     * @param      {AllUserscriptMetadata}  metadata  The userscript metadata.
     * @return     {string}                 The metadata block for the
     *                                      userscript.
     */
    private createMetadataBlock(metadata: Readonly<AllUserscriptMetadata>): string {
        const metadataLines = Object.entries<string | readonly string[]>(metadata)
            .sort((a: readonly [string, unknown], b: readonly [string, unknown]) =>
                this.options.metadataOrder.indexOf(a[0]) - this.options.metadataOrder.indexOf(b[0]))
            .flatMap(this.createMetadataLines.bind(this));

        metadataLines.unshift('==UserScript==');
        metadataLines.push('==/UserScript==');

        return metadataLines
            .map((line) => '// ' + line)
            .join('\n');
    }

    /* istanbul ignore next: Covered by build, see `loadMetadata`. */
    async generateMetadataBlock(): Promise<string> {
        return this.createMetadataBlock(await this.loadMetadata());
    }
}

/* istanbul ignore next: Covered by build, can't be tested, see `loadMetadata`. */
export function userscript(options: Readonly<UserscriptOptions>): Plugin {

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

            const metaGenerator = new MetadataGenerator({ ...DEFAULT_OPTIONS, ...options });
            metadataBlock = await metaGenerator.generateMetadataBlock();

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
