/**
 * Array utility functions.
 */

/**
 * Filter the given array to remove all `null`/`undefined` values.
 *
 * @param      {(Array<T|null|undefined>)}  array   The array to filter.
 * @return     {T[]}                        Filtered array, excluding nullable
 *                                          values.
 */
export function filterNonNull<T>(array: ReadonlyArray<T | null | undefined>): T[] {
    return array.filter((element) =>
        !(element === null || element === undefined)) as T[];
}


/**
 * Find the last element in the array that matches the given predicate.
 *
 * @param      {T[]}                array      The array.
 * @param      {(elmt:T)=>boolean}  predicate  The predicate to apply.
 * @return     {(T|null)}           Rightmost element matching the predicate,
 *                                  or `null` if no element matches.
 */
export function findRight<T>(array: readonly T[], predicate: (elmt: T) => boolean): T | null {
    for (let i = array.length - 1; i >= 0; i--) {
        if (predicate(array[i])) return array[i];
    }

    return null;
}

/**
 * Group an array into a multimap, applying a given key function and value
 * transformer.
 *
 * @param      {T[]}          array         The array.
 * @param      {(el:T)=>K}    keyFn         Function to extract the key from
 *                                          every array element.
 * @param      {(el:T)=>V}    valTransform  Function to transform the array
 *                                          element to a value.
 * @return     {Map<K, V[]>}  Map resulting from grouping the array.
 */
export function groupBy<T, K, V>(array: readonly T[], keyFn: (el: T) => K, valTransform: (el: T) => V): Map<K, V[]> {
    const map = new Map<K, V[]>();
    for (const el of array) {
        const k = keyFn(el);
        const v = valTransform(el);

        if (map.has(k)) map.get(k)?.push(v);
        else (map.set(k, [v]));
    }

    return map;
}

/**
 * Sort an array of strings using `Intl.Collator`. The array is modified
 * in-place, and returned.
 *
 * @param      {string[]}  array   The array.
 * @return     {string[]}  The input array, modified in-place.
 */
export function collatedSort(array: string[]): string[] {
    const coll = new Intl.Collator('en', { numeric: true });
    return array.sort(coll.compare.bind(coll));
}

/**
 * Enumerate an array, returning an array of pairs of elements and their
 * indices. Similar to Python's enumerate function.
 *
 * @param      {readonly T[]}        array   The array.
 * @return     {Array<[T, number]>}  Array of pairs of elements and their
 *                                   indices.
 */
export function enumerate<T>(array: readonly T[]): Array<[T, number]> {
    return array.map((el, idx) => [el, idx]);
}

/**
 * Determine whether a value is a factory function.
 *
 * @param      {unknown}  maybeFactory  Object to check.
 * @return     {bool}     True if factory, False otherwise.
 */
function isFactory<T2>(maybeFactory: T2 | (() => T2)): maybeFactory is () => T2 {
    return typeof maybeFactory === 'function';
}

/**
 * Create an array wherein a given element is inserted between every two
 * consecutive elements of the original array.
 *
 * @example
 *  insertBetween([1,2,3], 0) // => [1, 0, 2, 0, 3]
 *  insertBetween([1], 0)     // => [1]
 *
 * @param      {readonly T1[]}   arr         The original array.
 * @param      {T2}              newElement  The element to insert, or a
 *                                           factory creating these elements.
 * @return     {(Array<T1|T2>)}  Resulting array.
 */
export function insertBetween<T1, T2>(arr: readonly T1[], newElement: T2 | (() => T2)): Array<T1 | T2> {
    return [
        ...arr.slice(0, 1),
        ...arr.slice(1).flatMap((elmt) => [isFactory(newElement) ? newElement() : newElement, elmt]),
    ];
}
