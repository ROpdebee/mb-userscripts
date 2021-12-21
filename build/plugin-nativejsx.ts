import type { JSXOptions } from 'nativejsx';
import type { Plugin } from 'rollup';
import type { FilterPattern } from '@rollup/pluginutils';

import { createFilter } from '@rollup/pluginutils';
import nativejsxPkg from 'nativejsx';
const { transpile } = nativejsxPkg;

const HELPER_IMPORTS = `
import appendChildren from 'nativejsx/source/prototypal-helpers/appendChildren';
import setAttributes from 'nativejsx/source/prototypal-helpers/setAttributes';
import setStyles from 'nativejsx/source/prototypal-helpers/setStyles';`;


interface NativeJSXPluginOptions extends Partial<JSXOptions> {
    include?: FilterPattern;
    exclude?: FilterPattern;
}

/**
 * NativeJSX transformer plugin.
 *
 * Options are identical to nativejsx, except for 'prototypes', whose default
 * is 'module'. When 'module' is specified, nativejsx helpers will be added
 * as static imports.
 *
 * @param      {Readonly<NativeJSXOptions>}  options  The options
 * @return     {Plugin}                      The plugin.
 */
export function nativejsx(options?: Readonly<NativeJSXPluginOptions>): Plugin {
    const { include, exclude, ...nativejsxOptions } = options ?? {};
    const filter = createFilter(include, exclude);

    if (!('prototypes' in nativejsxOptions)) {
        nativejsxOptions.prototypes = 'module';
    }

    return {
        name: 'NativeJSXPlugin',

        /**
         * Transform hook for the plugin. Transforms included files with
         * nativejsx.
         *
         * @param      {string}                       code    The code
         * @param      {string}                       id      The identifier
         * @return     {Promise<undefined | string>}  The transformed result.
         */
        async transform(code: string, id: string): Promise<undefined | string> {
            if (!filter(id)) return;

            const transpiled = transpile(code, nativejsxOptions);

            if (nativejsxOptions.prototypes !== 'module') {
                return transpiled;
            }

            const result = [HELPER_IMPORTS, transpiled].join('\n\n');
            return result;
        },
    };
}
