// Interface to maxurl

import { LOGGER } from '@lib/logging/logger';
import { retryTimes } from '@lib/util/async';
import { DispatchMap } from '@lib/util/domain_dispatch';
import { urlBasename } from '@lib/util/urls';
import type { GMxmlHttpRequest } from '@lib/compat';
import { DiscogsProvider } from './providers/discogs';

interface maxurlOptions {
    /**
     * If set to false, it will return only the URL if there aren't any special properties.
     * Recommended to keep true.
     *
     * The only reason this option exists is as a small hack for a helper userscript used to find new rules,
     * to check if IMU already supports a rule.
     */
    fill_object?: boolean;

    /**
     * Maximum amount of times it should be run.
     * Recommended to be at least 5.
     */
    iterations?: number;

    /**
     * Whether or not to store to, and use an internal cache for URLs.
     * Set this to `"read"`` if you want to use the cache without storing results to it.
     */
    use_cache?: boolean | 'read';

    /**
     * Timeout (in seconds) for cache entries in the URL cache.
     */
    urlcache_time?: number;

    /**
     * List of "problems" (such as watermarks or possibly broken image) to exclude.
     *
     * By default, all problems are excluded.
     * You can access the excluded problems through `maximage.default_options.exclude_problems`
     * By setting it to `[]`, no problems will be excluded.
     */
    exclude_problems?: string[];

    /** Whether or not to exclude videos. */
    exclude_videos?: boolean;

    /**
     * This will include a "history" of objects found through iterations.
     * Disabling this will only keep the objects found through the last successful iteration.
     */
    include_pastobjs?: boolean;

    /**
     * This will try to find the original page for an image, even if it requires extra requests.
     */
    force_page?: boolean;

    /**
     * This allows rules that use 3rd-party websites to find larger images.
     */
    allow_thirdparty?: boolean;

    /**
     * This is useful for implementing a blacklist or whitelist.
     * If unspecified, it accepts all URLs.
     */
    filter?: (url: string) => boolean;

    /**
     * Helper function to perform HTTP requests, used for sites like Flickr.
     *
     * The API is expected to be like `GM_xmlHTTPRequest`'s API.
     * An implementation using node's request module can be found in `reddit-bot/dourl.js`.
     */
    do_request?: typeof GMxmlHttpRequest;
    /** Callback. */
    cb?: (result: maxurlResult[]) => void;
}

export interface maxurlResult {
  /** The URL of the image. */
  url: string;

  /** Whether or not this URL is a video. */
  video: boolean;

  /**
   * Whether it's expected that it will always work or not.
   *
   * Don't rely on this value if you don't have to.
   */
  always_ok: boolean;

  /** Whether or not the URL is likely to work. */
  likely_broken: boolean;

  /** Whether or not the server supports a HEAD request. */
  can_head: boolean;

  /** HEAD errors that can be ignored. */
  head_ok_errors: number[];

  /** Whether or not the server might return the wrong Content-Type header in the HEAD request. */
  head_wrong_contenttype: boolean;

  /** Whether or not the server might return the wrong Content-Length header in the HEAD request. */
  head_wrong_contentlength: boolean;

  /**
   * This is used in the return value of the exported function.
   * If you're using a callback (as shown in the code example above),
   * this value will always be false.
   */
  waiting: boolean;

  /** Whether or not the returned URL is expected to redirect to another URL. */
  redirects: boolean;

  /** Whether or not the URL is temporary/only works on the current IP (such as a generated download link). */
  is_private: boolean;

  /** Whether or not the URL is expected to be the original image stored on the website's servers. */
  is_original: boolean;

  /** If this is true, you shouldn't input this URL again into IMU. */
  norecurse: boolean;

  /**
   * Whether or not this URL should be used.
   * If `true`, treat this like a 404.
   * If `"mask"`, this image is an overlayed mask.
   */
  bad: boolean | 'mask';

  /**
   * Same as above, but contains a list of objects, e.g.:
   * ```javascript
   * [{
   *    headers: {"Content-Length": "1000"},
   *    status: 301
   * }]
   * ```
   *
   * If one of the objects matches the response, it's a bad image.
   * You can use `maximage.check_bad_if(bad_if, resp)` to check.
   * (`resp` is expected to be an XHR-like object).
   */
  bad_if: Array<Record<string, unknown>>;

  /**
   * Whether or not this URL is a "fake" URL that was used internally (i.e. if true, don't use this).
   */
  fake: boolean;

  /**
   * Headers required to view the returned URL.
   * If a header is `null`, don't include that header.
   */
  headers: Record<string, string>;

  /** Additional properties that could be useful. */
  extra: {
    /** The original page where this image was hosted. */
    page?: string;

    /** The title/caption attached to the image. */
    caption?: string;
  };

  /** If set, this is a more descriptive filename for the image. */
  filename: string;

  /** A list of problems with this image. Use `exclude_problems` to exclude images with specific problems. */
  problems: {
    /** If true, the image is likely larger than the one inputted, but it also has a watermark (when the inputted one doesn't). */
    watermark: boolean;

    /** If true, the image is likely smaller than the one inputted, but it has no watermark. */
    smaller: boolean;

    /** If true, the image might be entirely different from the one inputted. */
    possibly_different: boolean;

    /** If true, the image might be broken (such as GIFs on Tumblr). */
    possibly_broken: boolean;
  };
}

export interface maxurlInterface {
    (url: string, options: maxurlOptions): void;

    check_bad_if(badif: Array<Record<string, unknown>>, resp: XMLHttpRequestResponseType): boolean;
    default_options: maxurlOptions;
    is_internet_url(url: string): boolean;
    clear_caches(): void;
    // loop: any
}

declare const $$IMU_EXPORT$$: maxurlInterface;


// IMU does its initialisation synchronously, and it's loaded before the
// userscript is executed, so $$IMU_EXPORT$$ should already exist now. However,
// it does not exist in tests, and we can't straightforwardly inject this variable
// without importing the module, thereby dereferencing it.
function maxurl(url: string, options: maxurlOptions): Promise<void> {
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
