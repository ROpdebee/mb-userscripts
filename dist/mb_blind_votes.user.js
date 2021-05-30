// ==UserScript==
// @name         MB: Blind votes
// @description  Blinds editor details before your votes are cast.
// @version      2021.3.30
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/dist/mb_blind_votes.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/dist/mb_blind_votes.meta.js
// @match        http*://musicbrainz.org/*
// @match        http*://*.musicbrainz.org/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-body
// @grant        none
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/mb_blind_votes/style.js
const style1 = `/* Edit pages */
        div#content:not(.unblind) div.edit-header > p.subheader > a, /* Editor */
        div#content:not(.unblind) table.vote-tally tr:nth-child(n+3), /* Vote */
        div#content:not(.unblind) table.vote-tally tr:nth-child(n+3) a, /* Voter */
        div#content:not(.unblind) table.vote-tally tr:nth-child(1) td, /* Vote tally */
        div#content:not(.unblind) div.edit-notes h3 > a:not(.date), /* Edit note author */

        /* Edit lists */
        div.edit-list:not(.unblind) div.edit-header > p.subheader > a, /* Editor */
        div.edit-list:not(.unblind) div.edit-notes h3 > a:not(.date) /* Edit note author */
        {
            color: black;
            background-color: black;
        }`;

const style2 = `
        /* Edit pages */
        div#content:not(.unblind) div.edit-header > p.subheader > a > img, /* Editor */
        div#content:not(.unblind) table.vote-tally th > a > img, /* Voter */
        div#content:not(.unblind) div.edit-notes h3 > a:not(.date) > img, /* Edit note author */
        div#content:not(.unblind) div.edit-notes h3 > div.voting-icon, /* Vote icon */

        /* Edit lists */
        div.edit-list:not(.unblind) div.edit-header > p.subheader > a > img, /* Editor */
        div.edit-list:not(.unblind) div.edit-notes h3 > a:not(.date) > img, /* Edit note author */
        div.edit-list:not(.unblind) div.edit-notes h3 > div.voting-icon /* Vote icon */
        {
            display: none;
        }`;

;// CONCATENATED MODULE: ./src/mb_blind_votes/index.js


let $ = undefined.$ = undefined.jQuery = jQuery.noConflict(true);

function setupStyle() {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'ROpdebee_blind_votes';
    document.head.appendChild(style);
    // Names and votes
    style.sheet.insertRule(style1);
    // Profile images
    style.sheet.insertRule(style2);
}

function setupUnblindListeners() {
    $('input[name^="enter-vote.vote"]:not([id$="-None"])').change((evt) => {
        let $target = $(evt.currentTarget);
        $target
            .closest('div.edit-list')
            .addClass('unblind');
        // Make sure we also add .unblind to the content div on edit lists
        // otherwise the CSS rules for the edit page still apply.
        $target
            .closest('div#content')
            .addClass('unblind');
    });
    $('input[name^="enter-vote.vote"][id$="-None"]').change((evt) => {
        $(evt.currentTarget)
            .closest('div.edit-list, div#content')
            .removeClass('unblind');
    });
}

setupStyle();
setupUnblindListeners();
// Unblind any edits that aren't open, are your own, or on which you already voted
$(document).ready(() => {
    setupUnblindListeners();
    let $unblindEdits = $(`
        div.edit-header:not(.open),
        div.cancel-edit > a.negative[href*="/cancel"],
        input[name^="enter-vote.vote"]:checked:not([id$="-None"])`);
    $unblindEdits
        .closest('div.edit-list')
        .addClass('unblind');
    $unblindEdits
        .closest('div#content')
        .addClass('unblind');
});

/******/ })()
;
