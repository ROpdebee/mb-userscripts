/**
 * Array utility functions.
 */

// Most of these are provided by other libraries like lodash, but it's less
// bundled code if we write it ourselves.

export function filterNonNull<T>(array: Array<T | null | undefined>): T[] {
    return array.filter((element) =>
        !(element === null || typeof element === 'undefined')) as T[];
}


export function findRight<T>(array: T[], predicate: (elmt: T) => boolean): T | null {
    for (let i = array.length - 1; i >= 0; i--) {
        if (predicate(array[i])) return array[i];
    }

    return null;
}
