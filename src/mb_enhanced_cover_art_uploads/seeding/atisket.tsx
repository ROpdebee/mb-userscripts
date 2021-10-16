import { LOGGER } from '@lib/logging/logger';
import { qs, qsa, qsMaybe } from '@lib/util/dom';
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
        addSeedLinkToCovers(mbid, cachedAnchor?.href ?? document.location.href);
    }
};

// For post-add page with complementary links
export const AtasketSeeder: Seeder = {
    supportedDomains: ['atisket.pulsewidth.org.uk'],
    supportedRegexes: [/\.uk\/atasket\.php\?/],

    insertSeedLinks(): void {
        const mbid = document.location.search.match(/[?&]release_mbid=([a-f0-9-]+)/)?.[1];
        if (!mbid) {
            LOGGER.error('Cannot extract MBID! Seeding is disabled :(');
            return;
        }
        addSeedLinkToCovers(mbid, document.location.href);
    }
};

function addSeedLinkToCovers(mbid: string, origin: string): void {
    qsa('figure.cover').forEach((fig) => {
        addSeedLinkToCover(fig, mbid, origin);
    });
}

async function addSeedLinkToCover(fig: Element, mbid: string, origin: string): Promise<void> {
    const url = qs<HTMLAnchorElement>('a.icon', fig).href;

    // Not using .split('.').at(-1) here because I'm not sure whether .at is
    // polyfilled on atisket.
    const ext = url.match(/\.(\w+)$/)?.[1];
    const dimensionStr = await getImageDimensions(url);

    const params = new SeedParameters([{
        url: new URL(url),
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
