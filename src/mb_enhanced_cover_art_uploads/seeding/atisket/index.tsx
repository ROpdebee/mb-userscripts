import { LOGGER } from '@lib/logging/logger';
import { logFailure } from '@lib/util/async';
import { qs, qsa, qsMaybe } from '@lib/util/dom';

import type { Seeder } from '../base';
import { SeedParameters } from '../parameters';
import { AtisketImage } from './dimensions';

// For main page after search but before adding
export const AtisketSeeder: Seeder = {
    supportedDomains: ['atisket.pulsewidth.org.uk', 'etc.marlonob.info'],
    supportedRegexes: [/(?:\.uk|\.info\/atisket)\/\?.+/],

    insertSeedLinks(): void {
        const alreadyInMB = qsMaybe('.already-in-mb-item');
        if (alreadyInMB === null) {
            return;
        }
        const mbid = encodeURIComponent(qs<HTMLAnchorElement>('a.mb', alreadyInMB).textContent?.trim() ?? '');

        // Try to use the cached link as the origin instead of the page URL itself,
        // so that we link to the state at the time the image was submitted.
        // If the cached link doesn't exist on the page, we're probably already
        // on a cached page, so fall back on the page URL instead.
        const cachedAnchor = qsMaybe<HTMLAnchorElement>('#submit-button + div > a');
        addSeedLinkToCovers(mbid, cachedAnchor?.href ?? document.location.href);
    },
};

// For post-add page with complementary links
export const AtasketSeeder: Seeder = {
    supportedDomains: ['atisket.pulsewidth.org.uk', 'etc.marlonob.info'],
    supportedRegexes: [/(?:\.uk|\.info\/atisket)\/atasket\.php\?/],

    insertSeedLinks(): void {
        const urlParams = new URLSearchParams(document.location.search);
        const mbid = urlParams.get('release_mbid');
        const selfId = urlParams.get('self_id');
        if (!mbid || !selfId) {
            LOGGER.error('Cannot extract IDs! Seeding is disabled :(');
            return;
        }

        // For atasket links, we'll also use the cached URL as origin for the
        // same reasons as above.
        const cachedUrl = document.location.origin + '/?cached=' + selfId;
        addSeedLinkToCovers(mbid, cachedUrl);
    },
};

function addSeedLinkToCovers(mbid: string, origin: string): void {
    const covers = qsa<HTMLElement>('figure.cover');
    for (const fig of covers) {
        addSeedLinkToCover(fig, mbid, origin);
        logFailure(addDimensions(fig), 'Failed to insert image information');
    }
}

function tryExtractReleaseUrl(fig: HTMLElement): string | undefined {
    const countryCode = fig.closest('div')?.dataset.matchedCountry;
    const vendorId = fig.dataset.vendorId;
    const vendorCode = [...fig.classList]
        .find((klass) => ['spf', 'deez', 'itu'].includes(klass));
    // Vendor code and ID are required, but we only need a non-empty country code for Apple Music/iTunes releases
    if (!vendorCode || !vendorId || typeof countryCode !== 'string' || (vendorCode === 'itu' && countryCode === '')) {
        LOGGER.error('Could not extract required data for ' + fig.classList.value);
        return;
    }

    return RELEASE_URL_CONSTRUCTORS[vendorCode](vendorId, countryCode);
}

function addSeedLinkToCover(fig: HTMLElement, mbid: string, origin: string): void {
    const imageUrl = qs<HTMLAnchorElement>('a.icon', fig).href;

    // On atj's mirror, we'll seed the release URLs, instead of the images
    // directly. This will allow us to e.g. extract additional images for the
    // release, or handle some maximisations exceptions (e.g. Apple Music).
    // On marlonob's version, we cannot do this, since the required information
    // is not necessarily present.
    const realUrl = tryExtractReleaseUrl(fig) ?? imageUrl;

    const params = new SeedParameters([{
        url: new URL(realUrl),
    }], origin);
    const seedUrl = params.createSeedURL(mbid);

    const seedLink = <a href={seedUrl} style={{ display: 'block' }}>
        Add to release
    </a>;

    // The way in which we're adding the seed link here and the dimensions span
    // below should lead to a consistent ordering of elements.
    qs<HTMLElement>('figcaption', fig)
        .insertAdjacentElement('beforeend', seedLink);
}

async function addDimensions(fig: HTMLElement): Promise<void> {
    const imageUrl = qs<HTMLAnchorElement>('a.icon', fig).href;
    const imageInfo = await new AtisketImage(imageUrl).getImageInfo();

    const infoStringParts = [
        imageInfo.dimensions ? `${imageInfo.dimensions.width}x${imageInfo.dimensions.height}` : '',
        imageInfo.fileType,
    ];
    const infoString = infoStringParts.filter(Boolean).join(', ');

    if (!infoString) return;

    const dimSpan = <span style={{ display: 'block' }}>
        {infoString}
    </span>;

    qs<HTMLElement>('figcaption > a', fig).insertAdjacentElement('afterend', dimSpan);
}

const RELEASE_URL_CONSTRUCTORS: Record<string, (id: string, country: string) => string> = {
    itu: (id, country) => `https://music.apple.com/${country.toLowerCase()}/album/${id}`,
    deez: (id) => 'https://www.deezer.com/album/' + id,
    spf: (id) => 'https://open.spotify.com/album/' + id,
};