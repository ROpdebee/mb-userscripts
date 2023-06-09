/**
 * Userscript metadata utilities.
 */

import fs from 'node:fs';
import path from 'node:path';
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34960
import { URL } from 'node:url';

import type { PackageJson } from 'type-fest';

import type { AllUserscriptMetadata, UserscriptMetadata } from '@lib/util/metadata';
import { filterNonNull } from '@lib/util/array';

/** Options for userscript metadata. */
interface UserscriptOptions {
    /** Name of the userscript. */
    userscriptName: string;
    /** Version of the userscript. */
    version: string;
    /** Name of the branch where the userscripts are deployed. */
    branchName?: string;  // TODO: Naming can be improved.
    /** Order of the metadata fields. */
    metadataOrder?: readonly string[];
}

/** Userscript options with all fields mandatory. */
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

/**
 * Aggregation of GitHub URLs.
 */
export /* for tests */ class GitURLs {
    private readonly owner: string;
    private readonly repoName: string;

    private constructor(repoUrl: string) {
        const [owner, repoName] = new URL(repoUrl).pathname.match(/^\/([^/]+)\/([^/]+?)(?:\.git|$)/)?.slice(1) ?? [];
        if (!owner || !repoName) throw new Error(`Malformed git URL ${repoUrl}`);

        this.owner = owner;
        this.repoName = repoName;
    }

    /** URL to the homepage of the repository. */
    public get homepageURL(): string {
        return `https://github.com/${this.owner}/${this.repoName}`;
    }

    /** URL to the issues page of the repository. */
    public get issuesURL(): string {
        return `${this.homepageURL}/issues`;
    }

    /**
     * Construct a URL to the raw content of a file in the repository.
     *
     * @param      {string}  branchName  Name of the branch in which the file is stored.
     * @param      {string}  filePath    Path to the file.
     * @return     {string}  URL to the raw file contents.
     */
    public constructRawURL(branchName: string, filePath: string): string {
        return 'https://raw.github.com/' + [this.owner, this.repoName, branchName, filePath].join('/');
    }

    /**
     * Construct a URL to the sources of a userscript.
     *
     * @param      {string}  userscriptName  Name of the userscript.
     * @return     {string}  URL to the sources of the userscript.
     */
    public constructSourceURL(userscriptName: string): string {
        return 'https://github.com/' + [this.owner, this.repoName, 'tree/main/src', userscriptName].join('/');
    }

    /**
     * Construct a URL to the git blob content of a file in the repository.
     *
     * @param      {string}  branchName  Name of the branch in which the file is stored.
     * @param      {string}  filePath    Path to the file.
     * @return     {string}  Constructed blob URL for the file.
     */
    public constructBlobURL(branchName: string, filePath: string): string {
        return 'https://github.com/' + [this.owner, this.repoName, 'blob', branchName, filePath].join('/');
    }

    /**
     * Construct an instance from information inside of the `package.json` file.
     *
     * Can only be used with `package.json` files which contain repository information.
     *
     * @param      {PackageJson}  npmPackage  The `package.json` file contents.
     * @return     {GitURLs}      The constructed instance.
     */
    public static fromPackageJson(npmPackage: PackageJson): GitURLs {
        if (!npmPackage.repository) {
            throw new Error('No repository defined in package.json');
        }
        const repo = npmPackage.repository;
        return new GitURLs(typeof repo === 'string' ? repo : repo.url);
    }
}

/**
 * Load the contents of the `package.json` file in the repository.
 *
 * @return     {Promise<PackageJson>}  Parsed `package.json` contents.
 */
async function loadPackageJson(): Promise<PackageJson> {
    const content = await fs.promises.readFile('package.json', {
        encoding: 'utf8',
    });

    return JSON.parse(content) as PackageJson;
}

/**
 * Class that generates userscript metadata.
 */
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

    /**
     * Create a metadata generator instance with the given options.
     *
     * @param      {Readonly<UserscriptOptions>}  options  Metadata options.
     * @return     {Promise<MetadataGenerator>}   Constructed instance.
     */
    public static async create(options: Readonly<UserscriptOptions>): Promise<MetadataGenerator> {
        const npmPackage = await loadPackageJson();
        return new MetadataGenerator({ ...DEFAULT_OPTIONS, ...options }, npmPackage);
    }

    /**
     * Given a Greasemonkey API name, provide all naming options for this API.
     *
     * @example
     * transformGMFunction('GM_getValue')
     * transformGMFunction('GM.getValue')
     * // Both lead to ["GM_getValue", "GM.getValue"]
     *
     * transformGMFunction('GM_getResourceURL')
     * // => ["GM_getResourceURL", "GM.getResourceUrl", "GM.getResourceURL"]
     * // because of naming inconsistencies between different userscript engines.
     *
     * @param      {string}    name    A name of a GM API.
     * @return     {string[]}  All transformed variants of the API
     */
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

        const allMetadata = { ...defaultMetadata, ...specificMetadata };
        if (specificMetadata.grant?.length) {
            const oldGrant = (Array.isArray(allMetadata.grant) ? allMetadata.grant : filterNonNull([allMetadata.grant as string])) as string[];
            allMetadata.grant = oldGrant.flatMap(this.transformGMFunction.bind(this));
        }

        return allMetadata;
    }

    /* istanbul ignore next: Covered by build, testing leads to segfault because of TS import */
    /**
     * Load the userscript's metadata.
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
     * @param      {string}  metadataField  The metadata field.
     * @param      {string}  metadataValue  The metadata value.
     * @return     {string}  Metadata line.
     */
    private createMetadataLine(metadataField: string, metadataValue: string): string {
        const fieldIndented = metadataField.padEnd(this.longestMetadataFieldLength);
        return `@${fieldIndented}  ${metadataValue}`;
    }

    /**
     * Create separate lines of metadata.
     *
     * @param      {...}  metadataPair  Pair of metadata field and value(s).
     * @return     {Array}              Metadata lines.
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
     * Create the userscript's metadata block.
     *
     * @param      {AllUserscriptMetadata}  metadata  The userscript metadata.
     * @return     {string}                 The metadata block for the userscript.
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
    /**
     * Generate the userscript metadata block: Load metadata and stringify it.
     *
     * @return     {Promise<string>}  The metadata block.
     */
    public async generateMetadataBlock(): Promise<string> {
        return this.createMetadataBlock(await this.loadMetadata());
    }
}
