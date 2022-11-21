// Compatibility wrappers
// istanbul ignore file: Covered by E2E


/* eslint-disable no-restricted-globals */

// Declare v3 GM_* APIs, but not globally.
declare function GM_xmlhttpRequest<T>(details: GM.Request<T>): void;
declare function GM_getResourceURL(resourceName: string): string;
declare const GM_info: typeof GM.info;

function existsInGM(name: string): boolean {
    return typeof GM !== 'undefined' && (GM as Record<string, unknown>)[name] !== undefined;
}

// We need to take care to ensure GM functions are properly bound. I'm not 100%
// sure whether they ever use `this`, but it's better to be careful. However,
// we cannot `.bind()` them, as that breaks the mocking in the tests.

// Cannot use generics here as that doesn't play nicely with the mocks. The
// type declarations for `@types/greasemonkey` don't use generics for this
// function either.
export function GMxmlHttpRequest(details: GM.Request): void {
    if (existsInGM('xmlHttpRequest')) {
        GM.xmlHttpRequest(details);
    } else {
        GM_xmlhttpRequest(details);
    }
}

export function GMgetResourceUrl(resourceName: string): Promise<string> {
    if (existsInGM('getResourceUrl')) {
        return GM.getResourceUrl(resourceName);
    } else if (existsInGM('getResourceURL')) {
        // @ts-expect-error Violentmonkey alternative spelling.
        // We cannot add a declaration for it, because it would either need to
        // be globally available in the namespace, or our local declarations
        // would replace `GM` for the rest of this file.
        return (GM.getResourceURL as typeof GM.getResourceUrl)(resourceName);
    } else {
        // eslint-disable-next-line sonarjs/no-use-of-empty-return-value -- False positive.
        return Promise.resolve(GM_getResourceURL(resourceName));
    }
}

export const GMinfo = existsInGM('info') ? GM.info : GM_info;

/* eslint-enable no-restricted-globals */

interface CloneIntoOptions {
    /**
     * A Boolean value that determines if functions should be cloned. If
     * omitted the default value is false. Cloned functions have the same
     * semantics as functions exported using `Components.utils.exportFunction`.
     */
    cloneFunctions: boolean;
    /**
     * A Boolean value that determines if objects reflected from C++, such as
     * DOM objects, should be cloned. If omitted the default value is false.
     */
    wrapReflectors: boolean;
}

// Declare the missing `cloneInto` function.
/**
 * This function provides a safe way to take an object defined in a privileged
 * scope and create a structured clone of it in a less-privileged scope. It
 * returns a reference to the clone:
 * ```javascript
 * var clonedObject = cloneInto(myObject, targetWindow);
 * ```
 *
 * You can then assign the clone to an object in the target scope as an expando
 * property, and scripts running in that scope can access it:
 * ```javascript
 * targetWindow.foo = clonedObject;
 * ```
 * In this way privileged code, such as an add-on, can share an object with
 * less-privileged code like a normal web page script.
 * @param {T} obj   The object to clone.
 * @param {object} targetScope   The object to attach the object to.
 * @param {CloneIntoOptions | undefined } options   Options
 * @returns {T} A reference to the cloned object.
 */
declare function cloneInto<T>(obj: T, targetScope: Window, options?: CloneIntoOptions): T;

/**
 * Clone an object to be usable in the page context (`unsafeWindow`).
 * If we cannot clone the object, or `unsafeWindow` doesn't exist, returns the
 * object itself.
 */
export function cloneIntoPageContext<T>(object: T): T {
    // eslint-disable-next-line unicorn/no-typeof-undefined
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window)[name];
}
