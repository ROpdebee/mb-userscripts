import { LOGGER } from '@lib/logging/logger';
import { qs, qsa, qsMaybe } from '@lib/util/dom';

import type { Seeder } from './base';
import { getImageDimensions } from '../image_dimensions';
import { SeedParameters } from './parameters';

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
    const covers = qsa('figure.cover');
    Promise.all(covers.map((fig) => addSeedLinkToCover(fig, mbid, origin)))
        .catch((err) => {
            LOGGER.error('Failed to add seed links to some cover art', err);
        });
}

function tryExtractReleaseUrl(fig: Element): string | undefined {
    const countryCode = fig.closest('div')?.getAttribute('data-matched-country');
    const vendorId = fig.getAttribute('data-vendor-id');
    const vendorCode = [...fig.classList]
        .find((klass) => ['spf', 'deez', 'itu'].includes(klass));
    // Vendor code and ID are required, but we only need a non-empty country code for Apple Music/iTunes releases
    if (!vendorCode || !vendorId || typeof countryCode !== 'string' || (vendorCode === 'itu' && countryCode === '')) {
        LOGGER.error('Could not extract required data for ' + fig.classList.value);
        return;
    }

    return RELEASE_URL_CONSTRUCTORS[vendorCode](vendorId, countryCode);
}

async function addSeedLinkToCover(fig: Element, mbid: string, origin: string): Promise<void> {
    const imageUrl = qs<HTMLAnchorElement>('a.icon', fig).href;

    // Not using .split('.') here because Spotify images do not have an extension.
    const ext = imageUrl.match(/\.(\w+)$/)?.[1];
    const imageDimensions = await getImageDimensions(imageUrl);
    const dimensionStr = `${imageDimensions.width}x${imageDimensions.height}`;

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

    const dimSpan = <span style={{ display: 'block' }}>
        {dimensionStr + (ext ? ` ${ext.toUpperCase()}` : '')}
    </span>;
    const seedLink = <a href={seedUrl} style={{ display: 'block' }}>
        Add to release
    </a>;
    qs<HTMLElement>('figcaption > a', fig)
        .insertAdjacentElement('afterend', dimSpan)
        ?.insertAdjacentElement('afterend', seedLink);
}

const RELEASE_URL_CONSTRUCTORS: Record<string, (id: string, country: string) => string> = {
    itu: (id, country) => `https://music.apple.com/${country.toLowerCase()}/album/${id}`,
    deez: (id) => 'https://www.deezer.com/album/' + id,
    spf: (id) => 'https://open.spotify.com/album/' + id,
};
