/**
 * Rollup plugin to inject logging boilerplate into all compiled userscripts.
 */

import type { FilterPattern } from '@rollup/pluginutils';
import type { Plugin } from 'rollup';
import { createFilter } from '@rollup/pluginutils';

interface PluginOptions {
    include?: FilterPattern;
    exclude?: FilterPattern;
}

const LOGGER_CODE = `
import { ConsoleSink } from '@lib/logging/consoleSink';
import { LogLevel } from '@lib/logging/levels';
import { LOGGER } from '@lib/logging/logger';

import DEBUG_MODE from 'consts:debug-mode';
import USERSCRIPT_ID from 'consts:userscript-id';

LOGGER.configure({
    logLevel: DEBUG_MODE ? LogLevel.DEBUG : LogLevel.INFO,
});
LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));
`;

export const LOGGER_SOURCE_ID = '_LOGGER_virtualSource_';

/**
 * Transformer plugin to automatically inject the logger boilerplate setup.
 *
 * @param      {Readonly<PluginOptions>}  options  The plugin options.
 * @return     {Plugin}                   The plugin.
 */
export function logger(options?: Readonly<PluginOptions>): Plugin {
    // Another option would've been to put the boilerplate configuration into
    // `@lib/util/logger.ts`, so the logger gets its default configuration when
    // it's imported anywhere. However, this will also enable the logger and its
    // console sink in the tests, which would lead to noisy test output.
    const { include, exclude } = options ?? {};
    const filter = createFilter(include, exclude);

    return {
        name: 'LoggerPlugin',

        resolveId(id): { id: string; moduleSideEffects: boolean } | null {
            if (id === LOGGER_SOURCE_ID) {
                return {
                    id: LOGGER_SOURCE_ID,
                    moduleSideEffects: true,
                };
            }
            return null;
        },

        load(id): string | undefined {
            if (id === LOGGER_SOURCE_ID) return LOGGER_CODE;
            return undefined;
        },

        /**
         * Transform hook for the plugin.
         *
         * Injects the logger boilerplate setup.
         *
         * @param      {string}                       code    The code
         * @param      {string}                       id      The identifier
         * @return     {Promise<undefined | string>}  The transformed result.
         */
        async transform(code: string, id: string): Promise<undefined | string> {
            if (!filter(id)) return;

            // Insert logger code first, so it gets configured before anything
            // else runs.
            return [`import "${LOGGER_SOURCE_ID}";`, code].join('\n\n');
        },
    };
}
