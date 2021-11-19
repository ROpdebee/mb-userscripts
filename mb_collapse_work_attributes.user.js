// ==UserScript==
// @name         MB: Collapse Work Attributes
// @version      2021.11.19
// @description  *DEPRECATED* Collapses work attributes when there are too many. Workaround for MBS-11535/MBS-11537.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_collapse_work_attributes.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_collapse_work_attributes.user.js
// @match        *://*.musicbrainz.org/work/*
// @match        *://*.musicbrainz.org/artist/*/works
// @match        *://*.musicbrainz.org/artist/*/works?*
// @match        *://*.musicbrainz.org/edit/*
// @match        *://*.musicbrainz.org/*/edits*
// @match        *://*.musicbrainz.org/collection/*
// @run-at       document-end
// ==/UserScript==

document.querySelector('#page').insertAdjacentHTML(
    'beforebegin',
    '<div class="banner warning-header"><p>"MB: Collapse Work Attributes" is now deprecated since its functionality has been added to MB, and will no longer receive updates. Please uninstall the userscript to remove this message.</p></div>');
