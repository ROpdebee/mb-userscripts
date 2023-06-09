/**
 * Rollup plugin to generate userscript metadata.
 */

import type { Plugin } from 'rollup';

import type { MetadataGenerator } from '../userscript-metadata';

/** Options for the plugin. */
interface PluginOptions {
    /** Which files to include. */
    include: Readonly<RegExp>;
}


/* istanbul ignore next: Covered by build, can't be tested, see `loadMetadata`. */
/**
 * Create rollup plugin to generate userscripts.
 *
 * @param      {Readonly<PluginOptions>}  options        Plugin options.
 * @param      {MetadataGenerator}        metaGenerator  Userscript metadata generator.
 * @return     {Plugin}                   The plugin.
 */
export function userscript(options: Readonly<PluginOptions>, metaGenerator: MetadataGenerator): Plugin {
    // Will be set to the string content of the metadata block during the build
    // phase, and will be used again during the output phase.
    let metadataBlock: string;

    return {
        name: 'UserscriptPlugin',

        /**
         * Hook for the plugin. Emits the .meta.js file. Doesn't actually transform the code, but we
         * need it to run sequentially.
         *
         * @param      {string}              _code   The chunk's code.
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
            const sourceUrl = metaGenerator.gitURLs.constructSourceURL(metaGenerator.options.userscriptName);
            const sourceReferenceComment = `// For original source code, see ${sourceUrl}`;
            return {
                code: `${metadataBlock}\n\n${sourceReferenceComment}\n${code}`,
            };
        },
    };
}
