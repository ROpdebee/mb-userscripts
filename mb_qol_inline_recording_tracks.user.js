// ==UserScript==
// @name         MB: QoL: Inline all recording's tracks on releases
// @version      2021.12.18
// @description  Display all tracks and releases on which a recording appears from the release page.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_qol_inline_recording_tracks.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_qol_inline_recording_tracks.user.js
// @match        *://*.musicbrainz.org/release/*
// @exclude      *://*.musicbrainz.org/release/add
// @exclude      *://*.musicbrainz.org/release/*/edit*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-end
// @grant        none
// ==/UserScript==

let $ = this.$ = this.jQuery = jQuery.noConflict(true);

function splitChunks(arr, chunkSize) {
    let chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        chunks.push(arr.slice(i, i + chunkSize));
    }

    return chunks;
}

const queuedFetch = (() => {
    let fetchQueue = [];

    // This may make multiple concurrent requests if an old one is still pending
    // while the new one is queued.
    setInterval(async () => {
        let url, resolve;
        try {
            [url, resolve] = fetchQueue.shift();
        } catch {
            return;
        }

        try {
            let resp = await fetch(url);
            if (!resp.ok) fetchQueue.push([url, resolve]);
            else resolve(resp);
        } catch {
            fetchQueue.push([url, resolve]);
        }
    }, 500);

    return function(url) {
        return new Promise((resolve, reject) => fetchQueue.push([url, resolve]));
    }
})();

async function loadRecordingInfo(rids) {
    const query = rids.map((rid) => 'rid:' + rid).join(' OR ');
    const url = location.origin + '/ws/2/recording?fmt=json&query=' + query;
    let resp = await (await queuedFetch(url)).json();

    let perRecId = {};
    resp.recordings.forEach((rec) => perRecId[rec.id] = rec);
    return perRecId;
}

function getTrackIndex(track, mediumPosition) {
    return `<a href="/track/${track.id}">#${mediumPosition}.${track.number}</a>`;
}

function getTrackIndices(media) {
    return media.flatMap((medium) =>
            medium.track.map((track) => getTrackIndex(track, medium.position)))
        .join(', ');
}

function getReleaseName(release) {
    return `<a href="/release/${release.id}">${release.title}</a>`;
}

function formatRow(release) {
    return `${getReleaseName(release)} (${getTrackIndices(release.media)})`;
}

function insertRows(recordingTd, recordingInfo) {
    let rowElements = recordingInfo.releases
        .map(formatRow)
        .map(row => '<dl class="ars"><dt>appears on:</dt><dd>' + row + '</dd></dl>')
        .join('\n');
    $(recordingTd).find('div.ars:first')
        .before('<div class="ars ROpdebee_inline_tracks">' + rowElements + '</div>');
}

function loadAndInsert() {
    let recAnchors = $('table.medium td > a[href^="/recording/"]:first-child, table.medium td > span:first-child > a[href^="/recording/"]:first-child');
    let todo = [...recAnchors]
        .map((a) => [a.closest('td'), a.href.split('/recording/')[1]])
        .filter(([td, recId]) => !td.querySelector('div.ars.ROpdebee_inline_tracks'));
    let chunks = splitChunks(todo, 20);

    chunks.forEach(async (chunk) => {
        let recInfo = await loadRecordingInfo(chunk.map(([td, recId]) => recId));
        chunk.forEach(([td, recId]) => insertRows(td, recInfo[recId]));
    });
}

$(document).ready(() => {
    $('span#medium-toolbox').prepend('<button id="ROpdebee_display_inline_tracks" class="btn-link" type="button">Display track info for recordings</button> | ')
    $('#ROpdebee_display_inline_tracks').click(loadAndInsert);
});
