// ==UserScript==
// @name         MB: QoL: Inline all recording's tracks on releases
// @version      2024.8.2
// @description  Display all tracks and releases on which a recording appears from the release page.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_qol_inline_recording_tracks.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_qol_inline_recording_tracks.user.js
// @match        *://*.musicbrainz.eu/release/*
// @match        *://*.musicbrainz.org/release/*
// @exclude      */release/*/*
// @exclude      */release/add
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

function getTrackIndex(track, mediumPosition, mediumTrackCount) {
    return `<a href="/track/${track.id}" title="track ${track.number} of ${mediumTrackCount}">#${mediumPosition}.${track.number}</a>`;
}

function getTrackIndices(media) {
    return media.flatMap((medium) =>
            medium.track.map((track) => getTrackIndex(track, medium.position, medium['track-count'])))
        .join(', ');
}

function getReleaseName(release) {
    return `<a href="/release/${release.id}" title="` + (release.date ? `released on ${release.date}` : 'unknown release date') + `">${release.title}</a>` + (release.disambiguation ? ` <span class="comment">(${release.disambiguation})</span>` : '');
}

function formatRow(release) {
    return `${getReleaseName(release)} (${getTrackIndices(release.media)}) <span class="comment">${humanReadableTime(release.media[0].track[0].length)}</span>`;
}

function insertRows(recordingTd, recordingInfo) {
    let rowElements = recordingInfo.releases
        .sort(compareReleases)
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

function compareReleases(a, b) {
    if (releaseOrderingString(a) < releaseOrderingString(b)) {
        return -1;
    } else {
        return 1;
    }
}

function releaseOrderingString(release) {
    return `[${release.date || ''}] ${release.title} ${release.disambiguation || ''} ${release.media[0].position.toString().padStart(4, '0')}.${release.media[0].track[0].number.toString().padStart(10, '0')}`;
}

function loadAndInsert() {
    let recAnchors = document.querySelectorAll('table.medium td > a[href^="/recording/"], table.medium td > span > a[href^="/recording/"], table.medium td > span > span > a[href^="/recording/"]');
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

function humanReadableTime(_ms) {
    var ms = typeof _ms == "string" ? parseInt(_ms, 10) : _ms;
    if (ms > 0) {
        var d = new Date(ms);
        return (d.getUTCHours() > 0 ? d.getUTCHours() + ":" + (d.getUTCMinutes() / 100).toFixed(2).slice(2) : d.getUTCMinutes()) + ":" + (d.getUTCSeconds() / 100).toFixed(2).slice(2) + (d.getUTCMilliseconds() > 0 ? "." + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2) : "");
    }
    return "?:??";
}
