import { LOGGER } from '@lib/logging/logger';
import { getReleaseIDsForURL } from '@lib/MB/urls';
import { qs, qsMaybe } from '@lib/util/dom';

import type { CoverArt } from '../types';
import type { Seeder } from './base';
import { VGMdbProvider } from '../providers/vgmdb';
import { SeedParameters } from './parameters';

interface VGMdbCovers {
    allCovers: CoverArt[];
    privateCovers: CoverArt[];
}

// VGMdb seeder to enqueue images that are only displayed for logged in users.
// The VGMdb provider cannot extract those, so the user needs to manually navigate
// to the release and seed the private images from there.
export const VGMdbSeeder: Seeder = {
    supportedDomains: ['vgmdb.net'],
    supportedRegexes: [/\/album\/(\d+)(?:\/|#|\?|$)/],

    async insertSeedLinks(): Promise<void> {
        if (!isLoggedIn()) {
            return;
        }

        const coverHeading = qsMaybe('#covernav')?.parentElement;
        if (!coverHeading) {
            LOGGER.info('No covers in release, not inserting seeding menu');
            return;
        }

        const releaseIdsProm = getMBReleases();
        const coversProm = extractCovers();

        // Load in parallel
        try {
            const [releaseIds, covers] = await Promise.all([releaseIdsProm, coversProm]);
            insertSeedButtons(coverHeading, releaseIds, covers);
        } catch (error) {
            LOGGER.error('Failed to insert seed links', error);
        }
    },
};

function isLoggedIn(): boolean {
    return qsMaybe('#navmember') !== null;
}

function getMBReleases(): Promise<string[]> {
    // Account for possibility that we're on HTTP, remove any query params
    // or hash.
    const releaseUrl = 'https://vgmdb.net' + document.location.pathname;
    return getReleaseIDsForURL(releaseUrl);
}

async function extractCovers(): Promise<VGMdbCovers> {
    const covers = VGMdbProvider.extractCoversFromDOMGallery(qs('#cover_gallery'));

    // Split the extracted covers into public and private, to provide the option
    // to seed only private covers.
    const publicCovers = await new VGMdbProvider().findImagesWithApi(new URL(document.location.href));
    const publicCoverURLs = new Set(publicCovers.map((cover) => cover.url.href));
    const result: VGMdbCovers = {
        allCovers: covers,
        privateCovers: covers.filter((cover) => !publicCoverURLs.has(cover.url.href)),
    };

    return result;
}

function insertSeedButtons(coverHeading: Element, releaseIds: string[], covers: VGMdbCovers): void {
    const seedParametersPrivate = new SeedParameters(covers.privateCovers, document.location.href);
    const seedParametersAll = new SeedParameters(covers.allCovers, document.location.href);

    const releaseIdToAnchors = new Map(releaseIds.map((releaseId) => {
        const a = <a
            href={seedParametersPrivate.createSeedURL(releaseId)}
            target='_blank'
            rel='noopener noreferrer'
            style={{ display: 'block' }}
        >
            {'Seed covers to ' + releaseId.split('-')[0]}
        </a> as HTMLAnchorElement;
        return [releaseId, a];
    }));
    const anchors = [...releaseIdToAnchors.values()];

    const inclPublicCheckbox = <input
        type='checkbox'
        id='ROpdebee_incl_public_checkbox'
        onChange={(event_): void => {
            for (const [releaseId, a] of releaseIdToAnchors.entries()) {
                const seedParameters = event_.currentTarget.checked ? seedParametersAll : seedParametersPrivate;
                a.href = seedParameters.createSeedURL(releaseId);
            }
        }}
    />;
    const inclPublicLabel = <label
        htmlFor='ROpdebee_incl_public_checkbox'
        title='Leave this unchecked to only seed covers which cannot be extracted by the VGMdb provider'
        style={{ cursor: 'help' }}
    >Include publicly accessible covers</label>;

    const containedElements = [inclPublicCheckbox, inclPublicLabel, ...anchors];
    if (anchors.length === 0) {
        containedElements.push(<span style={{ display: 'block' }}>
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
