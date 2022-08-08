// ==UserScript==
// @name         MB: Display CAA image dimensions
// @description  Displays the dimensions and size of images in the cover art archive.
// @version      2022.8.8
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_caa_dimensions.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_caa_dimensions.meta.js
// @include      /^https?://(\w+\.)?musicbrainz\.org/edit/\d+([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/edit/(open|subscribed(_editors)?)([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/(area|artist|collection|event|instrument|label|place|recording|release|release-group|series|work|url)/[a-f\d-]{36}/(open_)?edits([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/user/[^/]+/edits(/\w+)?([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/user/[^/]+/votes([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/search/edits\?.+?(#.+?)?$/
// @include      /^https?://(\w+\.)?musicbrainz\.org/release(-group)?/[a-f\d-]{36}(/.+?)?([?#]|$)/
// @exclude      /^https?://(\w+\.)?musicbrainz\.org/release(-group)?/[a-f\d-]{36}/edit([?#]|$)/
// @exclude      /^https?://(\w+\.)?musicbrainz\.org/release-group/[a-f\d-]{36}/edit-relationships([?#]|$)/
// @run-at       document-start
// @grant        none
// ==/UserScript==