// adapted from https://gist.github.com/HenrikJoreteg/38b2717c138b5997ae406b1e2d9c556d

import type { FilterPattern } from '@rollup/pluginutils';
import type { Plugin, TransformResult } from 'rollup';
import { createFilter } from '@rollup/pluginutils';

interface Options {
  include: FilterPattern;
  imports: string[];
}

export const addImports = (opts: Options): Plugin => {
    const filter = createFilter(opts.include);

    return {
        name: 'add-imports',

        transform(code: string, id: string): TransformResult {
            if (!filter(id)) return;
            return {
                code: opts.imports.concat([code]).join('\n'),
                map: { mappings: '' }
            };
        },
    };
};
