import type { FilterPattern } from '@rollup/pluginutils';
import type { Plugin } from 'rollup';
import { createFilter } from '@rollup/pluginutils';

interface PluginOptions {
    include?: FilterPattern;
    exclude?: FilterPattern;
}

const IMPORT_STATEMENT_CODE = `
import { h, Fragment } from 'dom-chef';
`;

/**
 * Transformer plugin to automatically inject imports for dom-chef JSX renderers.
 */
export function injectJsxRenderer(options?: Readonly<PluginOptions>): Plugin {
    const { include, exclude } = options ?? {};
    const filter = createFilter(include, exclude);

    return {
        name: 'InjectJSXRendererPlugin',

        transform(code: string, id: string): string | undefined {
            if (!filter(id)) return;

            return [IMPORT_STATEMENT_CODE, code].join('\n');
        },
    };
}
