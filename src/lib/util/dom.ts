/**
 * DOM utilities.
 */

import { assertNonNull } from './assert';

/**
 * Element.querySelector shorthand, query result required to exist.
 *
 * If element is not provided, defaults to document.
 */
export function qs<T extends Element>(query: string, element?: Document | Element): T {
    const queryResult = qsMaybe<T>(query, element);
    assertNonNull(queryResult, 'Could not find required element');
    return queryResult;
}

/**
 * Element.querySelector shorthand, query result may be null.
 *
 * If element is not provided, defaults to document.
 */
export function qsMaybe<T extends Element>(query: string, element?: Document | Element): T | null {
    const target = element ?? document;
    return target.querySelector<T>(query);
}

/**
 * Element.querySelectorAll shorthand, with results converted to an array.
 *
 * If element is not provided, defaults to document.
 */
export function qsa<T extends Element>(query: string, element?: Document | Element): T[] {
    const target = element ?? document;
    return [...target.querySelectorAll<T>(query)];
}

/**
 * Add listener which is called when the document is loaded. If the document
 * is already loaded, will be fired immediately.
 */
export function onDocumentLoaded(listener: () => void): void {
    if (document.readyState !== 'loading') {
        listener();
    } else {
        document.addEventListener('DOMContentLoaded', listener);
    }
}

export function parseDOM(html: string, baseUrl: string): Document {
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // We need to set the base URL in the <head> element to properly resolve
    // relative links. If we don't, it'll resolve the hrefs relative to the
    // page on which the document is parsed, which is not always what we want.
    if (!qsMaybe('base', doc.head)) {
        const baseElem = doc.createElement('base');
        baseElem.href = baseUrl;
        doc.head.insertAdjacentElement('beforeend', baseElem);
    }

    return doc;
}
