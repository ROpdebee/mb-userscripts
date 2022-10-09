import fs from 'node:fs';
import path from 'node:path';
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34960
import { URL } from 'node:url';

import type { Plugin } from 'rollup';
import type { PackageJson } from 'type-fest';

import type { AllUserscriptMetadata, UserscriptMetadata } from '@lib/util/metadata';
import { filterNonNull } from '@lib/util/array';

interface UserscriptOptions {
    userscriptName: string;
    version: string;
    branchName?: string;
    metadataOrder?: readonly string[];
}

interface PluginOptions {
    include: Readonly<RegExp>;
}

interface _UserscriptOptionsWithDefaults extends UserscriptOptions {
    metadataOrder: readonly string[];
    branchName: string;
}

const DEFAULT_OPTIONS = {
    branchName: 'dist',
    metadataOrder: [
        'name', 'description', 'version', 'author', 'license', 'namespace',
        'homepageURL', 'supportURL', 'downloadURL', 'updateURL',
        'match', 'exclude', 'require', 'resource', 'run-at', 'grant', 'connect',
    ],
};

export /* for tests */ class GitURLs {
    private readonly owner: string;
    private readonly repoName: string;

    private constructor(repoUrl: string) {
        const [owner, repoName] = new URL(repoUrl).pathname.match(/^\/([^/]+)\/([^/]+?)(?:\.git|$)/)?.slice(1) ?? [];
        if (!owner || !repoName) throw new Error(`Malformed git URL ${repoUrl}`);

        this.owner = owner;
        this.repoName = repoName;
    }

    public get homepageURL(): string {
        return `https://github.com/${this.owner}/${this.repoName}`;
    }

    public get issuesURL(): string {
        return `${this.homepageURL}/issues`;
    }

    public constructRawURL(branchName: string, filePath: string): string {
        return 'https://raw.github.com/' + [this.owner, this.repoName, branchName, filePath].join('/');
    }

    public constructSourceURL(userscriptName: string): string {
        return 'https://github.com/' + [this.owner, this.repoName, 'tree/main/src', userscriptName].join('/');
    }

    public constructBlobURL(branchName: string, filePath: string): string {
        return 'https://github.com/' + [this.owner, this.repoName, 'blob', branchName, filePath].join('/');
    }

    public static fromPackageJson(npmPackage: PackageJson): GitURLs {
        if (!npmPackage.repository) {
            throw new Error('No repository defined in package.json');
        }
        const repo = npmPackage.repository;
        return new GitURLs(typeof repo === 'string' ? repo : repo.url);
    }
}

async function loadPackageJson(): Promise<PackageJson> {
    const content = await fs.promises.readFile('package.json', {
        encoding: 'utf8',
    });

    return JSON.parse(content) as PackageJson;
}

export class MetadataGenerator {
    public readonly options: Readonly<_UserscriptOptionsWithDefaults>;
    private readonly longestMetadataFieldLength: number;
    public readonly npmPackage: Readonly<PackageJson>;
    public readonly gitURLs: Readonly<GitURLs>;

    public /* for tests */ constructor(options: Readonly<_UserscriptOptionsWithDefaults>, npmPackage: Readonly<PackageJson>) {
        this.options = options;
        this.longestMetadataFieldLength = Math.max(...options.metadataOrder.map((field) => field.length));

        this.npmPackage = npmPackage;
        this.gitURLs = GitURLs.fromPackageJson(npmPackage);
    }

    public static async create(options: Readonly<UserscriptOptions>): Promise<MetadataGenerator> {
        const npmPackage = await loadPackageJson();
        return new MetadataGenerator({ ...DEFAULT_OPTIONS, ...options }, npmPackage);
    }

    private transformGMFunction(name: string): string[] {
        const bareName = name.match(/GM[_.](.+)$/)?.[1];
        if (!bareName) return [name];

        // Some functions had capitalisation changes.
        if (bareName.toLowerCase() === 'xmlhttprequest') {
            return ['GM_xmlhttpRequest', 'GM.xmlHttpRequest'];
        }

        if (bareName.toLowerCase() === 'getresourceurl') {
            return [
                'GM_getResourceURL',
                'GM.getResourceUrl',
                // Violentmonkey alternative spelling
                'GM.getResourceURL',
            ];
        }

        return ['GM_', 'GM.'].map((prefix) => prefix + bareName);
    }

