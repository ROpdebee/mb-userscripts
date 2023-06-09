/**
 * Rollup plugin to inject constants into compiled scripts.
 *
 * Adapted from https://github.com/NotWoods/rollup-plugin-consts/ for Rollup 3. Licensed under
 * Apache 2.0, see https://github.com/NotWoods/rollup-plugin-consts/blob/main/LICENSE
 */

import type { Plugin } from 'rollup';
import type { Primitive } from 'type-fest';

type PrimitiveNoSymbol = Exclude<Primitive, symbol>;
type AllowedValue = PrimitiveNoSymbol | AllowedValue[] | { [key: string | number]: AllowedValue };

const moduleStart = 'consts:';

/**
 * Rollup plugin to inject constants into compiled scripts.
 *
 * @param      {Record<string, AllowedValue>}  constValues    The constant values to inject.
 * @return     {Plugin}                        The rollup plugin.
 */
export function consts(constValues: Record<string, AllowedValue>): Plugin {
    return {
        name: 'consts-plugin',
        resolveId(id: string): string | undefined {
            if (!id.startsWith(moduleStart)) return;
            return id;
        },
        load(id: string): string | undefined {
            if (!id.startsWith(moduleStart)) return;
            const key = id.slice(moduleStart.length);

            if (!(key in constValues)) {
                this.error(`Cannot find const: ${key}`);
            }

            return `export default ${JSON.stringify(constValues[key])}`;
        },
    };
}
