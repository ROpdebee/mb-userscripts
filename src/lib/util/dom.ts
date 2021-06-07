/**
 * DOM utilities.
 */

import { assertNonNull } from "./assert";

/**
 * Element.querySelector shorthand, query result required to exist.
 *
 * If element is not provided, defaults to document.
 */
export function qs<T extends Element>(query: string, element?: Element): T {
    const queryResult = qsMaybe<T>(query, element);
    assertNonNull(queryResult, 'Could not find required element');
    return queryResult;
}

/**
 * Element.querySelector shorthand, query result may be null.
 *
 * If element is not provided, defaults to document.
 */
export function qsMaybe<T extends Element>(query: string, element?: Element): T | null {
    const target = element ?? document;
    return target.querySelector<T>(query);
}

/**
 * Element.querySelectorAll shorthand, with results converted to an array.
 *
 * If element is not provided, defaults to document.
 */
export function qsa<T extends Element>(query: string, element?: Element): T[] {
    const target = element ?? document;
    return [...target.querySelectorAll<T>(query)];
}

/**
 * Add listener which is called when the document is loaded. If the document
 * is already loaded, will be fired immediately.
 */
export function onDocumentLoaded(listener: () => void): void {
    if (document.readyState === 'complete') {
        listener();
    } else {
        document.addEventListener('DOMContentLoaded', listener);
    }
}
