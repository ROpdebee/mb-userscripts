/**
 * Utilities for URLs.
 */

/**
 * Extract the basename from a URL's path.
 *
 * @example
 * urlBasename('https://example/some/path?x=123') // => "some"
 *
 * @param      {(URL|string)}  url              The URL.
 * @param      {string}        defaultBasename  Value to fall back to if
 *                                              basename cannot be determined.
 * @return     {string}        Basename of the URL's path.
 */
export function urlBasename(url: string | URL, defaultBasename = ''): string {
    if (typeof url !== 'string') url = url.pathname;
    // We don't need nullish coalescing here, since the array will always have
    // at least one element, but the last element may be the empty string.
    return url.split('/').pop()! || defaultBasename;
}

/**
 * Join URL path parts.
 *
 * @param      {(URL|string)}  base      The base URL
 * @param      {string[]}      subPaths  The sub paths for the new URL.
 * @return     {URL}           URL obtained by joining `subPaths` into the path
 *                             of `base`.
 */
export function urlJoin(base: string | URL, ...subPaths: string[]): URL {
    let newUrl = new URL(base);
    for (const subPath of subPaths) {
        newUrl = new URL(subPath, newUrl);
    }
    return newUrl;
}
