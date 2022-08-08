// ==UserScript==
// @name         MB: Enhanced Cover Art Uploads
// @description  Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!
// @version      2022.8.8.3
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_enhanced_cover_art_uploads.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_enhanced_cover_art_uploads.meta.js
// @include      /^https?://(\w+\.)?musicbrainz\.org/release/[a-f\d-]{36}/add-cover-art([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/release/[a-f\d-]{36}/cover-art([?#]|$)/
// @include      /^https?://atisket\.pulsewidth\.org\.uk/.*?\?.+?(#.+?)?$/
// @include      /^https?://etc\.marlonob\.info/atisket\/.*?\?.+?(#.+?)?$/
// @include      /^https?://vgmdb\.net/album\/\d+([?#]|$)/
// @require      https://github.com/qsniyg/maxurl/blob/4b8661ee2d7a856dc6c4a9b910664584b397d45a/userscript.user.js?raw=true
// @resource     amazonFavicon https://www.amazon.com/favicon.ico
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_getResourceURL
// @grant        GM.getResourceUrl
// @grant        GM.getResourceURL
// @connect      *
// ==/UserScript==