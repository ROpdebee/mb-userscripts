/**
 * DOM utilities.
 */

import { assertNonNull } from './assert';

/**
 * Element.querySelector shorthand, query result required to exist.
 *
 * If element is not provided, defaults to document.
 *
 * @param      {string}              query    The query.
 * @param      {(Document|Element)}  element  The root element to search in.
 *                                            Defaults to current root
 *                                            `document` if not provided.
 * @return     {T}                   Result of the query.
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
 *
 * @param      {string}              query    The query.
 * @param      {(Document|Element)}  element  The root element to search in.
 *                                            Defaults to current root
 *                                            `document` if not provided.
 * @return     {(T|null)}            Result of the query, or `null` if it did
 *                                   not return any results.
 */
export function qsMaybe<T extends Element>(query: string, element?: Document | Element): T | null {
    const target = element ?? document;
    return target.querySelector<T>(query);
}

/**
 * Element.querySelectorAll shorthand, with results converted to an array.
 *
 * If element is not provided, defaults to document.
 *
 * @param      {string}              query    The query.
 * @param      {(Document|Element)}  element  The root element to search in.
 *                                            Defaults to current root
 *                                            `document` if not provided.
 * @return     {T[]}                 Array of matching elements.
 */
export function qsa<T extends Element>(query: string, element?: Document | Element): T[] {
    const target = element ?? document;
    return [...target.querySelectorAll<T>(query)];
}

/**
 * Add listener which is called when the document is loaded. If the document is
 * already loaded, will be fired immediately.
 *
 * @param      {()=>void}  listener  The listener.
 */
export function onDocumentLoaded(listener: () => void): void {
    if (document.readyState !== 'loading') {
        listener();
    } else {
        document.addEventListener('DOMContentLoaded', listener);
    }
}

/**
 * Add listener which is called when the window is loaded. If the window is
 * already loaded, will be fired immediately.
 *
 * @param      {()=>void}  listener  The listener.
 */
export function onWindowLoaded(listener: () => void): void {
    if (window.document.readyState === 'complete') {
        listener();
    } else {
        window.addEventListener('load', listener);
    }
}

/**
 * Add listening which is called when the given MusicBrainz "Add Entity" dialog
 * is loaded. If the dialog is already loaded, will be fired immediately.
 *
 * @param      {HTMLIFrameElement}  dialog    The dialog. Must only be called
 *                                            with a MusicBrainz "Add Entity"
 *                                            dialog.
 * @param      {()=>void}           listener  The listener.
 */
export function onAddEntityDialogLoaded(dialog: HTMLIFrameElement, listener: () => void): void {
    // iframe could already have finished loading. We can detect this as the
    // absence of the loading div.
    if (qsMaybe('.content-loading', dialog.parentElement!) === null) {
        listener();
    } else {
        dialog.addEventListener('load', () => { listener(); });
    }
}

/**
 * Parse HTML source into a DOM.
 *
 * @param      {string}    html     The HTML source.
 * @param      {string}    baseUrl  Base URL to use for relative URLs in the
 *                                  HTML source.
 * @return     {Document}  DOM resulting from parsing `html`.
 */
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

/**
 * Set the value of an input element.
 *
 * @see        https://stackoverflow.com/a/46012210
 * Via kellnerd, https://github.com/kellnerd/musicbrainz-bookmarklets/blob/730ed0f96a81ef9bb239ed564f247bd68f84bee3/utils/dom/react.js
 *
 * @param      {HTMLInputElement}  input          The input element.
 * @param      {string}            value          The value to set.
 * @param      {boolean}           dispatchEvent  Whether to dispatch an event
 *                                                after setting the value.
 */
export function setInputValue(input: HTMLInputElement, value: string, dispatchEvent = true): void {
    inputValueDescriptor!.set!.call(input, value);
    if (dispatchEvent) {
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
}
