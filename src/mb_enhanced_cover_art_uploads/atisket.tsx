import { qs, qsa, qsMaybe } from '../lib/util/dom';

export function addAtisketSeedLinks(): void {
    const dispatch: Record<string, (() => void) | undefined> = {
        '/atasket.php': addOnComplementaryPage,
        '/': addOnOverviewPage,
    };

    const adder = dispatch[document.location.pathname];
    if (adder) {
        adder();
    } else {
        console.error('Unsupported page for CAA URL upload seeder!');
    }
}

function addOnComplementaryPage(): void {
    const mbid = document.location.search.match(/[?&]release_mbid=([a-f0-9-]+)/)?.[1];
    if (!mbid) {
        console.error('Cannot figure out MBID :(');
        return;
    }
    addSeedLinkToCovers(mbid);
}

function addOnOverviewPage(): void {
    const alreadyInMB = qsMaybe('.already-in-mb-item');
    if (alreadyInMB === null) {
        return;
    }

    addSeedLinkToCovers(qs<HTMLAnchorElement>('a.mb', alreadyInMB).innerText.trim());
}

function addSeedLinkToCovers(mbid: string): void {
    qsa('figure.cover').forEach((fig) => { addSeedLinkToCover(fig, mbid); });
}

async function addSeedLinkToCover(fig: Element, mbid: string): Promise<void> {
    const url = qs<HTMLAnchorElement>('a.icon', fig).href;

    // Not using .split('.').at(-1) here because I'm not sure whether .at is
    // polyfilled on atisket.
    const ext = url.match(/\.(\w+)$/)?.[1];
    const dimensionStr = await getImageDimensions(url);

    const seedUrl = `https://musicbrainz.org/release/${mbid}/add-cover-art#artwork_url=${encodeURIComponent(url)}&origin=atisket&artwork_type=Front`;
    // Reverse order of insertion.
    qs<HTMLElement>('figcaption > a', fig).insertAdjacentElement('afterend',
        <a href={seedUrl} style={{ display: 'block' }}>
            Add to release
        </a>);
    qs<HTMLElement>('figcaption > a', fig).insertAdjacentElement('afterend',
        <span style={{ display: 'block' }}>
            {dimensionStr + (ext ? ` ${ext.toUpperCase()}` : '')}
        </span>);
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
