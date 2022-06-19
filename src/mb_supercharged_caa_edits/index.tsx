import '@lib/MB/types'; // Import ambient declarations

import type Moment from 'moment';
import type Resemble from 'resemblejs';
import pRetry from 'p-retry';

import type { Release } from '@lib/MB/types-api';
import type { CAAIndex } from '@src/mb_enhanced_cover_art_uploads/providers/archive';
import { logFailure } from '@lib/util/async';
import { memoize } from '@lib/util/functions';
import { HTTPResponseError } from '@lib/util/xhr';

import type { CAAImage } from './CAAEdit';
import { CAAEdit } from './CAAEdit';
import { LOADING_GIF } from './constants';

declare global {
    const resemble: typeof Resemble;
    const moment: typeof Moment;
}

resemble.outputSettings({
    errorColor: {red: 0, green: 0, blue: 0},
    errorType: 'movementDifferenceIntensity',
    transparency: .25,
});

const ID_RGX = /release\/([a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12})\/(\d+)\.\w+/;

const DEFAULT_TRIES = 5;

// MB and moments' locale for German short month names don't match
moment.updateLocale('de', {
    monthsShort: 'Jan_Feb_Mär_Apr_Mai_Jun_Jul_Aug_Sep_Okt_Nov_Dez'.split('_'),
});

function fetchWithRetry(url: string, options?: RequestInit, tries = DEFAULT_TRIES): Promise<Response> {
    async function tryRequest(): Promise<Response> {
        const resp = await fetch(url, options);
        // Only resolve when we get a 200 OK response, everything else is
        // an error
        if (resp.ok) return resp;

        throw new HTTPResponseError(url, resp);
    }

    return pRetry(tryRequest, {
        retries: tries,
        onFailedAttempt: (err) => {
            // Don't retry on 4xx status codes except for 429. Anything below 400 doesn't throw a HTTPResponseError.
            if (err instanceof HTTPResponseError && err.statusCode < 500 && err.statusCode !== 429) {
                throw err;
            }
        },
    });
}

// Memoization to ensure we don't try to load the same index
// multiple times for images from the same release.
async function _getAllImages(mbid: string): Promise<CAAIndex['images']> {
    // Should be fine with CORS
    const resp = await fetchWithRetry(`https://coverartarchive.org/release/${mbid}/`);
    const respObj = await resp.json() as CAAIndex;
    return respObj.images;
}

const getAllImages = memoize(_getAllImages);

async function _getPendingRemovals(releaseGid: string): Promise<Set<number>> {
    async function getPage(pageNo: number): Promise<string> {
        const url = `${window.location.origin}/search/edits?conditions.0.field=release&conditions.0.operator=%3D&conditions.0.args.0=${releaseGid}&conditions.1.field=type&conditions.1.operator=%3D&conditions.1.args=315&conditions.2.field=status&conditions.2.operator=%3D&conditions.2.args=1&page=${pageNo}`;
        const resp = await fetchWithRetry(url);
        return resp.text();
    }

    function processPage(pageHtml: string, resultSet: Set<number>): number | undefined {
        const parser = new DOMParser();
        const dom = parser.parseFromString(pageHtml, 'text/html');
        [...dom.querySelectorAll('table.details.remove-cover-art code')]
            .map((code) => code.textContent!)
            .map((filename) => filename.split('-'))
            .filter((parts) => parts.length == 7)
            .map((parts) => parts[6].match(/^(\d+)\.\w+/)![1]!)
            .forEach((id) => {
                resultSet.add(parseInt(id));
            });

        const nextAnchor = dom.querySelector<HTMLAnchorElement>('ul.pagination li:last-child > a');
        if (!nextAnchor) return;
        return parseInt(nextAnchor.href.match(/page=(\d+)/)![1]);
    }

    let curPageNo: number | undefined = 1;
    const results = new Set<number>();
    while (curPageNo) {
        const pageHtml = await getPage(curPageNo);
        curPageNo = processPage(pageHtml, results);
    }

    return results;
}

const getPendingRemovals = memoize(_getPendingRemovals);

async function getReleaseDetails(mbid: string): Promise<Release> {
    const resp = await fetchWithRetry(`${window.location.origin}/ws/js/release/${mbid}`);
    return resp.json() as Promise<Release>;
}

