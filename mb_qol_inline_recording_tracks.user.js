// ==UserScript==
// @name         MB: QoL: Inline all recording's tracks on releases
// @version      2024.5.1
// @description  Display all tracks and releases on which a recording appears from the release page.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_qol_inline_recording_tracks.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_qol_inline_recording_tracks.user.js
// @match        *://*.musicbrainz.org/release/*
// @exclude      *://*.musicbrainz.org/release/add
// @exclude      *://*.musicbrainz.org/release/*/edit*
// @run-at       document-end
// @grant        none
// ==/UserScript==

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
    // FIXME: This runs continuously even though no fetches are queued.
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
        return new Promise((resolve) => fetchQueue.push([url, resolve]));
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
    rowElements = '<div class="ars ROpdebee_inline_tracks">' + rowElements + '</div>';
    let existingArs = recordingTd.querySelector('div.ars');
    if (existingArs) {
        existingArs.insertAdjacentHTML('beforebegin', rowElements);
    } else {
        recordingTd.insertAdjacentHTML('beforeend', rowElements);
    }
}

function loadAndInsert() {
    let recAnchors = document.querySelectorAll('table.medium td > a[href^="/recording/"]:first-child, table.medium td > span:first-child > a[href^="/recording/"]:first-child');
    let todo = [...recAnchors]
        .map((a) => [a.closest('td'), a.href.split('/recording/')[1]])
        .filter(([td]) => !td.querySelector('div.ars.ROpdebee_inline_tracks'));
    let chunks = splitChunks(todo, 20);

    chunks.forEach(async (chunk) => {
        let recInfo = await loadRecordingInfo(chunk.map(([, recId]) => recId));
        chunk.forEach(([td, recId]) => insertRows(td, recInfo[recId]));
    });
}

// MBS will fire a custom `mb-hydration` event whenever a React component gets
// hydrated. We need to wait for hydration to complete before modifying the
// component, React gets mad otherwise.
// Multiple `mb-hydration` events will fire on a release page, so make sure we're
// listening for the correct one.
function onReactHydrated(element, callback) {
    var alreadyHydrated = Object.keys(element).some(function (propertyName) {
        return propertyName.startsWith('_reactListening') && element[propertyName];
    });

    if (alreadyHydrated) {
        callback();
    } else if (window.__MB__.DBDefs.GIT_BRANCH === 'production' && window.__MB__.DBDefs.GIT_SHA === '923237cf73') {
        // Current production version does not have this custom event yet.
        // TODO: Remove this when prod is updated.
        window.addEventListener('load', callback);
    } else {
        element.addEventListener('mb-hydration', callback);
    }
}

onReactHydrated(document.querySelector('.tracklist-and-credits'), () => {
    const button = document.createElement('button');
    button.classList.add('btn-link');
    button.type = 'button';
    button.textContent = 'Display track info for recordings';
    button.addEventListener('click', loadAndInsert);

    document.querySelector('span#medium-toolbox')
        .firstChild.before(button, ' | ');
});
