// ==UserScript==
// @name         MB: Collapse Work Attributes
// @version      2021.3.30
// @description  Collapses work attributes when there are too many. Workaround for MBS-11535/MBS-11537.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_collapse_work_attributes.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_collapse_work_attributes.user.js
// @match        *://*.musicbrainz.org/work/*
// @match        *://musicbrainz.org/work/*
// @match        *://*.musicbrainz.org/artist/*/works
// @match        *://musicbrainz.org/artist/*/works
// @match        *://musicbrainz.org/edit/*
// @match        *://*.musicbrainz.org/edit/*
// @match        *://musicbrainz.org/*/edits*
// @match        *://*.musicbrainz.org/*/edits*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-end
// ==/UserScript==

let $ = this.$ = this.jQuery = jQuery.noConflict(true);

const ATTR_TRANSLATIONS = [
    'Attributes',
    'Eigenschaften',
    'Attributs',
    'Attributi',
    'Eigenschappen'];

CUTOFF = 4; // Consistent with performers on artist page

function setAnchorText($anchor, numHidden, currentlyHidden) {
    if (currentlyHidden) {
        $anchor
            .attr('title', 'Show all attributes')
            .text('(show ' + numHidden + ' more)');
    } else {
        $anchor
            .attr('title', 'Show less attributes')
            .text('(show less)');
    }
}

function createAnchor() {
    return $('<a>')
            .attr('role', 'button')
}

function processArtistPage() {
    let columnIdx = 1 + [...$('table.tbl thead th')]
        .findIndex(th => ATTR_TRANSLATIONS.includes(th.innerText));
    let tooLongAttrColumns = $('table.tbl td:nth-child(8)')
        .filter((i, col) => $(col).find('li').length > 4);

    tooLongAttrColumns.each((i, col) => {
        let $col = $(col);
        let hideLis = $col.find('li:nth-child(n+' + (CUTOFF + 1) + ')');
        let $showAllAnchor = createAnchor();
        let $newLi = $('<li>').addClass('show-all');
        $newLi.append($showAllAnchor);
        $col.find('ul').append($newLi);

        let hidden = false;

        $showAllAnchor.click(() => {
            hideLis.toggle();
            hidden = !hidden;
            setAnchorText($showAllAnchor, hideLis.length, hidden);
        }).trigger('click');
    });
}

function processWorkPage() {
    let tooLongAttrs = $('dl.properties > dd.work-attribute').slice(CUTOFF);
    let $showAllAnchor = createAnchor();
    tooLongAttrs.slice(-1).after($showAllAnchor);
    let hidden = false;

    $showAllAnchor.click(() => {
        tooLongAttrs.toggle();
        tooLongAttrs.prev('dt').toggle();
        hidden = !hidden;
        setAnchorText($showAllAnchor, tooLongAttrs.length, hidden);
    }).trigger('click');
}

function processEditPage() {
    $('table.details.edit-work, table.details.add-work').each((i, tbl) => {
        let tooLongAttrs = $(tbl)
            .find('tr')
            .filter((i, tr) => {
                let attrName = tr.querySelector('th').innerText;
                return attrName.endsWith(' ID:') || attrName === 'PRS tune code:';
            }).slice(CUTOFF);
        let $showAllAnchor = createAnchor();
        let $tr = $('<tr><th></th><td colspan="2"></td></tr>');
        $tr.find('td').append($showAllAnchor);
        tooLongAttrs.slice(-1).after($tr);
        hidden = false;

        $showAllAnchor.click(() => {
            tooLongAttrs.toggle();
            hidden = !hidden;
            setAnchorText($showAllAnchor, tooLongAttrs.length, hidden);
        }).trigger('click');
    });
}

if (location.pathname.startsWith('/artist/') && location.pathname.split('/')[3] !== 'edits') {
    processArtistPage();
} else if (location.pathname.startsWith('/work/') && location.pathname.split('/')[3] !== 'edits') {
    processWorkPage();
} else {
    processEditPage();
}
