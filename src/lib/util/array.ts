/**
 * Array utility functions.
 */

// Most of these are provided by other libraries like lodash, but it's less
// bundled code if we write it ourselves.

export function filterNonNull<T>(array: Array<T | null | undefined>): T[] {
    return array.filter((element) =>
        !(element === null || element === undefined)) as T[];
}


export function findRight<T>(array: T[], predicate: (element: T) => boolean): T | null {
    for (let index = array.length - 1; index >= 0; index--) {
        if (predicate(array[index])) return array[index];
    }

    return null;
}

export function groupBy<T, K, V>(array: T[], keyFunction: (element: T) => K, valueTransform: (element: T) => V): Map<K, V[]> {
    const map = new Map<K, V[]>();
    for (const element of array) {
        const k = keyFunction(element);
        const v = valueTransform(element);

        if (map.has(k)) map.get(k)?.push(v);
        else (map.set(k, [v]));
    }

    return map;
}

/**
 * Sort an array of strings using `Intl.Collator`. Array is modified in-place,
 * and returned.
 */
export function collatedSort(array: string[]): string[] {
    const coll = new Intl.Collator('en', { numeric: true });
    return array.sort(coll.compare.bind(coll));
}

export function enumerate<T>(array: readonly T[]): Array<[T, number]> {
    return array.map((element, index) => [element, index]);
}

function isFactory<T2>(maybeFactory: T2 | (() => T2)): maybeFactory is () => T2 {
    return typeof maybeFactory === 'function';
}

/**
 * Create an array wherein a given element is inserted between every two
 * consecutive elements of the original array.
 *
 * Example:
 *  insertBetween([1,2,3], 0) // => [1, 0, 2, 0, 3]
 *  insertBetween([1], 0)  // => [1]
 *
 * @param      {readonly T1[]}   arr         The original array.
 * @param      {T2}              newElement  The element to insert, or a factory creating these elements.
 * @return     {(Array<T1|T2>)}  Resulting array.
 */
export function insertBetween<T1, T2>(array: readonly T1[], newElement: T2 | (() => T2)): Array<T1 | T2> {
    return [
        ...array.slice(0, 1),
        ...array.slice(1).flatMap((element) => [isFactory(newElement) ? newElement() : newElement, element]),
    ];
}
