const path = require('path');

const { ConcatSource, RawSource } = require('webpack').sources;

const defaultMetadata = require('./defaultMetadata');

const METADATA_ORDER = [
    'name', 'description', 'version', 'author', 'license', 'namespace',
    'homepageURL', 'supportURL', 'downloadURL', 'updateURL',
    'match', 'exclude', 'require', 'run-at', 'grant', 'connect',
];
const LONGEST_METADATA_FIELD = [...METADATA_ORDER]
    .sort((a, b) => b.length - a.length)[0];

const PLUGIN_NAME = 'UserscriptPlugin';

/**
 * Loads the userscript's metadata.
 *
 * @param      {string}  userscriptName  The name of the userscript directory.
 * @return     {Object}  The userscript's metadata.
 */
function loadMetadata(userscriptName) {
    const metadataFile = path.resolve('./src', userscriptName, 'meta.js');
    const specificMetadata = require(metadataFile);

    return {
        ...defaultMetadata,
        ...specificMetadata,
    };
}

/**
 * Finalize the metadata: Insert download and update URLs.
 *
 * @param      {string}  simpleName  The userscript's simple name.
 * @param      {object}  metadata    The userscript's metadata.
 * @return     {object}  Finalized metadata.
 */
function finalizeMetadata(simpleName, metadata) {
    const metadataCopy = {...metadata};
    metadataCopy.downloadURL = `${metadata.baseDownloadURL}${simpleName}.user.js`;
    metadataCopy.updateURL = `${metadata.baseUpdateURL}${simpleName}.meta.js`;

    delete metadataCopy.baseDownloadURL;
    delete metadataCopy.baseUpdateURL;

    return metadataCopy;
}

/**
 * Create a line of metadata.
 *
 * @param      {string}  metadataField  The metadata field
 * @param      {string}  metadataValue  The metadata value
 * @return     {string}  Metadata line.
 */
function createMetadataLine(metadataField, metadataValue) {
    const fieldIndented = metadataField.padEnd(LONGEST_METADATA_FIELD.length);
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
    const finalMetadata = finalizeMetadata(scriptName, metadata);
    let metadataLines = Object.entries(finalMetadata)
        .sort((a, b) => METADATA_ORDER.indexOf(a[0]) - METADATA_ORDER.indexOf(b[0]))
        .flatMap(createMetadataLines);
    metadataLines.unshift('==UserScript==');
    metadataLines.push('==/UserScript==');

    metadataLines = metadataLines
        .map((line) => `// ${line}`);

    return metadataLines.join('\n');
}

/**
 * Transform the emitted output of the file.
 *
 * @param      {Chunk}    chunk         The chunk
 * @param      {String}   originalFile  The original file
 * @param      {?}        compilation   The compilation context.
 */
async function transformFile(chunk, originalFile, compilation) {
    const metaOutputName = `${chunk.name}.meta.js`;

    const metadata = await loadMetadata(chunk.name);
    const metadataContent = createMetadataBlock(chunk.name, metadata);

    compilation.assets[originalFile] = new ConcatSource(
        metadataContent,
        '\n',
        compilation.assets[originalFile]);
    compilation.assets[metaOutputName] = new RawSource(metadataContent);
}

module.exports = class UserscriptPlugin {
    apply(compiler) {
        // Inspired by https://github.com/momocow/webpack-userscript/
        compiler.hooks.emit.tapPromise(PLUGIN_NAME, async (compilation) => {
            for (const chunk of compilation.chunks) {
                if (!chunk.canBeInitial()) { // non-entry
                    continue;
                }

                await Promise.all([...chunk.files]
                    .map((file) => transformFile(chunk, file, compilation)));
            }
        });
    }
};
