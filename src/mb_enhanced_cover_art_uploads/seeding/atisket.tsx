import { LOGGER } from '@lib/logging/logger';
import { parseDOM, qs, qsa, qsMaybe } from '@lib/util/dom';
import { ArtworkTypeIDs } from '../providers/base';
import type { Seeder } from './base';
import { SeedParameters } from './parameters';

// For main page after search but before adding
export const AtisketSeeder: Seeder = {
    supportedDomains: ['atisket.pulsewidth.org.uk'],
    supportedRegexes: [/\.uk\/\?.+/],

    insertSeedLinks(): void {
        const alreadyInMB = qsMaybe('.already-in-mb-item');
        if (alreadyInMB === null) {
            return;
        }
        const mbid = qs<HTMLAnchorElement>('a.mb', alreadyInMB).textContent?.trim() ?? '';
        // Try to use the cached link as the origin instead of the page URL itself,
        // so that we link to the state at the time the image was submitted.
        // If the cached link doesn't exist on the page, we're probably already
        // on a cached page, so fall back on the page URL instead.
        const cachedAnchor = qsMaybe<HTMLAnchorElement>('#submit-button + div > a');
        addSeedLinkToCovers(mbid, cachedAnchor?.href ?? document.location.href, document);
    }
};

// For post-add page with complementary links
export const AtasketSeeder: Seeder = {
    supportedDomains: ['atisket.pulsewidth.org.uk'],
    supportedRegexes: [/\.uk\/atasket\.php\?/],

    insertSeedLinks(): void {
        const mbid = document.location.search.match(/[?&]release_mbid=([a-f0-9-]+)/)?.[1];
        const selfId = document.location.search.match(/[?&]self_id=([a-zA-Z0-9-]+)/)?.[1];
        if (!mbid || !selfId) {
            LOGGER.error('Cannot extract IDs! Seeding is disabled :(');
            return;
        }

        const cachedUrl = document.location.origin + '/?cached=' + selfId;

        // For atasket links, we'll also use the cached URL as origin for the
        // same reasons as above. However, we'll also retrieve the cached page
        // so that we can retrieve release URLs later on, as atasket pages
        // don't contain them. Although we could extract the ID from the self-id,
        // those don't contain the Apple Music country code.
        fetch(cachedUrl).then(async (resp) => {
            const cachedDoc = parseDOM(await resp.text());
            addSeedLinkToCovers(mbid, cachedUrl, cachedDoc);
        });
    }
};

function addSeedLinkToCovers(mbid: string, origin: string, infoDoc: Document): void {
    qsa('figure.cover').forEach((fig) => {
        addSeedLinkToCover(fig, mbid, origin, infoDoc);
    });
}

async function addSeedLinkToCover(fig: Element, mbid: string, origin: string, infoDoc: Document): Promise<void> {
    const anchor = qs<HTMLAnchorElement>('a.icon', fig);
    const imageUrl = anchor.href;

    // Not using .split('.').at(-1) here because I'm not sure whether .at is
    // polyfilled on atisket.
    const ext = imageUrl.match(/\.(\w+)$/)?.[1];
    const dimensionStr = await getImageDimensions(imageUrl);

    // We'll seed the release URLs, instead of the images directly. This will
    // allow us to e.g. extract additional images for the release, or handle
    // some maximisations exceptions (e.g. Apple Music).
    // Retrieve the URL via the classes defined on the image, they're the same.
    const classSelector = [...anchor.classList].join('.');
    // First anchor contains the release URL.
    const releaseUrl = qs<HTMLAnchorElement>(`.vendor-ids li.${classSelector} > a`, infoDoc).href;

    const params = new SeedParameters([{
        url: new URL(releaseUrl),
        types: [ArtworkTypeIDs.Front],
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

// TODO: This should probably be extracted elsewhere, it'd be useful for CAA
// dimensions. TBH CAA dimensions should operate on atisket as well.
function getImageDimensions(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // eslint-disable-next-line prefer-const, init-declarations
        let interval: number;
        let done = false;
        const img = <img
            src={url}
            onLoad={(): void => {
                clearInterval(interval);
                if (!done) {
                    resolve(`${img.naturalHeight}x${img.naturalWidth}`);
                    done = true;
                }
            }}
            onError={(): void => {
                clearInterval(interval);
                if (!done) {
                    done = true;
                    reject();
                }
            }}
        /> as HTMLImageElement;

        // onload and onerror are asynchronous, so this interval should have
        // already been set before they are called.
        interval = window.setInterval(() => {
            if (img.naturalHeight) {
                resolve(`${img.naturalHeight}x${img.naturalWidth}`);
                done = true;
                clearInterval(interval);
                img.src = '';
            }
        }, 50);
    });
}
