// ==UserScript==
// @name         MB: QoL: Seed the batch recording comments script
// @version      2021.5.23
// @description  Seed the recording comments for the batch recording comments userscripts with live and DJ-mix data.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_qol_seed_recording_disambiguation.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_qol_seed_recording_disambiguation.user.js
// @match        *://*musicbrainz.org/release/*
// @exclude      *://*musicbrainz.org/release/add
// @exclude      *://*musicbrainz.org/release/*/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

// Similarly to mb_upload_to_caa_from_url, we reuse MB's own jQuery here so that
// we can trigger the relevant events.

function getReleaseTitle() {
    return $('.releaseheader > h1:first-child bdi').text();
}

function getDJMixComment() {
    return `part of a “${getReleaseTitle()}” DJ‐mix`;
}

async function getRecordingRels(relGid) {
    let resp = await fetch(`${location.origin}/ws/js/release/${relGid}?inc=rels recordings`);
    return resp.json();
}

function stringifyDate(date) {
    let year = date.year ? date.year.toString().padStart(4, '0') : '????';
    let month = date.month ? date.month.toString().padStart(2, '0') : '??';
    let day = date.day ? date.day.toString().padStart(2, '0') : '??';
    return [year, month, day].join('‐')
        .replace(/(?:‐\?{2}){1,2}$/, ''); // Remove -?? or -??-?? suffix.
        // If neither year, month, or day is set, will return '????'
}

function getDateStr(rel) {
    if (!rel.begin_date || !rel.end_date) return null;

    let [beginStr, endStr] = [rel.begin_date, rel.end_date].map(stringifyDate);

    if (beginStr === '????' || endStr === '????') return null;

    if (beginStr === endStr) return beginStr;
    else return `${beginStr}–${endStr}`;
}

function getRecordingVenue(rels) {
    let recordedAtRels = rels.filter((rel) => rel.linkTypeID === 693);
    if (recordedAtRels.length !== 1) return null;

    return recordedAtRels[0].target.name + ', ' + formatRecordingArea(recordedAtRels[0].target.area);
}

function getRecordingArea(rels) {
    let recordedInRels = rels.filter((rel) => rel.linkTypeID === 698);
    if (recordedInRels.length !== 1) return null;

    return formatRecordingArea(recordedInRels[0].target);
}

function formatRecordingArea(area) {
    let areaList = [area, ...area.containment];
    let city = null;
    let country = null;
    let state = null;

    // Least to most specific, retain only most specific except for states (subdivisions)
    for (let i = areaList.length - 1; i >= 0; i--) {
        let areaType = areaList[i].typeID;
        switch (areaType) {
            case 1:
                country = areaList[i]; break;
            case 2:
                state = state || areaList[i]; break;
            case 3:
            case 4:
                city = areaList[i]; break;
        }
    }

    if (!country || !['US', 'CA'].includes(country.country_code)) {
        state = null;
    }

    if (!country) country = null;
    else if (country.primary_code === 'US') country = 'US';
    else if (country.primary_code === 'GB') country = 'UK';
    else country = country.name;

    state = state && state.primary_code.split('-')[1];
    city = city && city.name;
    let parts = [city, state, country].filter((part) => part);
    return parts.join(', ');
}

function getRecordingDate(rels) {
    let dateStrs = [...new Set(rels
        .filter((rel) => [698, 693, 278].includes(rel.linkTypeID))
        .map(getDateStr)
        .filter((dateStr) => dateStr))];
    if (dateStrs.length !== 1) return null;
    return dateStrs[0];
}

function getRecordingLiveComment(rec) {
    let rels = rec.relationships;
    let place = getRecordingVenue(rels);
    // Fall back on "recorded in" rels if we can't extract a place
    if (!place) {
        place = getRecordingArea(rels);
    }
    let date = getRecordingDate(rels);

    let comment = 'live';
    if (date) comment += ', ' + date;
    if (place) comment += ': ' + place;

    return comment;
}

function fillInput($input, value) {
    $input.val(value);
    $input.trigger('input').trigger('input.rc');
}

function seedDJMix() {
    fillInput($('input#all-recording-comments'), getDJMixComment());
}

async function seedLive() {
    let relInfo = await getRecordingRels(location.pathname.split('/')[2]);
    let recComments = relInfo.mediums
        .flatMap((medium) => medium.tracks.map((track) => [track.gid, getRecordingLiveComment(track.recording)]));

    let uniqueComments = [...new Set(recComments.map(([gid, comment]) => comment))];
    if (uniqueComments.length === 1) {
        fillInput($('input#all-recording-comments'), uniqueComments[0]);
    } else {
        recComments.forEach(([trackGid, comment]) => fillInput($(`tr#${trackGid} input.recording-comment`), comment));
    }
}

function insertButtons() {
    let $tr = $('table#set-recording-comments tr:first');
    if (!$tr.length) {
        return setTimeout(insertButtons, 500);  // Try again later, might not be loaded yet
        // This will spin indefinitely if the batch recording comments script is not installed. wontfix
    }

    $tr.after(`<tr>
        <td>Seed recording comments:</td>
        <td>
            <button id="ROpdebee_seed_comments_live" class="btn-link" type="button">Live</button>
            |
            <button id="ROpdebee_seed_comments_djmix" class="btn-link" type="button">DJ‐mix</button>
        </td>
    </tr>`);

    $('#ROpdebee_seed_comments_live').click(seedLive);
    $('#ROpdebee_seed_comments_djmix').click(seedDJMix);
}

insertButtons();
