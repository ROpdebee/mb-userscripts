import { LOGGER } from '@lib/logging/logger';
import { getReleaseIDsForURL } from '@lib/MB/URLs';
import { assertHasValue } from '@lib/util/assert';
import { qs, qsa, qsMaybe } from '@lib/util/dom';
import type { CoverArt } from '../providers/base';
import { convertCaptions, VGMdbProvider } from '../providers/vgmdb';
import type { Seeder } from './base';
import { SeedParameters } from './parameters';

interface VGMdbCovers {
    publicCovers: CoverArt[];
    privateCovers: CoverArt[];
}

// VGMdb seeder to enqueue images that are only displayed for logged in users.
// The VGMdb provider cannot extract those, so the user needs to manually navigate
// to the release and seed the private images from there.
export const VGMdbSeeder: Seeder = {
    supportedDomains: ['vgmdb.net'],
    supportedRegexes: [/\/album\/(\d+)(?:\/|#|\?|$)/],

    insertSeedLinks(): void {
        if (!isLoggedIn()) {
            return;
        }

        const coverHeading = qsMaybe('#covernav')?.parentElement;
        if (!coverHeading) {
            LOGGER.info('No covers in release, not inserting seeding menu');
            return;
        }

        const releaseIdsProm = getMBReleases();
        const coversProm = extractCovers(coverHeading);

        Promise.all([releaseIdsProm, coversProm]).then(([releaseIds, covers]) => {
            insertSeedButtons(coverHeading, releaseIds, covers);
        });
    }
};

function isLoggedIn(): boolean {
    return qsMaybe('#navmember') !== null;
}

function getMBReleases(): Promise<string[]> {
    // Account for possibility that we're on HTTPS, remove any query params
    // or hash.
    const releaseUrl = 'https://vgmdb.net' + document.location.pathname;
    return getReleaseIDsForURL(releaseUrl);
}

async function extractCovers(coverHeading: Element): Promise<VGMdbCovers> {
    const coverDiv = coverHeading.parentElement;
    assertHasValue(coverDiv);
    const coverElements = qsa<HTMLAnchorElement>('#cover_gallery a[id*="thumb_"]', coverDiv);
    const covers = coverElements.map(extractCoverFromAnchor);

    // Split the extracted covers into public and private, to provide the option
    // to seed only private covers.
    const publicCoverURLs = new Set((await new VGMdbProvider().findImages(new URL(document.location.href)))
        .map((cover) => cover.url.href));
    const result: VGMdbCovers = {
        publicCovers: [],
        privateCovers: [],
    };

    for (const cover of covers) {
        if (publicCoverURLs.has(cover.url.href)) {
            result.publicCovers.push(cover);
        } else {
            result.privateCovers.push(cover);
        }
    }

    return result;
}

function extractCoverFromAnchor(anchor: HTMLAnchorElement): CoverArt {
    return convertCaptions({
        url: anchor.href,
        caption: qs('.label', anchor).textContent ?? '',
    });
}

function insertSeedButtons(coverHeading: Element, releaseIds: string[], covers: VGMdbCovers): void {
    const seedParamsPrivate = new SeedParameters(covers.privateCovers, document.location.href);
    const seedParamsAll = new SeedParameters(covers.publicCovers.concat(covers.privateCovers), document.location.href);

    const relIdToAnchors = new Map(releaseIds.map((relId) => {
        const a = <a
            href={ seedParamsPrivate.createSeedURL(relId) }
            target='_blank'
            style={{ display: 'block' }}
        >
            { 'Seed covers to ' + relId.split('-')[0] }
        </a> as HTMLAnchorElement;
        return [relId, a];
    }));
    const anchors = [...relIdToAnchors.values()];

    const inclPublicCheckbox = <input
        type='checkbox'
        id='ROpdebee_incl_public_checkbox'
        onChange={(evt): void => {
            relIdToAnchors.forEach((a, relId) => {
                if (evt.currentTarget.checked) {
                    a.href = seedParamsAll.createSeedURL(relId);
                } else {
                    a.href = seedParamsPrivate.createSeedURL(relId);
                }
            });
        }}
    />;
    const inclPublicLabel = <label
        htmlFor='ROpdebee_incl_public_checkbox'
        title='Leave this unchecked to only seed covers which cannot be extracted by the VGMdb provider'
        style={{ cursor: 'help' }}
    >Include publicly accessible covers</label>;

    const containedElements = [inclPublicCheckbox, inclPublicLabel].concat(anchors);
    if (!anchors.length) {
        containedElements.push(<span style={{ display: 'block'}}>
            This album is not linked to any MusicBrainz releases!
        </span>);
    }

    const container = <div
        style={{ padding: '8px 8px 0px 8px', fontSize: '8pt' }}
    >
        {containedElements}
    </div>;

    coverHeading.nextElementSibling?.insertAdjacentElement('afterbegin', container);
}
