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

export function onWindowLoaded(listener: () => void, windowInstance: Window = window): void {
    if (windowInstance.document.readyState === 'complete') {
        listener();
    } else {
        windowInstance.addEventListener('load', listener);
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

const inputValueDescriptor = /*#__PURE__*/ Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

// https://stackoverflow.com/a/46012210
// Via kellnerd, https://github.com/kellnerd/musicbrainz-bookmarklets/blob/730ed0f96a81ef9bb239ed564f247bd68f84bee3/utils/dom/react.js
export function setInputValue(input: HTMLInputElement, value: string, dispatchEvent = true): void {
    inputValueDescriptor!.set!.call(input, value);
    if (dispatchEvent) {
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

/**
 * Notify when a given element has finished React hydration.
 *
 * If the element was already hydrated, it will run the callback immediately.
 *
 * @param      {HTMLElement}  element   The element. Must be a React root that
 *                                      gets hydrated.
 * @param      {() => void}   callback  The callback.
 */
export function onReactHydrated(element: HTMLElement, callback: () => void): void {
    // MBS will fire a custom `mb-hydration` event whenever a React component gets
    // hydrated. We need to wait for hydration to complete before modifying the
    // component, React gets mad otherwise. However, it is possible that hydration
    // has already occurred, in which case a `_reactListening` attribute with a
    // random suffix will be added to the element.
    const alreadyHydrated = element.getAttributeNames()
        .some((attrName) => attrName.startsWith('_reactListening') && element.getAttribute(attrName));

    if (alreadyHydrated) {
        callback();
    } else if (window.__MB__?.DBDefs.GIT_BRANCH === 'production' && window.__MB__.DBDefs.GIT_SHA === '923237cf73') {
        // Current production version does not have this custom event yet.
        // TODO: Remove this when prod is updated.
        window.addEventListener('load', callback);
    } else {
        element.addEventListener('mb-hydration', callback);
    }
}
