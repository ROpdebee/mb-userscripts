// Interface to maxurl

import type { GMxmlHttpRequest } from '@lib/compat';
import { LOGGER } from '@lib/logging/logger';
import { retryTimes } from '@lib/util/async';
import { DispatchMap } from '@lib/util/domain_dispatch';
import { urlBasename } from '@lib/util/urls';

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
const IMU_EXCEPTIONS = new DispatchMap<ExceptionFn>();

export interface MaximisedImage {
    url: URL;
    filename: string;
    headers: Record<string, string>;
    likely_broken?: boolean;
}

export async function* getMaximisedCandidates(smallurl: URL): AsyncGenerator<MaximisedImage, void, undefined> {
    const exceptionFn = IMU_EXCEPTIONS.get(smallurl.hostname);
    // Workaround for https://github.com/rpetrich/babel-plugin-transform-async-to-promises/issues/80
    // Cannot use yield*, so we'll loop over the results manually and yield all
    // of the results individually.
    // Use `exceptionFn` if it exists, otherwise maximise it as a generic image.
    const iterable = await (exceptionFn ?? maximiseGeneric)(smallurl);

    for await (const item of iterable) {
        yield item;
    }
}

async function* maximiseGeneric(smallurl: URL): AsyncIterable<MaximisedImage> {
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

    for (const maximisedResult of results) {
        // Filter out results that will definitely not work
        // FIXME: We blanket-ban videos at the moment, even though in the future
        // we may want videos (e.g. Apple Music front cover videos). Currently
        // videos aren't supported though.
        if (maximisedResult.fake || maximisedResult.bad || maximisedResult.video) continue;
        try {
            yield {
                ...maximisedResult,
                url: new URL(maximisedResult.url),
            };
        } catch {
            // pass, invalid URL
        }
    }
}

// Discogs
IMU_EXCEPTIONS.set('i.discogs.com', async (smallurl) => {
    // Workaround for maxurl returning broken links and webp images
    const fullSizeURL = await DiscogsProvider.maximiseImage(smallurl);
    return [{
        url: fullSizeURL,
        filename: DiscogsProvider.getFilenameFromUrl(smallurl),
        headers: {},
    }];
});

// Apple Music
IMU_EXCEPTIONS.set('*.mzstatic.com', async (smallurl) => {
    // For Apple Music, IMU always returns a `/source` URL first, but it may
    // not always exist. Mark such a URL as likely broken so that we don't warn
    // for those. We don't reorder the candidates to ensure we always get the
    // largest possible image.

    const results: MaximisedImage[] = [];
    const smallOriginalName = smallurl.href.match(/(?:[a-f\d]{2}\/){3}[a-f\d-]{36}\/([^/]+)/)?.[1];

    for await (const imgGeneric of maximiseGeneric(smallurl)) {
        if (urlBasename(imgGeneric.url) === 'source' && smallOriginalName !== 'source') {
            // Mark the `/source` image as likely broken if the alleged original
            // name isn't "source", but instead e.g. "20UMGIM63158.rgb.jpg".
            imgGeneric.likely_broken = true;
        }
        results.push(imgGeneric);
    }

    return results;
});

IMU_EXCEPTIONS.set('usercontent.jamendo.com', async (smallurl) => {
    return [{
        url: new URL(smallurl.href.replace(/([&?])width=\d+/, '$1width=0')),
        filename: '',
        headers: {},
    }];
});

IMU_EXCEPTIONS.set('hw-img.datpiff.com', async (smallurl) => {
    // Some sizes may be missing, so try '-large' and '-medium' first, but fall
    // back to smallest (no suffix) if neither exist.
    const urlNoSuffix = smallurl.href.replace(/-(?:large|medium)(\.\w+$)/, '$1');
    return ['-large', '-medium', ''].map((suffix) => {
        return {
            url: new URL(urlNoSuffix.replace(/\.(\w+)$/, `${suffix}.$1`)),
            filename: '',
            headers: {},
        };
    });
});
