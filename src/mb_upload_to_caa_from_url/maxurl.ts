// Interface to maxurl

const maxurl = $$IMU_EXPORT$$;

const options: maxurlOptions = {
    fill_object: true,
    exclude_videos: true,
    filter: (url) => (
        !url.toLowerCase().endsWith('.webp')
        // Blocking webp images in Discogs
        && !/:format(webp)/.test(url.toLowerCase())),
};

export async function* getMaxUrlCandidates(smallurl: string): AsyncIterableIterator<maxurlResult> {
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
