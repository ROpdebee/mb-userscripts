// Interface to maxurl

import { DispatchMap } from '@lib/util/domain_dispatch';
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

type ExceptionFn = (smallurl: URL) => Promise<MaximisedImage[]>;
const IMU_EXCEPTIONS: DispatchMap<ExceptionFn> = new DispatchMap();

export interface MaximisedImage {
    url: URL;
    filename: string;
    headers: Record<string, unknown>;
}

export async function* getMaximisedCandidates(smallurl: URL): AsyncIterableIterator<MaximisedImage> {
    const exceptionFn = IMU_EXCEPTIONS.get(smallurl.hostname);
    if (exceptionFn) {
        yield* await exceptionFn(smallurl);
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

// Discogs
IMU_EXCEPTIONS.set('img.discogs.com', async (smallurl) => {
    // Workaround for maxurl returning broken links and webp images
    const fullSizeURL = await DiscogsProvider.maximiseImage(smallurl);
    return [{
        url: fullSizeURL,
        filename: fullSizeURL.pathname.split('/').at(-1),
        headers: {},
    }];
});

// Apple Music
IMU_EXCEPTIONS.set('*.mzstatic.com', async (smallurl) => {
    // For Apple Music, IMU always returns a PNG, regardless of whether the
    // original source image was PNG or JPEG. When the original image is a JPEG,
    // we want to fetch a JPEG version. Although the PNG is of slightly better
    // quality due to generational loss when a JPEG is re-encoded, the quality
    // loss is so minor that the additional costs of downloading, uploading,
    // and storing the PNG are unjustifiable. See #80.

    const results: MaximisedImage[] = [];
    for await (const imgGeneric of maximiseGeneric(smallurl)) {
        // Assume original file name is penultimate component of pathname, e.g.
        // https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/58/34/98/58349857-55bb-62ae-81d4-4a2726e33528/5060786561909.png/999999999x0w-999.png
        // We're still conservative though, if it's not a JPEG, we won't
        // return the JPEG version
        if (/\.jpe?g$/i.test(imgGeneric.url.pathname.split('/').at(-2))) {
            results.push({
                ...imgGeneric,
                url: new URL(imgGeneric.url.href.replace(/\.png$/i, '.jpg'))
            });
        }

        // Always return the original maximised URL as a backup
        results.push(imgGeneric);
    }

    return results;
});

// IMU has no definitions for 7digital yet, so adding an exception here as a workaround
// Upstream issue: https://github.com/qsniyg/maxurl/issues/922
IMU_EXCEPTIONS.set('artwork-cdn.7static.com', async (smallurl) => {
    // According to https://docs.7digital.com/reference#image-sizes, 800x800
    // and 500x500 aren't available on some images, so add 350 as well as a
    // backup.
    return ['800', '500', '350'].map((size) => {
        return {
            url: new URL(smallurl.href.replace(/_\d+\.jpg$/, `_${size}.jpg`)),
            filename: '',
            headers: {},
        };
    });
});
