// Interface to maxurl

import { LOGGER } from '@lib/logging/logger';
import { retryTimes } from '@lib/util/async';
import { DispatchMap } from '@lib/util/domain_dispatch';
import { urlBasename } from '@lib/util/urls';
import { DiscogsProvider } from './providers/discogs';

// IMU does its initialisation synchronously, and it's loaded before the
// userscript is executed, so $$IMU_EXPORT$$ should already exist now. However,
// it does not exist in tests, and we can't straightforwardly inject this variable
// without importing the module, thereby dereferencing it.
export /* for tests */ function maxurl(url: string, options: maxurlOptions): Promise<void> {
    // In environments with GM.* APIs, the GM.getValue and GM.setValue functions
    // are asynchronous, leading to IMU defining its exports asynchronously too.
    // We can't await that, unfortunately. This is only really an issue when
    // processing seeding parameters, when user interaction is required, it'll
    // probably already be loaded.
    return retryTimes(() => {
        $$IMU_EXPORT$$(url, options);
    }, 100, 500); // Pretty large number of retries, but eventually it should work.
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
    headers: Record<string, string>;
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
    const results = await new Promise<maxurlResult[]>((resolve) => {
        maxurl(smallurl.href, {
            ...options,
            cb: resolve,
        }).catch((err) => {
            LOGGER.error('Could not maximise image, maxurl unavailable?', err);
            // Just return no maximised candidates and proceed as usual.
            resolve([]);
        });
    });

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
        filename: urlBasename(fullSizeURL),
        headers: {},
    }];
});

// Apple Music
IMU_EXCEPTIONS.set('*.mzstatic.com', async (smallurl) => {
    // For Apple Music, IMU always returns a PNG, regardless of whether the
    // original source image was PNG or JPEG. We can grab the source image
    // instead. See #80.

    const results: MaximisedImage[] = [];
    for await (const imgGeneric of maximiseGeneric(smallurl)) {
        // Assume original file name is penultimate component of pathname, e.g.
        // https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/58/34/98/58349857-55bb-62ae-81d4-4a2726e33528/5060786561909.png/999999999x0w-999.png
        // Transform it to the following:
        // https://a1.mzstatic.com/us/r1000/063/Music124/v4/58/34/98/58349857-55bb-62ae-81d4-4a2726e33528/5060786561909.png
        // i.e. change domain to a1, path prefix to us/r1000/063, and drop trailing conversion name.
        // This should also work for images returned by the old iTunes API.
        const sourceUrl = new URL(imgGeneric.url);
        sourceUrl.hostname = 'a1.mzstatic.com';

        // Be a bit defensive and don't try to transform URLs which we don't recognize
        if (sourceUrl.pathname.startsWith('/image/thumb')) {
            sourceUrl.pathname = sourceUrl.pathname.replace(/^\/image\/thumb/, '/us/r1000/063');
        }
        if (sourceUrl.pathname.split('/').length === 12) {
            // Drop the trailing conversion filename
            sourceUrl.pathname = sourceUrl.pathname.split('/').slice(0, -1).join('/');
        }

        if (sourceUrl.pathname !== imgGeneric.url.pathname) {
            results.push({
                ...imgGeneric,
                url: sourceUrl,
            });
        }

        // Always return the original maximised URL as a backup, e.g. for when
        // the source image is webp.
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
