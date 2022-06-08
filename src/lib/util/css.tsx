import { qsMaybe } from './dom';

import USERSCRIPT_ID from 'consts:userscript-id';

export function insertStylesheet(css: string, elementId?: string): void {
    if (typeof elementId === 'undefined') {
        elementId = `ROpdebee_${USERSCRIPT_ID}_css`;
    }

    // Skip if already inserted by other script
    if (qsMaybe(`style#${elementId}`) !== null) return;

    const cssElement = <style id={elementId}>{css}</style>;
    document.head.insertAdjacentElement('beforeend', cssElement);
}
