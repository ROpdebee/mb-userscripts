import fs from 'fs';
import path from 'path';


const DEFAULT_OPTIONS = {
    branchName: 'main',
    metadataOrder: [
        'name', 'description', 'version', 'author', 'license', 'namespace',
        'homepageURL', 'supportURL', 'downloadURL', 'updateURL',
        'match', 'exclude', 'require', 'run-at', 'grant', 'connect',
    ],
};

export function userscript(options) {
    options = {...options, ...DEFAULT_OPTIONS};
    const longestMetadataField = [...options.metadataOrder]
        .sort((a, b) => b.length - a.length)[0];

    /**
     * Derive a number of GitHub-related URLs from a git+ repo URL.
     *
     * @param      {Object}  gitRepoObject          The package.json repository
     *                                              object. Assumed to contain a
     *                                              "branch" property, in case of
     *                                              absence, uses the provided
     *                                              default.
     * @param      {string}  [branchName='master']  The branch name.
     * @return     {Object}  GitHub related URLs, maybe empty.
     */
    function deriveBaseURLsFromGitRepo(gitRepoObject) {
        const baseRepo = gitRepoObject.url.match(/:\/\/github\.com\/(.+?\/.+?)(?:\.git)?$/)?.[1];
        if (!baseRepo) return {};

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
     * @param      {Object}  specificMetadata  The userscript-specific metadata.
     * @return     {Object}  The full metadata.
     */
    async function insertDefaultMetadata(specificMetadata) {
        const npmPackage = await fs.promises.readFile('package.json', {
            encoding: 'utf-8',
        }).then((content) => JSON.parse(content));

        const githubURLs = deriveBaseURLsFromGitRepo(npmPackage.repository);

        function constructRawURL(fileName) {
            return [
                githubURLs.rawURL,
                options.branchName,
                options.outputDir,
                fileName
            ].join('/');
        }

        const defaultMetadata = {
            author: npmPackage.author,
            license: npmPackage.license,
            supportURL: npmPackage.bugs?.url ?? githubURLs.issuesURL,
            homepageURL: githubURLs.homepageURL,
            downloadURL: constructRawURL(`${options.userscriptName}.user.js`),
            updateURL: constructRawURL(`${options.userscriptName}.meta.js`),
            namespace: githubURLs.homepageURL,
            grant: ['none'],
        };

        return {...defaultMetadata, ...specificMetadata};
    }

    /**
     * Loads the userscript's metadata.
     *
     * @param      {string}  userscriptName  The name of the userscript directory.
     * @return     {Object}  The userscript's metadata.
     */
    async function loadMetadata() {
        const metadataFile = path.resolve('./src', options.userscriptName, 'meta.js');
        const { default: specificMetadata } = await import(metadataFile);
        return insertDefaultMetadata(specificMetadata);
    }

    /**
     * Create a line of metadata.
     *
     * @param      {string}  metadataField  The metadata field
     * @param      {string}  metadataValue  The metadata value
     * @return     {string}  Metadata line.
     */
    function createMetadataLine(metadataField, metadataValue) {
        const fieldIndented = metadataField.padEnd(longestMetadataField.length);
        return `@${fieldIndented}  ${metadataValue}`;
    }

    /**
     * Create separate lines of metadata.
     *
     * @param      {string}  [metadataField, metadataValue]  The metadata field and value.
     * @return     {Array}   Metadata lines.
     */
    function createMetadataLines([metadataField, metadataValue]) {
        if (typeof metadataValue === 'string') {
            return [createMetadataLine(metadataField, metadataValue)];
        }

        return metadataValue.map((value) => createMetadataLine(metadataField, value));
    }

    /**
     * Creates the userscript's metadata block.
     *
     * @param      {string}  scriptName  The name of the userscript.
     * @param      {object}  metadata    The userscript metadata.
     */
    function createMetadataBlock(scriptName, metadata) {
        let metadataLines = Object.entries(metadata)
            .sort((a, b) => options.metadataOrder.indexOf(a[0]) - options.metadataOrder.indexOf(b[0]))
            .flatMap(createMetadataLines);
        metadataLines.unshift('==UserScript==');
        metadataLines.push('==/UserScript==');

        metadataLines = metadataLines
            .map((line) => `// ${line}`);

        return metadataLines.join('\n');
    }

    // Will be set to the string content of the metadata block during the build
    // phase, and will be used again during the output phase.
    let metadataBlock;

    return {
        /**
         * Hook for the plugin. Emits the .meta.js file. Doesn't actually
         * transform the code, but we need it to run sequentially.
         *
         * @param      {string}   code    The code
         * @param      {string}   id      The identifier
         * @return     {Promise}  The new code.
         */
        async transform(code, id) {
            // We're not using createFilter from @rollup/pluginutils here,
            // since that filters out the virtual files, which we actually
            // need
            if (!id.match(options.include)) return;

            metadataBlock = createMetadataBlock(
                options.userscriptName,
                await loadMetadata());

            this.emitFile({
                type: 'asset',
                fileName: `${options.userscriptName}.meta.js`,
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
        renderChunk(code) {
            return `${metadataBlock}\n\n${code}`;
        }
    };
}
