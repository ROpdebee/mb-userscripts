/**
 * Object utilities.
 */

import type { ValueOf } from 'type-fest';

/**
 * Create a reverse mapping of a string->string enum-like object.
 *
 * This is intended to be used with enum-like objects. For number enums, it may
 * be possible to use reverse mappings instead. For string enums, TypeScript
 * does not create reverse mappings at all.
 *
 * Note that this function does not create a value->key mapping. In fact, it
 * simply maps the values onto itself. However, this is still useful so we're
 * able to do the following:
 *
 * ```
 * const MyEnum = {
 *    A = 'a',
 *    B = 'b',
 * } as const;
 * const reverseMyEnum = createReverseEnum(MyEnum);
 *
 * reverseMyEnum.get('a') == MyEnum.A;  // true
 * reverseMyEnum.get('c');  // undefined, not 'c'
 * ```
 *
 * Note also that we're not explicitly typing the object keys, only the values,
 * allowing you to do:
 * ```
 * const MyEnum = {
 *      A = 'a',
 *      B = 'b',
 * } as const;
 * const reverseMyEnum = createReverseEnum(MyEnum);
 *
 * reverseMyEnum.set('also-A', MyEnum.A);
 * reverseMyEnum.get('also-A') == MyEnum.A;  // true
 * ```
 *
 * @param      {Readonly<O>}     enumObj  The enum object
 * @return     {Map<V, string>}  The reverse mapping
 */
export function createReverseEnum<O extends Record<string, string>>(enumObj: Readonly<O>): Map<string, ValueOf<O>> {
    return new Map(Object.entries(enumObj)
        .map(([enumKey, enumValue]) => [enumValue, enumObj[enumKey]]));
}
