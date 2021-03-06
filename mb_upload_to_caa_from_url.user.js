// ==UserScript==
// @name         MB: Upload to CAA From URL
// @version      2021.6.14
// @description  Upload covers to the CAA by pasting a URL! Workaround for MBS-4641.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_upload_to_caa_from_url.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_upload_to_caa_from_url.user.js
// @match        *://musicbrainz.org/release/*/add-cover-art
// @match        *://*.musicbrainz.org/release/*/add-cover-art
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

// NOTE: It's imperative not to use a custom jQuery instance here, and reuse
// MB's jQuery. Otherwise, we may not be able to trigger the necessary event
// handlers, and thus not be able to inject the images into the upload queue.

// Convert a URL to a File by downloading and wrapping the blob
async function urlToFile(url, fileName) {
    return new Promise((resolve, reject) =>
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: (resp) => {
                if (resp.status !== 200) {
                    return reject(`${resp.status}: ${resp.statusText} on ${url}`);
                }

                // Get the file MIME type from MB's built-in validation
                const rawFile = new File([resp.response], fileName);
                MB.CoverArt.validate_file(rawFile)
                    .fail(reject)
                    .done(mimeType =>
                        resolve(new File([resp.response], `${fileName}.${mimeType.split('/')[1]}`, {type: mimeType})));
            },
            onerror: (err) => reject(`An error occurred while loading ${url}`)
        }));
}

// Add the image at the URL to the upload queue
async function addImage($urlInput, log) {
    const inputVal = $urlInput.val();
    const url = inputVal.trim();
    const pathParts = url.split('/');
    const fileName = pathParts[pathParts.length - 1] || 'image';

    let file;
    try {
        log(`Loading ${fileName}…`);
        file = await urlToFile(url, fileName);
    } catch (exc) {
        log(exc);
        return;
    }

    // Create a fake event to trigger the drop event on the drag'n'drop element
    const fakeEvent = $.Event('drop');
    fakeEvent.originalEvent = {
        dataTransfer: {
            files: [file]
        }
    };

    // If we don't reuse MB's jQuery here, we won't be able to trigger the
    // event handler, perhaps because of browser security.
    $('#drop-zone').trigger(fakeEvent);

    // Clear the old input, but only if it hasn't changed since. Because this
    // is asynchronous code, it's entirely possible for another image to be
    // loading at the same time
    if ($urlInput.val() === inputVal) {
        $urlInput.val('');
    }

    if (!url.startsWith('data:')) {
        addToEditNote(url);
    }
    log(`Successfully loaded ${fileName} as ${file.type}`);
}

function addToEditNote(msg) {
    const $editNote = $('[name="add-cover-art.edit_note"]');
    $editNote.val($editNote.val() + '\n' + msg);
}

let EDIT_NOTE_FILLED = false;
function setupPage() {
    const $div = $('<div style="display: inline-block; margin-left: 32px; vertical-align: middle;">');
    const $input = $('<input type="text" id="ROpdebee_paste_url" placeholder="or paste a URL here" size=47 />');
    const $status = $('<span style="display:block;" id="ROpdebee_paste_url_status" />');

    $('#ROpdebee_paste_url_status').hide();
    $div.append($input);
    $div.append($status);
    $('#drop-zone').after($div);

    $input.on('input', () => {
        if (!$input.val().trim()) {
            $status.text('').hide();
            return;
        }

        addImage($input, (msg) => $status.text(msg));
        $status.show();
        if (!EDIT_NOTE_FILLED) {
            addToEditNote(`–\n${GM_info.script.name} ${GM_info.script.version}`);
            EDIT_NOTE_FILLED = true;
        }
    });
}

setupPage();
