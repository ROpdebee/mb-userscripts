import { LOGGER } from '@lib/logging/logger';
import { assertDefined } from '@lib/util/assert';

import type { Dimensions, FileInfo, ImageInfo } from './ImageInfo';
import type { InfoCache } from './InfoCache';
import { getCAAInfo } from './caa_info';
import { getImageDimensions } from './dimensions';

const CAA_ID_REGEX = /(mbid-[a-f\d-]{36})\/mbid-[a-f\d-]{36}-(\d+)/;
const CAA_DOMAIN = 'coverartarchive.org';

export interface Image {
    getDimensions(): Promise<Dimensions | undefined>;
    getFileInfo(): Promise<FileInfo | undefined>;
}

export abstract class BaseImage {
    protected readonly imgUrl: string;
    protected readonly cacheKey: string;
    private readonly cache?: InfoCache;

    public constructor(imgUrl: string, cache?: InfoCache, cacheKey?: string) {
        this.imgUrl = imgUrl;
        this.cacheKey = cacheKey ?? imgUrl;
        this.cache = cache;
    }

    public async getDimensions(): Promise<Dimensions | undefined> {
        try {
            const cachedResult = await this.cache?.getDimensions(this.cacheKey);
            if (cachedResult !== undefined) {
                return cachedResult;
            }
        } catch (err) {
            LOGGER.warn('Failed to retrieve image dimensions from cache', err);
        }

        try {
            const liveResult = await getImageDimensions(this.imgUrl);
            await this.cache?.putDimensions(this.cacheKey, liveResult);
            return liveResult;
        } catch (err) {
            LOGGER.error('Failed to retrieve image dimensions', err);
        }

        return undefined;
    }

    public async getFileInfo(): Promise<FileInfo | undefined> {
        try {
            const cachedResult = await this.cache?.getFileInfo(this.cacheKey);
            if (cachedResult !== undefined) {
                return cachedResult;
            }
        } catch (err) {
            LOGGER.warn('Failed to retrieve image file info from cache', err);
        }

        try {
            const liveResult = await this.loadFileInfo();
            await this.cache?.putFileInfo(this.cacheKey, liveResult);
            return liveResult;
        } catch (err) {
            LOGGER.error('Failed to retrieve image file info', err);
        }

        return undefined;
    }

    public async getImageInfo(): Promise<ImageInfo> {
        const dimensions = await this.getDimensions();
        const fileInfo = await this.getFileInfo();
        return {
            dimensions,
            // The explicit undefined isn't strictly necessary but IMO it's still
            // better to ensure the properties actually exist, otherwise it might
            // look like we forgot to query this info altogether.
            ...fileInfo ?? { size: undefined, fileType: undefined },
        };
    }

    protected abstract loadFileInfo(): Promise<FileInfo>;
}

function caaUrlToDirectUrl(urlObj: URL): URL {
    if (urlObj.host === CAA_DOMAIN && urlObj.pathname.startsWith('/release/')) {
        const [releaseId, imageName] = urlObj.pathname.split('/').slice(2);
        urlObj.href = `https://archive.org/download/mbid-${releaseId}/mbid-${releaseId}-${imageName}`;
    }

    return urlObj;
}

/**
 * Extract the cache key from a cover URL.
 *
 * For release group covers, this will return the thumbnail URL. For other
 * images, it will return the full size URL.
 *
 * @param      {string}  fullSizeUrl   The full size URL.
 * @param      {string}  thumbnailUrl  The thumbnail URL.
 * @return     {string}  Cache key.
 */
function urlToCacheKey(fullSizeUrl: string, thumbnailUrl?: string): string {
    const urlObj = new URL(fullSizeUrl);

    // Use thumbnail URL as cache key for release group images. If the release group cover
    // is changed, the URL will remain the same, so using the full size URL as the cache
    // key would lead to the cache not being invalidated properly.
    // Ideally, the cache key for RG covers would be the full size URL of the release cover,
    // but we unfortunately cannot get the original image's extension here, so we cannot construct
    // it.
    if (urlObj.host === CAA_DOMAIN && urlObj.pathname.startsWith('/release-group/')) {
        assertDefined(thumbnailUrl, 'Release group image requires a thumbnail URL');
        return thumbnailUrl;
    }

    // For other types of images, we'll use the actual full-size URL rather than
    // the coverartarchive.org redirect, to maximise the ability for caching.
    // For PDFs, we'll also use that URL instead of the derived JP2 image.
    return caaUrlToDirectUrl(urlObj).href;
}

