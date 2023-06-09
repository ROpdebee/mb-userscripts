import { qsMaybe } from './dom';

import USERSCRIPT_ID from 'consts:userscript-id';

/**
 * Insert CSS stylesheet into the current page.
 *
 * @param      {string}  css        The CSS stylesheet content.
 * @param      {string}  elementId  Unique identifier for the CSS HTML element.
 *                                  Will be generated if not provided.
 */
export function insertStylesheet(css: string, elementId?: string): void {
    if (elementId === undefined) {
        elementId = `ROpdebee_${USERSCRIPT_ID}_css`;
    }

    // Skip if already inserted by other script
    if (qsMaybe(`style#${elementId}`) !== null) return;

    const cssElement = <style id={elementId}>{css}</style>;
    document.head.insertAdjacentElement('beforeend', cssElement);
}
