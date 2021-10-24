// ==UserScript==
// @name         MB: QoL: Select All Update Recordings
// @version      2021.10.24
// @description  Add buttons to release editor to select all "Update recordings" checkboxes.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_qol_select_all_update_recordings.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_qol_select_all_update_recordings.user.js
// @match        *://*.musicbrainz.org/release/*/edit
// @match        *://*.musicbrainz.org/release/add
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
// @grant        none
// ==/UserScript==

let $ = this.$ = this.jQuery = jQuery.noConflict(true);

function changeToTargetState($checkbox, targetState) {
    if ($checkbox.prop('checked') != targetState) {
        $checkbox.click();
    }
}

function addButtons(pElement, classSelector) {
    let $selectAll = $('<button type="button" class="ROpdebee_select_all">Select all</button>')
        .prop('targetCheckedState', true);
    let $toggleAll = $('<button type="button" class="ROpdebee_select_all">Toggle all</button>');

    $toggleAll.click(() => {
        $(classSelector).click();  // Use a click event so that the release editor gets notified
    });

    $selectAll.click(() => {
        let shouldBeChecked = $selectAll.prop('targetCheckedState');
        $(classSelector).each((i, el) => {
            changeToTargetState($(el), shouldBeChecked);
        });

        if (shouldBeChecked) {
            $selectAll.text('Deselect all');
        } else {
            $selectAll.text('Select all');
        }

        $selectAll.prop('targetCheckedState', !shouldBeChecked);
    });

    $(pElement).append($selectAll);
    $(pElement).append($toggleAll);
}

function addButtonsOnLoad() {
    if ($('button.ROpdebee_select_all').length) return;

    let pElements = $('#recordings > .changes > fieldset > p');

    if (pElements.length) {
        addButtons(pElements[2], '.update-recording-title');
        addButtons(pElements[3], '.update-recording-artist');
    }
}

// Try to add the buttons periodically. If they already exist, the function
// will do nothing. Note that we're not clearing the interval since React may
// remove the element in which the buttons exist, causing us to have to re-add
// them later.
setInterval(addButtonsOnLoad, 500);
