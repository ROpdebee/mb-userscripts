// Compatibility wrappers
/* eslint-disable no-restricted-globals */
// istanbul ignore file: Covered by E2E

function existsInGM(name: string): boolean {
    return typeof GM !== 'undefined' && typeof (GM as Record<string, unknown>)[name] !== 'undefined';
}

function promisify<T extends unknown[], R>(f: (...args: T) => R): (...args: T) => Promise<R> {
    return function(...args: T): Promise<R> {
        return Promise.resolve(f(...args));
    };
}

export const GMxmlHttpRequest: typeof GM.xmlHttpRequest = existsInGM('xmlHttpRequest')
    ? GM.xmlHttpRequest
    // @ts-expect-error Old API.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    : promisify(GM_xmlhttpRequest);

export const GMgetResourceUrl: typeof GM.getResourceUrl = existsInGM('getResourceUrl')
    ? GM.getResourceUrl
    // This is called GM.getResourceURL in Violentmonkey.
    : (existsInGM('getResourceURL')
        // @ts-expect-error Violentmonkey alternative spelling.
        ? GM.getResourceURL
        // @ts-expect-error Old API.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        : promisify(GM_getResourceURL));

export const GMinfo: typeof GM.info = existsInGM('info')
    ? GM.info
    // @ts-expect-error Old API.
    : GM_info;
