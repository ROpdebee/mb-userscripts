// Interface to maxurl

import { DiscogsProvider } from './providers/discogs';

// IMU does its initialisation synchronously, and it's loaded before the
// userscript is executed, so this should already exist now.
const maxurl = $$IMU_EXPORT$$;

const options: maxurlOptions = {
    fill_object: true,
    exclude_videos: true,
    filter: (url) => (
        !url.toLowerCase().endsWith('.webp')
        // Blocking webp images in Discogs
        && !/:format(webp)/.test(url.toLowerCase())),
};

export interface MaximisedImage {
    url: URL
    filename: string
    headers: Record<string, unknown>
}

export async function* getMaximisedCandidates(smallurl: URL): AsyncIterableIterator<MaximisedImage> {
    // Workaround maxurl discogs difficulties
    if (smallurl.hostname === 'img.discogs.com') {
        yield getMaximisedCandidatesDiscogs(smallurl);
        return;
    }

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

async function getMaximisedCandidatesDiscogs(smallurl: URL): Promise<MaximisedImage> {
    // Workaround for maxurl returning broken links and webp images
    const fullSizeURL = await DiscogsProvider.maximiseImage(smallurl);
    return {
        url: fullSizeURL,
        filename: fullSizeURL.pathname.split('/').at(-1),
        headers: {},
    };
}
