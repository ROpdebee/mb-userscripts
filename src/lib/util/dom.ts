/**
 * DOM utilities.
 */

import { assertDefined, assertNonNull } from './assert';

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

// https://github.com/facebook/react/issues/10135#issuecomment-401496776
// Via loujine's wikidata script.
export function setInputValue(input: HTMLInputElement, value: string): void {
    /* eslint-disable @typescript-eslint/unbound-method -- Will bind later. */
    const valueSetter = Object.getOwnPropertyDescriptor(input, 'value')?.set;
    const prototype = Object.getPrototypeOf(input) as typeof HTMLInputElement.prototype;
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    /* eslint-enable @typescript-eslint/unbound-method */

    if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(input, value);
    } else {
        assertDefined(valueSetter, 'Element has no value setter');
        valueSetter.call(input, value);
    }
}