    /**
     * Insert missing metadata from defaults.
     *
     * @param      {UserscriptMetadata}     specificMetadata  The userscript-specific metadata.
     * @return     {AllUserscriptMetadata}  The specific metadata amended with defaults.
     */
    private insertDefaultMetadata(specificMetadata: Readonly<UserscriptMetadata>): AllUserscriptMetadata {
        if (!this.npmPackage.author) {
            throw new Error('No author set in package.json');
        }

        const defaultMetadata = {
            version: this.options.version,
            author: typeof this.npmPackage.author === 'string' ? this.npmPackage.author : this.npmPackage.author.name,
            license: this.npmPackage.license,
            supportURL: (typeof this.npmPackage.bugs === 'string' ? this.npmPackage.bugs : this.npmPackage.bugs?.url) ?? this.gitURLs.issuesURL,
            homepageURL: this.gitURLs.homepageURL,
            downloadURL: this.gitURLs.constructRawURL(this.options.branchName, `${this.options.userscriptName}.user.js`),
            updateURL: this.gitURLs.constructRawURL(this.options.branchName, `${this.options.userscriptName}.meta.js`),
            namespace: this.gitURLs.homepageURL, // often used as homepage URL (has the widest support)
            grant: ['none'],
        };

        const allMetadata = {...defaultMetadata, ...specificMetadata};
        if (specificMetadata.grant?.length) {
            const oldGrant = (Array.isArray(allMetadata.grant) ? allMetadata.grant : filterNonNull([allMetadata.grant as string])) as string[];
            allMetadata.grant = oldGrant.flatMap(this.transformGMFunction.bind(this));
        }

        return allMetadata;
    }

    /* istanbul ignore next: Covered by build, testing leads to segfault because of TS import */
    /**
     * Loads the userscript's metadata.
     *
     * @return     {Promise<UserscriptMetadata>}  The userscript's metadata.
     */
    public async loadMetadata(): Promise<AllUserscriptMetadata> {
        const metadataFile = path.resolve('./src', this.options.userscriptName, 'meta.ts');
        // eslint-disable-next-line no-unsanitized/method -- Fine.
        const specificMetadata = (await import(metadataFile) as { default: UserscriptMetadata }).default;
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
        [metadataField, metadataValue]: readonly [string, string | readonly string[]],
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
            .filter((entry) => this.options.metadataOrder.includes(entry[0]))
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
    public async generateMetadataBlock(): Promise<string> {
        return this.createMetadataBlock(await this.loadMetadata());
    }
}

/* istanbul ignore next: Covered by build, can't be tested, see `loadMetadata`. */
export function userscript(options: Readonly<PluginOptions>, metaGenerator: MetadataGenerator): Plugin {
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
        async transform(_code: string, id: string): Promise<void> {
            // We're not using createFilter from @rollup/pluginutils here,
            // since that filters out the virtual files, which we actually
            // need
            if (!options.include.test(id)) return;

            metadataBlock = await metaGenerator.generateMetadataBlock();

            this.emitFile({
                type: 'asset',
                fileName: `${metaGenerator.options.userscriptName}.meta.js`,
                source: metadataBlock,
            });
        },

        // Using renderChunk rather than banner because with banner, it adds
        // an empty line at the top for some reason.

        /**
         * Prepend the metadata block to the output.
         *
         * @param      {String}  code    The code
         * @return     {String}  The code with the metadata block prepended.
         */
        async renderChunk(code: string): Promise<{ code: string }> {
            const sourceUrl = GitURLs.fromPackageJson(await loadPackageJson()).constructSourceURL(metaGenerator.options.userscriptName);
            const sourceReferenceComment = `// For original source code, see ${sourceUrl}`;
            return {
                code: `${metadataBlock}\n\n${sourceReferenceComment}\n${code}`,
            };
        },
    };
}
