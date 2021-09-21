// ==UserScript==
// @name         MB: Upload to CAA From URL
// @description  Upload covers to the CAA by pasting a URL! Workaround for MBS-4641.
// @version      2021.9.21
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/dist/mb_upload_to_caa_from_url.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/dist/mb_upload_to_caa_from_url.meta.js
// @match        *://*.musicbrainz.org/release/*/add-cover-art
// @match        *://atisket.pulsewidth.org.uk/*
// @exclude      *://atisket.pulsewidth.org.uk/
// @require      https://github.com/qsniyg/maxurl/blob/master/userscript.user.js?raw=true
// @run-at       document-load
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @connect      *
// ==/UserScript==