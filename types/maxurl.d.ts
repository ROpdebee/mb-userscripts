interface maxurlOptions {
    // If set to false, it will return only the URL if there aren't any special properties
    // Recommended to keep true.
    //
    // The only reason this option exists is as a small hack for a helper userscript used to find new rules,
    //  to check if IMU already supports a rule.
    fill_object?: boolean

    // Maximum amount of times it should be run.
    // Recommended to be at least 5.
    iterations?: number

    // Whether or not to store to, and use an internal cache for URLs.
    // Set this to "read" if you want to use the cache without storing results to it.
    use_cache?: boolean

    // Timeout (in seconds) for cache entries in the URL cache
    urlcache_time?: number

    // List of "problems" (such as watermarks or possibly broken image) to exclude.
    //
    // By default, all problems are excluded.
    // You can access the excluded problems through maximage.default_options.exclude_problems
    // By setting it to [], no problems will be excluded.
    exclude_problems?: string[]

    // Whether or not to exclude videos
    exclude_videos?: boolean

    // This will include a "history" of objects found through iterations.
    // Disabling this will only keep the objects found through the last successful iteration.
    include_pastobjs?: boolean

    // This will try to find the original page for an image, even if it requires extra requests.
    force_page?: boolean

    // This allows rules that use 3rd-party websites to find larger images
    allow_thirdparty?: boolean

    // This is useful for implementing a blacklist or whitelist.
    //  If unspecified, it accepts all URLs.
    filter?: (url: string) => boolean

    // Helper function to perform HTTP requests, used for sites like Flickr
    //  The API is expected to be like GM_xmlHTTPRequest's API.
    // An implementation using node's request module can be found in reddit-bot/dourl.js
    do_request?: (options: GMXMLHttpRequestOptions) => void
    // Callback
    cb?: (result: maxurlResult[]) => void
}

interface maxurlResult {
  // The URL of the image
  url: string

  // Whether or not this URL is a video
  video: boolean

  // Whether it's expected that it will always work or not.
  //  Don't rely on this value if you don't have to
  always_ok: boolean

  // Whether or not the URL is likely to work.
  likely_broken: boolean

  // Whether or not the server supports a HEAD request.
  can_head: boolean

  // HEAD errors that can be ignored
  head_ok_errors: number[]

  // Whether or not the server might return the wrong Content-Type header in the HEAD request
  head_wrong_contenttype: boolean

  // Whether or not the server might return the wrong Content-Length header in the HEAD request
  head_wrong_contentlength: boolean

  // This is used in the return value of the exported function.
  //  If you're using a callback (as shown in the code example above),
  //  this value will always be false
  waiting: boolean

  // Whether or not the returned URL is expected to redirect to another URL
  redirects: boolean

  // Whether or not the URL is temporary/only works on the current IP (such as a generated download link)
  is_private: boolean

  // Whether or not the URL is expected to be the original image stored on the website's servers.
  is_original: boolean

  // If this is true, you shouldn't input this URL again into IMU.
  norecurse: boolean

  // Whether or not this URL should be used.
  // If true, treat this like a 404
  // If "mask", this image is an overlayed mask
  bad: boolean | 'mask'

  // Same as above, but contains a list of objects, e.g.:
  // [{
  //    headers: {"Content-Length": "1000"},
  //    status: 301
  // }]
  // If one of the objects matches the response, it's a bad image.
  // You can use maximage.check_bad_if(bad_if, resp) to check.
  //  (resp is expected to be an XHR-like object)
  bad_if: Array<Record<string, unknown>>

  // Whether or not this URL is a "fake" URL that was used internally (i.e. if true, don't use this)
  fake: boolean

  // Headers required to view the returned URL
  //  If a header is null, don't include that header.
  headers: Record<string, unknown>

  // Additional properties that could be useful
  extra: {
    // The original page where this image was hosted
    page?: string

    // The title/caption attached to the image
    caption?: string
  }

  // If set, this is a more descriptive filename for the image
  filename: string

  // A list of problems with this image. Use exclude_problems to exclude images with specific problems
  problems: {
    // If true, the image is likely larger than the one inputted, but it also has a watermark (when the inputted one doesn't)
    watermark: boolean

    // If true, the image is likely smaller than the one inputted, but it has no watermark
    smaller: boolean

    // If true, the image might be entirely different from the one inputted
    possibly_different: boolean

    // If true, the image might be broken (such as GIFs on Tumblr)
    possibly_broken: boolean
  }
}

interface maxurl {
    (url: string, options: maxurlOptions): void

    check_bad_if(badif: Array<Record<string, unknown>>, resp: XMLHttpRequestResponseType): boolean
    default_options: maxurlOptions
    is_internet_url(url: string): boolean
    clear_caches(): void
    // loop: any
}

declare const $$IMU_EXPORT$$: maxurl;
