// ==UserScript==
// @name         MB: Blind Votes
// @version      2021.3.30
// @description  Blinds editor details before your votes are cast.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_blind_votes.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_blind_votes.user.js
// @match        *://musicbrainz.org/*
// @match        *://*.musicbrainz.org/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-body
// ==/UserScript==

let $ = this.$ = this.jQuery = jQuery.noConflict(true);

function setupStyle() {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'ROpdebee_blind_votes';
    document.head.appendChild(style);
    // Names and votes
    style.sheet.insertRule(`
        /* Edit pages */
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
        }`);
    // Profile images
    style.sheet.insertRule(`
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
        }`);
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
})
