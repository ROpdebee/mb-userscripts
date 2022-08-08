// ==UserScript==
// @name         MB: Work code toolbox
// @description  Copy work identifiers from various online repertoires and paste them into MB works with ease. Validate work code formatting: Highlight invalid or ill-formatted codes.
// @version      2022.8.8
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_work_code_toolbox.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_work_code_toolbox.meta.js
// @include      /^https?://(\w+\.)?musicbrainz\.org/(area|artist|collection|event|instrument|label|place|recording|release|release-group|series|work|url)/(create|[a-f\d-]{36}/edit)([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/release/[a-f\d-]{36}/edit-relationships([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/edit/\d+([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/edit/(open|subscribed(_editors)?)([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/(area|artist|collection|event|instrument|label|place|recording|release|release-group|series|work|url)/[a-f\d-]{36}/(open_)?edits([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/user/[^/]+/edits(/\w+)?([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/user/[^/]+/votes([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/search/edits\?.+?(#.+?)?$/
// @include      /^https?://(\w+\.)?musicbrainz\.org/work/[a-f\d-]{36}/.+([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/collection/[a-f\d-]{36}([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/artist/[a-f\d-]{36}/works([?#]|$)/
// @include      /^https?://online\.gema\.de/werke\/search\.faces([?#]|$)/
// @include      /^https?://iswcnet\.cisac\.org/.*([?#]|$)/
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// ==/UserScript==