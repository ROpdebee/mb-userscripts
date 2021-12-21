// Compatibility wrappers
// istanbul ignore file: Covered by E2E


// Fix GM.Request interface through declaration merging.
declare global {
    namespace GM {
        interface Request {
            responseType?: string;
        }
    }
}

/* eslint-disable no-restricted-globals */

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

/* eslint-enable no-restricted-globals */

/**
 * Clone an object to be usable in the page context (unsafeWindow).
 * If we cannot clone the object, or unsafeWindow doesn't exist, returns the
 * object itself.
 */
export function cloneIntoPageContext<T>(object: T): T {
    if (typeof cloneInto !== 'undefined' && typeof unsafeWindow !== 'undefined') {
        return cloneInto(object, unsafeWindow);
    }
    return object;
}

/**
 * Retrieve an object from the page context's window object. If we're already
 * running in the page context, returns the object from this context's window
 * instead.
 */
export function getFromPageContext<M extends keyof Window>(name: M): Window[M];
export function getFromPageContext<M extends keyof typeof globalThis>(name: M): (typeof globalThis)[M];
export function getFromPageContext<M extends keyof (Window | typeof globalThis)>(name: M): (Window | typeof globalThis)[M] {
    if (typeof unsafeWindow !== 'undefined') {
        return unsafeWindow[name];
    } else {
        return window[name];
    }
}
