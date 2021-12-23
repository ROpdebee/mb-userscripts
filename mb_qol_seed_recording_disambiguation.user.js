// ==UserScript==
// @name         MB: QoL: Seed the batch recording comments script
// @version      2021.12.23
// @description  Seed the recording comments for the batch recording comments userscripts with live and DJ-mix data.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_qol_seed_recording_disambiguation.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_qol_seed_recording_disambiguation.user.js
// @match        *://*.musicbrainz.org/release/*
// @exclude      *://*.musicbrainz.org/release/add
// @exclude      *://*.musicbrainz.org/release/*/edit*
// @run-at       document-end
// @grant        none
// ==/UserScript==

// Similarly to mb_upload_to_caa_from_url, we reuse MB's own jQuery here so that
// we can trigger the relevant events.


class ConflictError extends Error {}

function unicodeToAscii(s) {
    // Facilitate comparisons
    return s
        .replace(/[“”″]/g, '"')
        .replace(/[‘’′]/g, "'")
        .replace(/[‐‒–]/g, '-');
}

function getReleaseTitle() {
    return $('.releaseheader > h1:first-child bdi').text();
}

function getDJMixComment() {
    return `part of “${getReleaseTitle()}” DJ‐mix`;
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

function selectCommentPart(candidates, partName) {
    if (!candidates.size) return null;

    if (candidates.size > 1) {
        throw new ConflictError(`Conflicting ${partName}: ${[...candidates].join(' vs. ')}`);
    }

    return candidates.values().next().value;
}

function getRecordingVenue(rels) {
    let venuesFormatted = new Set(rels
        // 693 = <recording> recorded at <place>
        .filter((rel) => rel.linkTypeID === 693)
        .map(formatRecordingVenue));

    return selectCommentPart(venuesFormatted, '“recorded at” ARs');
}

function getRecordingArea(rels) {
    let recordedInRels = new Set(rels
        // 698 = <recording> recorded in <area>
        .filter((rel) => rel.linkTypeID === 698)
        .map(formatRecordingArea));

    return selectCommentPart(recordedInRels, '“recorded in” ARs');
}

function formatRecordingVenue(placeRel) {
    // place ARs returned by the API seem to always be in the backward direction,
    // i.e. the place is the target, but entity0 remains the place.
    return (placeRel.entity0_credit || placeRel.target.name) + ', ' + formatRecordingBareArea(placeRel.target.area);
}

function formatRecordingArea(areaRel) {
    return formatRecordingBareArea(areaRel.target);
}

function formatRecordingBareArea(area) {
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
    else if (country.primary_code === 'US') country = 'USA';
    else if (country.primary_code === 'GB') country = 'UK';
    else country = country.name;

    state = state && state.primary_code.split('-')[1];
    // Exception for Washington D.C., it's set as a subdivision in MB, leading
    // to comments for venues in DC to be "live, ...: <venue>, DC, USA" without
    // the city name.
    city = (city && city.name) || (state === 'DC' && 'Washington');
    let parts = [city, state, country].filter((part) => part);
    return parts.join(', ');
}

function getRecordingDate(rels) {
    let dateStrs = new Set(rels
        .filter((rel) => [698, 693, 278].includes(rel.linkTypeID))
        .map(getDateStr)
        .filter((dateStr) => dateStr));

    return selectCommentPart(dateStrs, 'recording dates');
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

function isLiveRecording(rec, releaseGroup) {
    const recordingRelationships = rec.relationships
        // 278 = <recording> recording of <work>
        .filter((rel) => rel.linkTypeID === 278);

    // Consider this a live recording if there is a linked work with a live
    // attribute set or if there is no linked recording but the RG has the live
    // type set. If there are linked recordings but no live attributes, or
    // there are no linked recordings and no live on the RG, be conservative
    // and don't consider it live.
    if (recordingRelationships.length) {
        return recordingRelationships
            .some((recRel) => (recRel.attributes || []).find((attr) => attr.typeID === 578));
    } else {
        return (releaseGroup.secondaryTypeIDs || []).includes(6);
    }
}

function fillInput($input, value) {
    $input.val(value);
    $input.trigger('input').trigger('input.rc');
}

function seedDJMix() {
    fillInput($('input#all-recording-comments'), getDJMixComment());
    fillInput($('textarea#recording-comments-edit-note'), `${GM_info.script.name} v${GM_info.script.version}: Seed DJ‐mix comments`);
}

function displayWarning(msg) {
    const $warnList = $('#ROpdebee_seed_comments_warnings')
    $warnList.append(`<li>${msg}</li>`);
    $warnList.closest('tr').show();
}

async function seedLive() {
    let relInfo = await getRecordingRels(location.pathname.split('/')[2]);
    let recComments = relInfo.mediums
        .flatMap((medium) => medium.tracks
            .map((track) => {
                const rec = track.recording;

                if (!isLiveRecording(rec, relInfo.releaseGroup)) {
                    displayWarning(`Skipping track #${medium.position}.${track.number}: Not a live recording`);
                    return [track.gid, rec.comment];
                }

                const existing = unicodeToAscii(rec.comment.trim());
                try {
                    let newComment = getRecordingLiveComment(rec);
                    if (existing && existing !== 'live' && existing !== unicodeToAscii(newComment)) {
                        // Conflicting comments, refuse to enter
                        throw new ConflictError(`Significant differences between old and new comments: ${existing} vs ${newComment}`);
                    }
                    return [track.gid, newComment];
                } catch (e) {
                    if (!(e instanceof ConflictError)) throw e;
                    displayWarning(`Track #${medium.position}.${track.number}: Refusing to update comment: ${e.message}`);
                    return [track.gid, rec.comment];
                }
            }));

    let uniqueComments = [...new Set(recComments.map(([_gid, comment]) => comment))];
    if (uniqueComments.length === 1) {
        fillInput($('input#all-recording-comments'), uniqueComments[0]);
    } else {
        recComments.forEach(([trackGid, comment]) => fillInput($(`tr#${trackGid} input.recording-comment`), comment));
    }

    fillInput($('textarea#recording-comments-edit-note'), `${GM_info.script.name} v${GM_info.script.version}: Seed live comments`);
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
    </tr>
    <tr style="display: none;">
        <td>Warnings</td>
        <td><ul id="ROpdebee_seed_comments_warnings" style="color: red;">
        </ul></td>
    </tr>`);

    $('#ROpdebee_seed_comments_live').click(seedLive);
    $('#ROpdebee_seed_comments_djmix').click(seedDJMix);
}

insertButtons();