/**
 * Transform a URL to a direct full-size URL.
 *
 * @param      {string}  url     The URL to transform.
 * @return     {string}  Direct URL to the image to retrieve dimensions from.
 */
function urlToDirectImageUrl(url: string): string {
    let urlObj = new URL(url);

    // Transform CAA redirect
    urlObj = caaUrlToDirectUrl(urlObj);

    // For PDF URLs, since we cannot get dimensions of a PDF directly, we'll use
    // a JPEG derived by IA. These are accessible in the derived JP2 ZIP, which
    // we can access transparently. These JPEGs (should) have the same dimensions
    // as the PDF pages. We're only using the first page for now.
    if (urlObj.pathname.endsWith('.pdf')) {
        const [imageName] = urlObj.pathname.split('/').slice(3);
        const imageBasename = imageName.replace(/\.pdf$/, '');
        urlObj.pathname = urlObj.pathname.replace(/\.pdf$/, `_jp2.zip/${imageBasename}_jp2%2F${imageBasename}_0000.jp2`);
        urlObj.search = '?ext=jpg';
    }

    return urlObj.href;
}


/**
 * Parse IDs from CAA URLs.
 *
 * @param      {string}            url     The url.
 * @return     {[string, string]}  IA item ID and image ID.
 */
function parseCAAIDs(url: string): [string, string] {
    const urlObj = new URL(url);

    if (urlObj.host === CAA_DOMAIN && urlObj.pathname.startsWith('/release/')) {
        const [releaseId, thumbName] = urlObj.pathname.split('/').slice(2);
        const imageId = thumbName.match(/^(\d+)/)?.[0];
        assertDefined(imageId, 'Malformed URL');
        return [`mbid-${releaseId}`, imageId];
    }

    if (urlObj.host !== 'archive.org') {
        throw new Error('Unsupported URL');
    }

    const matchGroups = urlObj.pathname.match(CAA_ID_REGEX);
    if (matchGroups === null) {
        LOGGER.error(`Failed to extract image ID from URL ${url}`);
        throw new Error('Invalid URL');
    }
    const [itemId, imageId] = matchGroups.slice(1);
    return [itemId, imageId];
}


export class CAAImage extends BaseImage {
    private readonly itemId: string;
    private readonly imageId: string;

    public constructor(fullSizeUrl: string, cache: InfoCache, thumbnailUrl?: string) {
        super(urlToDirectImageUrl(fullSizeUrl), cache, urlToCacheKey(fullSizeUrl, thumbnailUrl));

        const [itemId, imageId] = parseCAAIDs(thumbnailUrl ?? fullSizeUrl);
        this.itemId = itemId;
        this.imageId = imageId;
    }

    public loadFileInfo(): Promise<FileInfo> {
        return getCAAInfo(this.itemId, this.imageId);
    }
}


export class QueuedUploadImage implements Image {
    private readonly imgElement: HTMLImageElement;

    public constructor(imgElement: HTMLImageElement) {
        this.imgElement = imgElement;
    }

    public getFileInfo(): Promise<undefined> {
        return Promise.resolve(undefined); // Already displayed on the page by MB itself
    }

    public getDimensions(): Promise<Dimensions> {
        // Image may not have fully loaded yet, in which case its dimensions
        // would be 0x0. Wait for it to finish loading.
        return new Promise((resolve) => {
            const onLoad = (): void => {
                resolve({
                    width: this.imgElement.naturalWidth,
                    height: this.imgElement.naturalHeight,
                });
            };

            // Adding the event listener and then checking the state to make
            // sure that we don't miss the event in between the check and the
            // adding of the listener.
            this.imgElement.addEventListener('load', onLoad);
            if (this.imgElement.complete) {
                this.imgElement.removeEventListener('load', onLoad);
                onLoad();
            }
        });
    }
}
