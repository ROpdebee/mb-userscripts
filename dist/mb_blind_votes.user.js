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

(function () {
  'use strict';

  /* global jQuery */
  var $ = jQuery.noConflict(true);

  function setupStyle() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'ROpdebee_blind_votes';
    document.head.appendChild(style); // Names and votes

    style.sheet.insertRule("/* Edit pages */\n        div#content:not(.unblind) div.edit-header > p.subheader > a, /* Editor */\n        div#content:not(.unblind) table.vote-tally tr:nth-child(n+3), /* Vote */\n        div#content:not(.unblind) table.vote-tally tr:nth-child(n+3) a, /* Voter */\n        div#content:not(.unblind) table.vote-tally tr:nth-child(1) td, /* Vote tally */\n        div#content:not(.unblind) div.edit-notes h3 > a:not(.date), /* Edit note author */\n\n        /* Edit lists */\n        div.edit-list:not(.unblind) div.edit-header > p.subheader > a, /* Editor */\n        div.edit-list:not(.unblind) div.edit-notes h3 > a:not(.date) /* Edit note author */\n        {\n            color: black;\n            background-color: black;\n        }"); // Profile images

    style.sheet.insertRule("\n        /* Edit pages */\n        div#content:not(.unblind) div.edit-header > p.subheader > a > img, /* Editor */\n        div#content:not(.unblind) table.vote-tally th > a > img, /* Voter */\n        div#content:not(.unblind) div.edit-notes h3 > a:not(.date) > img, /* Edit note author */\n        div#content:not(.unblind) div.edit-notes h3 > div.voting-icon, /* Vote icon */\n\n        /* Edit lists */\n        div.edit-list:not(.unblind) div.edit-header > p.subheader > a > img, /* Editor */\n        div.edit-list:not(.unblind) div.edit-notes h3 > a:not(.date) > img, /* Edit note author */\n        div.edit-list:not(.unblind) div.edit-notes h3 > div.voting-icon /* Vote icon */\n        {\n            display: none;\n        }");
  }

  function setupUnblindListeners() {
    $('input[name^="enter-vote.vote"]:not([id$="-None"])').change(function (evt) {
      var $target = $(evt.currentTarget);
      $target.closest('div.edit-list').addClass('unblind'); // Make sure we also add .unblind to the content div on edit lists
      // otherwise the CSS rules for the edit page still apply.

      $target.closest('div#content').addClass('unblind');
    });
    $('input[name^="enter-vote.vote"][id$="-None"]').change(function (evt) {
      $(evt.currentTarget).closest('div.edit-list, div#content').removeClass('unblind');
    });
  }

  setupStyle();
  setupUnblindListeners(); // Unblind any edits that aren't open, are your own, or on which you already voted

  $(document).ready(function () {
    setupUnblindListeners();
    var $unblindEdits = $("\n        div.edit-header:not(.open),\n        div.cancel-edit > a.negative[href*=\"/cancel\"],\n        input[name^=\"enter-vote.vote\"]:checked:not([id$=\"-None\"])");
    $unblindEdits.closest('div.edit-list').addClass('unblind');
    $unblindEdits.closest('div#content').addClass('unblind');
  });

}());
