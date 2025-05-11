/**
 * DOM utilities.
 */

import { assertNonNull } from './assert';

/**
 * Element.querySelector shorthand, query result required to exist.
 *
 * If element is not provided, defaults to document.
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
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
// TODO: Need to perform an actual type check instead of just using useless type parameter.
// https://effectivetypescript.com/2020/07/27/safe-queryselector/
// Although really, the entire API should probably be adjusted.
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
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

export function onWindowLoaded(listener: () => void): void {
    if (window.document.readyState === 'complete') {
        listener();
    } else {
        window.addEventListener('load', listener);
    }
}

export function onAddEntityDialogLoaded(dialog: HTMLIFrameElement, listener: () => void): void {
    // iframe could already have finished loading. We can detect this as the
    // absence of the loading div.
    if (qsMaybe('.content-loading', dialog.parentElement!) === null) {
        listener();
    } else {
        dialog.addEventListener('load', () => {
            listener();
        });
    }
}

export function parseDOM(html: string, baseUrl: string): Document {
    const document_ = new DOMParser().parseFromString(html, 'text/html');

    // We need to set the base URL in the <head> element to properly resolve
    // relative links. If we don't, it'll resolve the hrefs relative to the
    // page on which the document is parsed, which is not always what we want.
    if (!qsMaybe('base', document_.head)) {
        const baseElement = document_.createElement('base');
        baseElement.href = baseUrl;
        document_.head.insertAdjacentElement('beforeend', baseElement);
    }

    return document_;
}

const inputValueDescriptor = /* #__PURE__ */ Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

// https://stackoverflow.com/a/46012210
// Via kellnerd, https://github.com/kellnerd/musicbrainz-bookmarklets/blob/730ed0f96a81ef9bb239ed564f247bd68f84bee3/utils/dom/react.js
export function setInputValue(input: HTMLInputElement, value: string, dispatchEvent = true): void {
    inputValueDescriptor!.set!.call(input, value);
    if (dispatchEvent) {
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
}
