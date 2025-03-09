import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { qs, qsa } from '@lib/util/dom';

import type { Seeder } from '../base';
import { SeedParameters } from '../parameters';

export const HarmonySeeder: Seeder = {
    supportedDomains: ['harmony.pulsewidth.org.uk'],
    supportedRegexes: [/\/release\/actions.*release_mbid=([a-f\d-]{36})/],

    insertSeedLinks(): void {
        const originUrl = new URL(document.location.href);

        // Extract the MBID from the URL parameters
        const mbid = originUrl.searchParams.get('release_mbid');
        if (!mbid) {
            LOGGER.error('Release MBID not found in URL.');
            return;
        }

        // Use a cached link as the origin instead of the page URL itself,
        // so that we link to the state at the time the image was submitted.
        if (!originUrl.searchParams.has('ts')) {
            // It is safe to use the current time if we don't have a permalink already.
            const cacheTimestamp = Math.floor(Date.now() / 1000);
            originUrl.searchParams.set('ts', cacheTimestamp.toString());
        }
        addSeedLinksToCovers(mbid, originUrl.href);
    },
};

function addSeedLinksToCovers(mbid: string, origin: string): void {
    // Find cover image elements on the page
    const covers = qsa<HTMLElement>('figure.cover-image');

    if (covers.length === 0) {
        LOGGER.warn('No cover images found on the page.');
        return;
    }

    for (const coverElement of covers) {
        addSeedLinkToCover(coverElement, mbid, origin);
    }
}

function addSeedLinkToCover(coverElement: HTMLElement, mbid: string, origin: string): void {
    const imageUrl = qs<HTMLImageElement>('img', coverElement).src;

    const parameters = new SeedParameters([{
        url: new URL(imageUrl),
        types: [ArtworkTypeIDs.Front],
    }], origin);

    const seedUrl = parameters.createSeedURL(mbid);

    const seedLink = (
        <a className="label" href={seedUrl}>
            + Add Cover Art
        </a>
    );

    // Append the link to the cover container
    qs<HTMLElement>('figcaption', coverElement)
        .insertAdjacentElement('beforeend', seedLink);
}