function typeMatchScore(t1: string[], t2: string[]): number {
    const allTypes = new Set<string>();
    t1.forEach((t) => allTypes.add(t));
    t2.forEach((t) => allTypes.add(t));

    const sharedTypes = t1.filter((t) => t2.includes(t));

    // eslint-disable-next-line unicorn/explicit-length-check -- False positive.
    return sharedTypes.length / (allTypes.size || 1);
}

function sortRetainedByTypeMatch(imgs: CAAImage[], targetTypes: string[]): CAAImage[] {
    return imgs
        .map((img): [CAAImage, number] => [img, typeMatchScore(img.types, targetTypes)])
        .sort((a, b) => b[1] - a[1])
        .map(([img]) => img);
}

function insertPlaceholder(edit: Element): void {
    const td = <td className='ROpdebee_comparisonImage edit-cover-art ROpdebee_loading' />;
    edit.querySelector('td.edit-cover-art')!.after(td);
}

const discoveredEdits = new Set();
async function processEdit(edit: Element): Promise<void> {
    let editId: string;
    try {
        editId = edit.querySelector<HTMLInputElement>('input[name$="edit_id"]')!.value;
        // Already processed/in progress
        if (discoveredEdits.has(editId)) return;
        discoveredEdits.add(editId);
    } catch (err) {
        console.error(`This edit does not have an edit ID? ${err}`);
        return;
    }

    insertPlaceholder(edit);

    const [mbid, imageIdString] = edit.querySelector<HTMLAnchorElement>('a.artwork-image, a.artwork-pdf')!.href.match(ID_RGX)!.slice(1);
    const imageId = parseInt(imageIdString);
    const releaseDetails = await getReleaseDetails(mbid);
    const gid = releaseDetails.id;
    const allImages = await getAllImages(mbid).catch(() => []);
    let otherImages = allImages.filter((img) => img.id !== imageId);
    if (edit.querySelectorAll('.remove-cover-art').length > 0) {
        const pendingRemovals = await getPendingRemovals(gid).catch(() => new Set<number>());
        otherImages = allImages.filter((img) => {
            const id = typeof img.id === 'string' ? parseInt(img.id) : img.id;
            return !pendingRemovals.has(id) && id !== imageId;
        });
    }

    const currImage = allImages.find((img) => {
        const id = typeof img.id === 'string' ? parseInt(img.id) : img.id;
        return id === imageId;
    });
    const currTypes = currImage ? currImage.types : [];

    // Most likely matches first
    otherImages = sortRetainedByTypeMatch(otherImages, currTypes);

    new CAAEdit(edit, releaseDetails, otherImages, currImage);
}

const processEditWhenInView = (function(): (elmt: HTMLElement) => void {
    const options = {
        root: document,
    };
    const observer = new IntersectionObserver((entries) => {
        entries
            .filter((e) => e.intersectionRatio > 0)
            .forEach((e) => {
                logFailure(processEdit(e.target));
            });
    }, options);

    return (elmt) => {
        observer.observe(elmt);
    };
})();

function setupStyle(): void {
    // Custom CSS rules
    const style = document.createElement('style');
    style.id = 'ROpdebee_CAA_Edits_Supercharged';
    document.head.append(style);
    // Make sure the replacement image aligns properly with the source
    style.sheet!.insertRule('td.edit-cover-art { vertical-align: top; }');
    // Loading placeholder
    style.sheet!.insertRule(`.ROpdebee_loading {
        background: transparent url(${LOADING_GIF}) center center no-repeat;
        min-width: 250px;
        min-height: 250px;
    }`);
    // Comparison dialog
    style.sheet!.insertRule(`.ROpdebee_dialogDiff, .ROpdebee_dialogSbs {
        float: left;
    }`);
    style.sheet!.insertRule(`.ROpdebee_dialogSbs > img, .ROpdebee_dialogOverlay > img {
        margin: 5px;
        object-fit: contain;
        display: block;
    }`);
    style.sheet!.insertRule(`.ROpdebee_dialogSbs > img {
        width: 25vw;
        height: 25vw;
    }`);
    style.sheet!.insertRule(`.ROpdebee_dialogOverlay > img {
        width: 33vw;
        height: 33vw;
    }`);
    style.sheet!.insertRule(`.ROpdebee_shady {
        color: red;
        font-weight: bold;
        border-bottom: 1px dotted;
    }`);
}

function main(): void {
    setupStyle();

    document.querySelectorAll('.open.remove-cover-art, .open.add-cover-art')
        .forEach((elmt) => {
            processEditWhenInView(elmt.parentNode! as HTMLElement);
        });
}

main();
