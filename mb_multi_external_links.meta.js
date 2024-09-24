// ==UserScript==
// @name         MB: QoL: Paste multiple external links at once
// @description  Enables pasting multiple links, separated by whitespace, into the external link editor.
// @version      2024.9.24
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_multi_external_links.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_multi_external_links.meta.js
// @match        *://*.musicbrainz.org/*/edit
// @match        *://*.musicbrainz.org/*/edit?*
// @match        *://*.musicbrainz.org/release/*/edit-relationships*
// @match        *://*.musicbrainz.org/*/add
// @match        *://*.musicbrainz.org/*/add?*
// @match        *://*.musicbrainz.org/*/create
// @match        *://*.musicbrainz.org/*/create?*
// @run-at       document-end
// @grant        none
// ==/UserScript==