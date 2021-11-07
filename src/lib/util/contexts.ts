/**
 * Clone an object to be usable in the page context (unsafeWindow).
 * If we cannot clone the object, or unsafeWindow doesn't exist, returns the
 * object itself.
 */
export function cloneIntoPageContext<T>(object: T): T {
    // istanbul ignore next: Covered by E2E
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
export function getFromPageContext<M extends keyof Window>(name: M): Window[M] {
    // istanbul ignore if: Covered by E2E
    if (typeof unsafeWindow !== 'undefined') {
        return unsafeWindow[name];
    } else {
        return window[name];
    }
}
