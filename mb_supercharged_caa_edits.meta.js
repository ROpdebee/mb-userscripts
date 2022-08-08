// ==UserScript==
// @name         MB: Supercharged Cover Art Edits
// @description  Supercharges reviewing cover art edits. Displays release information on CAA edits. Enables image comparisons on removed and added images.
// @version      2022.8.8
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_supercharged_caa_edits.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_supercharged_caa_edits.meta.js
// @include      /^https?://(\w+\.)?musicbrainz\.org/edit/\d+([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/edit/(open|subscribed(_editors)?)([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/(area|artist|collection|event|instrument|label|place|recording|release|release-group|series|work|url)/[a-f\d-]{36}/(open_)?edits([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/user/[^/]+/edits(/\w+)?([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/user/[^/]+/votes([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/search/edits\?.+?(#.+?)?$/
// @require      https://cdn.jsdelivr.net/npm/resemblejs@4.1.0/resemble.min.js
// @require      https://cdn.jsdelivr.net/npm/moment@2.29.3/min/moment-with-locales.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery-ui-dist@1.13.1/jquery-ui.min.js
// @run-at       document-end
// @grant        none
// ==/UserScript==