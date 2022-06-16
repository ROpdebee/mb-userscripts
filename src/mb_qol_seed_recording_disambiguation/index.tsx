import type { Area, AreaCity, AreaCountry, AreaMunicipality, AreaSubdivision, RelationshipDate, ReleaseRecordingRels } from '@lib/MB/types-api';
import { GMinfo } from '@lib/compat';
import { filterNonNull } from '@lib/util/array';
import { logFailure } from '@lib/util/async';
import { qs, qsMaybe } from '@lib/util/dom';

class ConflictError extends Error {}

// TODO: Refactor.
type Medium = ReleaseRecordingRels['mediums'][0];
type Track = Medium['tracks'][0];
type ReleaseGroup = ReleaseRecordingRels['releaseGroup'];
type Recording = Track['recording'];
type RecordingRelationship = Recording['relationships'][0];

type FilteredRelationship<RelationshipT, LinkTypeID> = (
    RelationshipT extends { linkTypeID: LinkTypeID } ? RelationshipT : never);
type RecordedAtPlaceRel = FilteredRelationship<RecordingRelationship, 693>;
type RecordedInAreaRel = FilteredRelationship<RecordingRelationship, 698>;

function unicodeToAscii(s: string): string {
    // Facilitate comparisons
    return s
        .replace(/[“”″]/g, '"')
        .replace(/[‘’′]/g, "'")
        .replace(/[‐‒–]/g, '-');
}

function getReleaseTitle(): string {
    // Make sure we're only taking the first <bdi> element. There could be a
    // second if the release has a disambiguation comment itself.
    return document.querySelector('.releaseheader > h1 bdi')!.textContent!;
}

function getDJMixComment(): string {
    return `part of “${getReleaseTitle()}” DJ‐mix`;
}

async function getRecordingRels(relGid: string): Promise<ReleaseRecordingRels> {
    const resp = await fetch(`${document.location.origin}/ws/js/release/${relGid}?inc=rels recordings`);
    return resp.json() as Promise<ReleaseRecordingRels>;
}

function stringifyDate(date: RelationshipDate): string {
    const year = date.year ? date.year.toString().padStart(4, '0') : '????';
    const month = date.month ? date.month.toString().padStart(2, '0') : '??';
    const day = date.day ? date.day.toString().padStart(2, '0') : '??';

    // If neither year, month, or day is set, will return '????'
    return [year, month, day].join('‐')
        .replace(/(?:‐\?{2}){1,2}$/, ''); // Remove -?? or -??-?? suffix.
}

function getDateStr(rel: RecordingRelationship): string | null {
    if (!rel.begin_date || !rel.end_date) return null;

    const [beginStr, endStr] = [rel.begin_date, rel.end_date].map((date) => stringifyDate(date));

    if (beginStr === '????' || endStr === '????') return null;

    return beginStr === endStr ? beginStr : `${beginStr}–${endStr}`;
}

function selectCommentPart(candidates: Set<string>, partName: string): string | null {
    if (candidates.size === 0) return null;

    if (candidates.size > 1) {
        throw new ConflictError(`Conflicting ${partName}: ${[...candidates].join(' vs. ')}`);
    }

    return candidates.values().next().value as string;
}

function filterRels<LinkTypeID extends number>(rels: RecordingRelationship[], linkTypeID: LinkTypeID): Array<FilteredRelationship<RecordingRelationship, LinkTypeID>> {
    return rels
        .filter((rel) => rel.linkTypeID === linkTypeID) as Array<FilteredRelationship<RecordingRelationship, LinkTypeID>>;
}

function getRecordingVenue(rels: RecordingRelationship[]): string | null {
    // 693 = <recording> recorded at <place>
    const venuesFormatted = new Set(filterRels(rels, 693)
        .map((placeRel) => formatRecordingVenue(placeRel)));

    return selectCommentPart(venuesFormatted, '“recorded at” ARs');
}

function getRecordingArea(rels: RecordingRelationship[]): string | null {
    // 698 = <recording> recorded in <area>
    const areasFormatted = new Set(filterRels(rels, 698)
        .map((areaRel) => formatRecordingArea(areaRel)));

    return selectCommentPart(areasFormatted, '“recorded in” ARs');
}

function formatRecordingVenue(placeRel: RecordedAtPlaceRel): string {
    // place ARs returned by the API seem to always be in the backward direction,
    // i.e. the place is the target, but entity0 remains the place.
    return (placeRel.entity0_credit || placeRel.target.name) + ', ' + formatRecordingBareArea(placeRel.target.area);
}

function formatRecordingArea(areaRel: RecordedInAreaRel): string {
    return formatRecordingBareArea(areaRel.target);
}

function formatRecordingBareArea(area: Area): string {
    const areaList = [area, ...area.containment];
    let city: AreaCity | AreaMunicipality | null = null;
    let country: AreaCountry | null = null;
    let state: AreaSubdivision | null = null;

    // Least to most specific, retain only most specific except for states (subdivisions)
    for (let i = areaList.length - 1; i >= 0; i--) {
        const areaPart = areaList[i];
        switch (areaPart.typeID) {
        case 1:
            country = areaPart;
            break;

        case 2:
            state = state ?? areaPart;
            break;

        case 3:
        case 4:
            city = areaPart;
            break;
        }
    }

    if (!country || !['US', 'CA'].includes(country.country_code)) {
        state = null;
    }

    let countryName: string | null;
    if (!country) countryName = null;
    else if (country.primary_code === 'US') countryName = 'USA';
    else if (country.primary_code === 'GB') countryName = 'UK';
    else countryName = country.name;

    const stateName = state?.primary_code?.split('-')[1];
    // Exception for Washington D.C., it's set as a subdivision in MB, leading
    // to comments for venues in DC to be "live, ...: <venue>, DC, USA" without
    // the city name.
    const cityName = city?.name || (stateName === 'DC' && 'Washington');
    const parts = [cityName, stateName, countryName].filter(Boolean);
    return parts.join(', ');
}

