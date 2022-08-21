import { validateCode } from './identifiers';

const ATTR_TRANSLATIONS = new Set([
    'Attributes',
    'Eigenschaften',
    'Attributs',
    'Attributi',
    'Eigenschappen',
]);

// FIXME: This is probably broken when attributes are collapsed and expanded.
// Need a mutation observer.

function highlightElement(el: HTMLElement, level: 'error' | 'warning', title?: string): void {
    const color = level === 'error' ? 'FireBrick' : 'Orange';
    el.style.color = color;
    el.style.fontWeight = 'bold';
    if (title) {
        el.title = title;
        el.style.textDecoration = 'underline dotted 2px';
    }
}

function checkElement(el: HTMLElement, code: string, agencyId: string): void {
    const result = validateCode(code, agencyId);
    if (!result.isValid) {
        highlightElement(el, 'error', result.message);
    } else if (result.wasChanged) {
        highlightElement(el, 'warning', result.formattedCode);
    }
}

function processTabulatedPage(): void {
    document.querySelectorAll<HTMLTableElement>('table.tbl').forEach((tbl) => {
        processTable(tbl);
    });
}

function processTable(table: HTMLTableElement): void {
    const columnIdx = 1 + [...table.querySelectorAll('thead th')]
        .findIndex((th) => ATTR_TRANSLATIONS.has(th.textContent!));
    const attrLis = table.querySelectorAll<HTMLLIElement>(`td:nth-child(${columnIdx}) li`);

    attrLis.forEach((el) => {
        const match = /(.+)\s\((.+?)\)/.exec(el.textContent!);
        let code: string, agencyId: string;
        try {
            [, code, agencyId] = match!;
        } catch {
            return;
        }

        checkElement(el, code, agencyId);
    });
}

function processWorkPage(): void {
    const attrs = document.querySelectorAll<HTMLElement>('dl.properties > dd.work-attribute');

    attrs.forEach((el) => {
        const agencyDD = el.previousSibling!;
        const agencyId = agencyDD.textContent!.slice(0, -1);

        checkElement(el, el.textContent!, agencyId);
    });
}

function processEditPage(): void {
    document.querySelectorAll<HTMLTableElement>('table.details.edit-work, table.details.add-work').forEach((tbl) => {
        const attrRows = [...tbl
            .querySelectorAll('tr')]
            .filter((tr) => {
                const attrName = tr.querySelector('th')!.textContent;
                return attrName!.endsWith(' ID:') || attrName === 'PRS tune code:';
            });

        attrRows.forEach((row) => {
            const agencyId = row.querySelector('th')!.textContent!.slice(0, -1);
            row.querySelectorAll('li').forEach((el) => {
                checkElement(el, el.textContent!, agencyId);
            });
        });
    });

    document.querySelectorAll<HTMLTableElement>('table.details.merge-works').forEach((tbl) => {
        tbl.querySelectorAll<HTMLTableElement>('table.tbl').forEach((innerTable) => {
            processTable(innerTable);
        });
    });
}

export function validateCodes(): void {
    // FIXME: These checks probably don't work for all pages.
    if ((document.location.pathname.startsWith('/artist/') || document.location.pathname.startsWith('/collection/')) && document.location.pathname.split('/')[3] !== 'edits') {
        processTabulatedPage();
    } else if (document.location.pathname.startsWith('/work/') && document.location.pathname.split('/')[3] !== 'edits') {
        processWorkPage();
    } else {
        processEditPage();
    }
}
