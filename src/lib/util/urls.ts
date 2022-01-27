import { assert } from './assert';

export function urlBasename(url: string | URL, defaultBasename = ''): string {
    if (typeof url !== 'string') url = url.pathname;
    // We don't need nullish coalescing here, since the array will always have
    // at least one element, but the last element may be the empty string.
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return url.split('/').pop() || defaultBasename;
}

export function urlJoin(base: string | URL, ...subPaths: string[]): URL {
    assert(subPaths.length >= 1);
    let newUrl = new URL(subPaths[0], base);
    for (const nextSub of subPaths.slice(1)) {
        newUrl = new URL(nextSub, newUrl);
    }
    return newUrl;
}