function getRecordingDate(rels: RecordingRelationship[]): string | null {
    const dateStrs = new Set(filterNonNull(rels
        .filter((rel) => [698, 693, 278].includes(rel.linkTypeID))
        .map((rel) => getDateStr(rel))));

    return selectCommentPart(dateStrs, 'recording dates');
}

function getRecordingLiveComment(rec: Recording): string {
    const rels = rec.relationships;
    // Fall back on "recorded in" rels if we can't extract a place
    const place = getRecordingVenue(rels) ?? getRecordingArea(rels);

    const date = getRecordingDate(rels);

    let comment = 'live';
    if (date) comment += ', ' + date;
    if (place) comment += ': ' + place;

    return comment;
}

function isLiveRecording(rec: Recording, releaseGroup: ReleaseGroup): boolean {
    // 278 = <recording> recording of <work>
    const recordingRelationships = filterRels(rec.relationships, 278);

    // Consider this a live recording if there is a linked work with a live
    // attribute set or if there is no linked recording but the RG has the live
    // type set. If there are linked recordings but no live attributes, or
    // there are no linked recordings and no live on the RG, be conservative
    // and don't consider it live.
    // eslint-disable-next-line unicorn/prefer-ternary -- Too complex.
    if (recordingRelationships.length > 0) {
        return recordingRelationships
            .some((recRel) => (recRel.attributes ?? []).find((attr) => attr.typeID === 578));
    } else {
        return (releaseGroup.secondaryTypeIDs ?? []).includes(6);
    }
}

function fillInput(input: HTMLInputElement | HTMLTextAreaElement, value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('input.rc'));
}

function seedDJMix(): void {
    fillInput(qs<HTMLInputElement>('input#all-recording-comments'), getDJMixComment());
    fillInput(qs<HTMLTextAreaElement>('textarea#recording-comments-edit-note'), `${GMinfo.script.name} v${GMinfo.script.version}: Seed DJ‐mix comments`);
}

function displayWarning(msg: string): void {
    const warnList = qs('#ROpdebee_seed_comments_warnings');
    warnList.append(<li>{msg}</li>);
    warnList.closest('tr')!.style.display = '';
}

function createTrackLiveComment(track: Track, medium: Medium, releaseInfo: ReleaseRecordingRels): [string, string] {
    const rec = track.recording;

    if (!isLiveRecording(rec, releaseInfo.releaseGroup)) {
        displayWarning(`Skipping track #${medium.position}.${track.number}: Not a live recording`);
        return [track.gid, rec.comment];
    }

    const existing = unicodeToAscii(rec.comment.trim());
    try {
        const newComment = getRecordingLiveComment(rec);
        if (existing && existing !== 'live' && existing !== unicodeToAscii(newComment)) {
            // Conflicting comments, refuse to enter
            throw new ConflictError(`Significant differences between old and new comments: ${existing} vs ${newComment}`);
        }
        return [track.gid, newComment];
    } catch (err) {
        if (!(err instanceof ConflictError)) throw err;
        displayWarning(`Track #${medium.position}.${track.number}: Refusing to update comment: ${err.message}`);
        return [track.gid, rec.comment];
    }
}

async function seedLive(): Promise<void> {
    const relInfo = await getRecordingRels(document.location.pathname.split('/')[2]);
    const recComments = relInfo.mediums
        .flatMap((medium) => medium.tracks
            .map((track) => createTrackLiveComment(track, medium, relInfo)));

    const uniqueComments = [...new Set(recComments.map(([, comment]) => comment))];
    if (uniqueComments.length === 1) {
        fillInput(qs<HTMLInputElement>('input#all-recording-comments'), uniqueComments[0]);
    } else {
        recComments.forEach(([trackGid, comment]) => {
            fillInput(qs<HTMLInputElement>(`tr#${trackGid} input.recording-comment`), comment);
        });
    }

    fillInput(qs<HTMLTextAreaElement>('textarea#recording-comments-edit-note'), `${GMinfo.script.name} v${GMinfo.script.version}: Seed live comments`);
}

function insertButtons(): void {
    const tr = qsMaybe('table#set-recording-comments tr');
    if (tr === null) {
        // Try again later, might not be loaded yet
        // This will spin indefinitely if the batch recording comments script is not installed. wontfix
        setTimeout(insertButtons, 500);
        return;
    }

    const liveButton = <button
        id='ROpdebee_seed_comments_live'
        className='btn-link'
        type='button'
        onClick={(): void => { logFailure(seedLive()); }}
    >Live</button>;
    const djButton = <button
        id='ROpdebee_seed_comments_djmix'
        className='btn-link'
        type='button'
        onClick={seedDJMix}
    >DJ‐mix</button>;

    tr.after(
        <tr>
            <td>Seed recording comments:</td>
            <td>{liveButton} | {djButton}</td>
        </tr>,
        <tr style={{ display: 'none' }}>
            <td>Warnings</td>
            <td>
                <ul id="ROpdebee_seed_comments_warnings" style={{ color: 'red' }}/>
            </td>
        </tr>,
    );
}

insertButtons();
