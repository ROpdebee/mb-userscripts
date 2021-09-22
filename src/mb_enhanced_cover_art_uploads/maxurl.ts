// Interface to maxurl

import { DiscogsProvider } from './providers/discogs';

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
    url: string
    filename: string
    headers: Record<string, unknown>
}

export async function* getMaxUrlCandidates(smallurl: string): AsyncIterableIterator<MaximisedImage> {
    // Workaround maxurl discogs difficulties
    if (/img\.discogs\.com\//.test(smallurl)) {
        yield getMaxUrlDiscogs(smallurl);
        return;
    }

    const p = new Promise<maxurlResult[]>((resolve) => {
        maxurl(smallurl, {
            ...options,
            cb: resolve
        });
    });
    const results = await p;

    for (let i = 0; i < results.length; i++) {
        const current = results[i];
        // Filter out results that will definitely not work
        if (current.fake || current.bad || current.likely_broken) continue;
        yield current;
    }
}

async function getMaxUrlDiscogs(smallurl: string): Promise<MaximisedImage> {
    // Workaround for maxurl returning broken links and webp images
    const fullSizeURL = await DiscogsProvider.maximiseImage(smallurl);
    return {
        url: fullSizeURL,
        filename: fullSizeURL.split('/').at(-1),
        headers: {},
    };
}
