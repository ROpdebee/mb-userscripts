import type { ImageInfo } from '@src/mb_caa_dimensions/ImageInfo';
import { LOGGER } from '@lib/logging/logger';
import { logFailure } from '@lib/util/async';
import { qs, qsa, qsMaybe } from '@lib/util/dom';
import { formatFileSize } from '@lib/util/format';
import { getMaximisedCandidates } from '@src/mb_enhanced_cover_art_uploads/maximise';

import type { Seeder } from '../base';
import { SeedParameters } from '../parameters';
import { AtisketImage } from './dimensions';

// For main page after search but before adding
export const AtisketSeeder: Seeder = {
    supportedDomains: ['atisket.pulsewidth.org.uk', 'etc.marlonob.info'],
    supportedRegexes: [/(?:\.uk|\.info\/atisket)\/\?.+/],

    insertSeedLinks(): void {
        addDimensionsToCovers();

        const alreadyInMBItems = qsa('.already-in-mb-item');
        // If a-tisket doesn't report a release as already existing, we can't
        // know a potential MBID and we can't add a seed link.
        if (alreadyInMBItems.length === 0) {
            return;
        }

        const mbids = alreadyInMBItems
            .map((alreadyInMB) => encodeURIComponent(qs<HTMLAnchorElement>('a.mb', alreadyInMB).textContent?.trim() ?? ''))
            .filter(Boolean);

        // Try to use the cached link as the origin instead of the page URL itself,
        // so that we link to the state at the time the image was submitted.
        // If the cached link doesn't exist on the page, we're probably already
        // on a cached page, so fall back on the page URL instead.
        const cachedAnchor = qsMaybe<HTMLAnchorElement>('#submit-button + div > a');
        addSeedLinkToCovers(mbids, cachedAnchor?.href ?? document.location.href);
    },
};

// For post-add page with complementary links
export const AtasketSeeder: Seeder = {
    supportedDomains: ['atisket.pulsewidth.org.uk', 'etc.marlonob.info'],
    supportedRegexes: [/(?:\.uk|\.info\/atisket)\/atasket\.php\?/],

    insertSeedLinks(): void {
        addDimensionsToCovers();

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
        addSeedLinkToCovers([mbid], cachedUrl);
    },
};

function addSeedLinkToCovers(mbids: string[], origin: string): void {
    const covers = qsa<HTMLElement>('figure.cover');
    for (const fig of covers) {
        addSeedLinkToCover(fig, mbids, origin);
    }
}

function addDimensionsToCovers(): void {
    const covers = qsa<HTMLElement>('figure.cover');
    for (const fig of covers) {
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

function addSeedLinkToCover(fig: HTMLElement, mbids: string[], origin: string): void {
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

    for (const mbid of mbids) {
        const seedUrl = params.createSeedURL(mbid);

        // Include part of the release ID if there are multiple.
        const seedLink = <a href={seedUrl} style={{ display: 'block' }}>
            Add to release {mbids.length > 1 ? mbid.split('-')[0] : ''}
        </a>;

        // The way in which we're adding the seed link here and the dimensions span
        // below should lead to a consistent ordering of elements.
        qs<HTMLElement>('figcaption', fig)
            .insertAdjacentElement('beforeend', seedLink);
    }
}

async function addDimensions(fig: HTMLElement): Promise<void> {
    const imageUrl = qs<HTMLAnchorElement>('a.icon', fig).href;
    const dimSpan = <span style={{ display: 'block' }}>
        loading…
    </span>;
    qs<HTMLElement>('figcaption > a', fig).insertAdjacentElement('afterend', dimSpan);

    const imageInfo = await getImageInfo(imageUrl);

    const infoStringParts = [
        imageInfo.dimensions ? `${imageInfo.dimensions.width}x${imageInfo.dimensions.height}` : '',
        imageInfo.size !== undefined ? formatFileSize(imageInfo.size) : '',
        imageInfo.fileType,
    ];
    const infoString = infoStringParts.filter(Boolean).join(', ');

    if (infoString) {
        dimSpan.textContent = infoString;
    } else {
        dimSpan.remove();
    }
}

async function getImageInfo(imageUrl: string): Promise<ImageInfo> {
    // Try maximising the image
    for await (const maxCandidate of getMaximisedCandidates(new URL(imageUrl))) {
        // Skip likely broken images. Happens on Apple Music images a lot as the
        // first candidate.
        if (maxCandidate.likely_broken) continue;

        LOGGER.debug(`Trying to get image information for maximised candidate ${maxCandidate.url}`);
        const atisketImage = new AtisketImage(maxCandidate.url.toString());
        // Query dimensions and file info separately, don't use `Image#getImageInfo`
        // since it resolves even if both queries fail. We're dealing with images
        // that may not exist, so instead we'll call both parts separately and
        // check their output.

        // Load file info first, and skip loading dimensions if file info failed.
        // File info does a HEAD request and fails immediately on 404, dimensions
        // will retry on 404, which would be wasteful.
        const fileInfo = await atisketImage.getFileInfo();
        const dimensions = fileInfo && await atisketImage.getDimensions();
        if (!dimensions) {
            LOGGER.warn(`Failed to load dimensions for maximised candidate ${maxCandidate.url}`);
            continue;
        }

        return {
            dimensions,
            ...fileInfo,
        };
    }

    // Fall back on original URL. Using `Image#getImageInfo` is fine here.
    return new AtisketImage(imageUrl).getImageInfo();
}

const RELEASE_URL_CONSTRUCTORS: Record<string, (id: string, country: string) => string> = {
    itu: (id, country) => `https://music.apple.com/${country.toLowerCase()}/album/${id}`,
    deez: (id) => 'https://www.deezer.com/album/' + id,
    spf: (id) => 'https://open.spotify.com/album/' + id,
};
