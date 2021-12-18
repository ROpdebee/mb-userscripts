// ==UserScript==
// @name         MB: Validate Work Codes
// @version      2021.12.18
// @description  Validate work identifier codes: Highlight invalid or ill-formatted work codes.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_validate_work_codes.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_validate_work_codes.user.js
// @match        *://*.musicbrainz.org/work/*
// @match        *://*.musicbrainz.org/artist/*/works
// @match        *://*.musicbrainz.org/artist/*/works?*
// @match        *://*.musicbrainz.org/edit/*
// @match        *://*.musicbrainz.org/*/edits*
// @match        *://*.musicbrainz.org/collection/*
// @exclude      *://*.musicbrainz.org/work/*/edit
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://raw.github.com/ROpdebee/mb-userscripts/main/lib/work_identifiers.js?v=2021.5.27
// @run-at       document-end
// ==/UserScript==

// A bit too similar to mb_collapse_work_attributes to my liking, but eh.

let $ = this.$ = this.jQuery = jQuery.noConflict(true);

const ATTR_TRANSLATIONS = [
    'Attributes',
    'Eigenschaften',
    'Attributs',
    'Attributi',
    'Eigenschappen'];


function highlightElement(el, level, title) {
    let color = level === 'error' ? 'FireBrick' : 'Orange';
    el.style.color = color;
    el.style.fontWeight = 'bold';
    if (title) {
        el.title = title;
        el.style.textDecoration = 'underline dotted 2px';
    }
}

function checkElement(el, code, agencyId) {
    let result = MBWorkIdentifiers.validateCode(code, agencyId);
    if (!result.isValid) {
        highlightElement(el, 'error', result.message);
    } else if (result.wasChanged) {
        highlightElement(el, 'warning', result.formattedCode);
    }
}

function processTabulatedPage() {
    document.querySelectorAll('table.tbl').forEach(processTable);
}

function processTable(table) {
    let columnIdx = 1 + [...table.querySelectorAll('thead th')]
        .findIndex(th => ATTR_TRANSLATIONS.includes(th.innerText));
    let attrLis = table.querySelectorAll('td:nth-child(' + columnIdx + ') li');

    attrLis.forEach(el => {
        let match = /(.+)\s\((.+?)\)/.exec(el.innerText);
        let text, code, agencyId;
        try {
            [text, code, agencyId] = match;
        } catch {
            return;
        }

        checkElement(el, code, agencyId);
    });
}

function processWorkPage() {
    let attrs = $('dl.properties > dd.work-attribute');

    attrs.each((i, el) => {
        let agencyDD = el.previousSibling;
        let agencyId = agencyDD.innerText.slice(0, -1);

        checkElement(el, el.innerText, agencyId);
    });
}

function processEditPage() {
    $('table.details.edit-work, table.details.add-work').each((i, tbl) => {
        let attrRows = $(tbl)
            .find('tr')
            .filter((i, tr) => {
                let attrName = tr.querySelector('th').innerText;
                return attrName.endsWith(' ID:') || attrName === 'PRS tune code:';
            });

        attrRows.each((i, row) => {
            let agencyId = row.querySelector('th').innerText.slice(0, -1);
            row.querySelectorAll('li').forEach(el => {
                checkElement(el, el.innerText, agencyId);
            });
        });
    });

    $('table.details.merge-works').each((i, tbl) => {
        tbl.querySelectorAll('table.tbl').forEach(processTable);
    });
}

if ((location.pathname.startsWith('/artist/') || location.pathname.startsWith('/collection/')) && location.pathname.split('/')[3] !== 'edits') {
    processTabulatedPage();
} else if (location.pathname.startsWith('/work/') && location.pathname.split('/')[3] !== 'edits') {
    processWorkPage();
} else {
    processEditPage();
}
