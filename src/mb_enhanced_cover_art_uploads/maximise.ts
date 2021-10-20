// Interface to maxurl

import { DiscogsProvider } from './providers/discogs';

// IMU does its initialisation synchronously, and it's loaded before the
// userscript is executed, so $$IMU_EXPORT$$ should already exist now. However,
// it does not exist in tests, and we can't straightforwardly inject this variable
// without importing the module, thereby dereferencing it.
/* istanbul ignore next: mocked out */
function maxurl(url: string, options: maxurlOptions): void {
    $$IMU_EXPORT$$(url, options);
}

const options: maxurlOptions = {
    fill_object: true,
    exclude_videos: true,
    /* istanbul ignore next: Cannot test in unit tests, IMU unavailable */
    filter(url) {
        return (!url.toLowerCase().endsWith('.webp')
            // Blocking webp images in Discogs
            && !/:format(webp)/.test(url.toLowerCase()));
    },
};

export interface MaximisedImage {
    url: URL;
    filename: string;
    headers: Record<string, unknown>;
}

export async function* getMaximisedCandidates(smallurl: URL): AsyncIterableIterator<MaximisedImage> {
    const exceptions = await maximiseExceptions(smallurl);
    if (exceptions) {
        yield* exceptions;
    } else {
        yield* maximiseGeneric(smallurl);
    }
}

async function* maximiseGeneric(smallurl: URL): AsyncIterableIterator<MaximisedImage> {
    const p = new Promise<maxurlResult[]>((resolve) => {
        maxurl(smallurl.href, {
            ...options,
            cb: resolve
        });
    });
    const results = await p;

    for (let i = 0; i < results.length; i++) {
        const current = results[i];
        // Filter out results that will definitely not work
        if (current.fake || current.bad || current.likely_broken) continue;
        try {
            yield {
                ...current,
                url: new URL(current.url),
            };
        } catch {
            // pass, invalid URL
        }
    }
}

async function maximiseExceptions(smallurl: URL): Promise<MaximisedImage[] | undefined> {
    // Various workarounds for certain image providers
    if (smallurl.hostname === 'img.discogs.com') {
        return maximiseDiscogs(smallurl);
    }

    return;
}

async function maximiseDiscogs(smallurl: URL): Promise<MaximisedImage[]> {
    // Workaround for maxurl returning broken links and webp images
    const fullSizeURL = await DiscogsProvider.maximiseImage(smallurl);
    return [{
        url: fullSizeURL,
        filename: fullSizeURL.pathname.split('/').at(-1),
        headers: {},
    }];
}
