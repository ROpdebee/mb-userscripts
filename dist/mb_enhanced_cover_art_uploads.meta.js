// ==UserScript==
// @name         MB: Enhanced Cover Art Uploads
// @description  Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!
// @version      2021.9.21
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/dist/mb_enhanced_cover_art_uploads.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/dist/mb_enhanced_cover_art_uploads.meta.js
// @match        *://*.musicbrainz.org/release/*/add-cover-art
// @match        *://atisket.pulsewidth.org.uk/*
// @exclude      *://atisket.pulsewidth.org.uk/
// @require      https://github.com/qsniyg/maxurl/blob/master/userscript.user.js?raw=true
// @run-at       document-load
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @connect      *
// ==/UserScript==