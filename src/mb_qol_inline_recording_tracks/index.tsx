import pThrottle from 'p-throttle';

import type { APIResponse, Recording } from '@lib/MB/types-api';
import { insertBetween, splitChunks } from '@lib/util/array';
import { logFailure } from '@lib/util/async';
import { onReactHydrated, qs, qsa, qsMaybe } from '@lib/util/dom';
import { safeParseJSON } from '@lib/util/json';

// FIXME: These types need to be refactored in @lib/MB/types-api
type RecordingRelease = Recording['releases'][0];
type RecordingReleaseMedia = RecordingRelease['media'];
type MediumTrack = RecordingReleaseMedia[0]['track'][0];


// Throttled fetching from API so that only one request per 0.5s is made.
const throttledFetch = pThrottle({ limit: 1, interval: 500 })(fetch);

async function loadRecordingInfo(rids: string[]): Promise<Map<string, Recording>> {
    const query = rids.map((rid) => 'rid:' + rid).join(' OR ');
    const url = document.location.origin + '/ws/2/recording?fmt=json&query=' + query;
    const resp = await throttledFetch(url);
    const respContent = safeParseJSON<APIResponse<'recordings', Recording>>(await resp.text(), 'Could not parse API response');

    const perRecId = new Map<string, Recording>();

    respContent.recordings.forEach((rec) => {
        perRecId.set(rec.id, rec);
    });
    return perRecId;
}

function getTrackIndexElement(track: MediumTrack, mediumPosition: number): HTMLElement {
    return <a href={`/track/${track.id}`}>#{mediumPosition.toString()}.{track.number}</a>;
}

function getTrackIndexElements(media: RecordingReleaseMedia): Array<HTMLElement | string> {
    const tracks = media.flatMap((medium) => medium.track.map((track) => {
        return getTrackIndexElement(track, medium.position);
    }));

    return insertBetween(tracks, ', ');
}

function getReleaseNameElement(release: RecordingRelease): HTMLElement {
    return <a href={`/release/${release.id}`}>{release.title}</a>;
}

function formatRow(release: RecordingRelease): Array<HTMLElement | string> {
    // TODO: Use JSX fragments. nativejsx doesn't support those (yet) though.
    return [
        getReleaseNameElement(release),
        ' (',
        ...getTrackIndexElements(release.media),
        ')',

    ];
}

function insertRows(recordingTd: HTMLTableCellElement, recordingInfo: Recording): void {
    const rowElements = recordingInfo.releases
        .map((release) => formatRow(release))
        .map((row) => <dl className='ars'>
            <dt>appears on:</dt>
            <dd>{row}</dd>
        </dl>);

    qs<HTMLElement>('div.ars', recordingTd)
        .insertAdjacentElement('beforebegin', <div className='ars ROpdebee_inline_tracks'>
            {rowElements}
        </div>);
}

function loadAndInsert(): void {
    const recAnchors = qsa<HTMLAnchorElement>('table.medium td > a[href^="/recording/"]:first-of-type, table.medium td > span:first-child > a[href^="/recording/"]:first-of-type');
    const todo = recAnchors
        .map((a): [HTMLTableCellElement, string] => [a.closest('td')!, a.href.split('/recording/')[1]])
        .filter(([td]) => qsMaybe('div.ars.ROpdebee_inline_tracks', td) === null);
    const chunks = splitChunks(todo, 20);

    logFailure(Promise.all(chunks.map(async (chunk) => {
        const recInfo = await loadRecordingInfo(chunk.map(([, recId]) => recId));
        chunk.forEach(([td, recId]) => {
            insertRows(td, recInfo.get(recId)!);
        });
    })));
}

onReactHydrated(qs('.tracklist-and-credits'), function() {
    // Callback as a function instead of a lambda here because when nativejsx
    // transpiles the JSX below, it wraps it in a functions which it calls as
    // `.call(this)` (to inject the outer scope's this), but that produces rollup
    // warnings since `this` is not available at the top level.
    // TODO: Can we edit nativejsx to instead wrap it in a lambda? Then `this`
    // wouldn't need to be injected.
    const button = <button className='btn-link' type='button' onClick={loadAndInsert}>
        Display track info for recordings
    </button>;

    qs('span#medium-toolbox')
        .firstChild?.before(button, ' | ');
});
