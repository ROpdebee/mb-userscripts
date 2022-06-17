import { LOGGER } from '@lib/logging/logger';
import { assertDefined } from '@lib/util/assert';

import type { Dimensions, FileInfo, ImageInfo } from './ImageInfo';
import type { InfoCache } from './InfoCache';
import { getCAAInfo } from './caa_info';
import { getImageDimensions } from './dimensions';

const CAA_ID_REGEX = /(mbid-[a-f\d-]{36})\/mbid-[a-f\d-]{36}-(\d+)/;

export interface Image {
    getDimensions(): Promise<Dimensions | undefined>;
    getFileInfo(): Promise<FileInfo | undefined>;
}

export abstract class BaseImage {
    protected readonly imgUrl: string;
    private readonly cache?: InfoCache;

    public constructor(imgUrl: string, cache?: InfoCache) {
        this.imgUrl = imgUrl;
        this.cache = cache;
    }

    public async getDimensions(): Promise<Dimensions | undefined> {
        try {
            const cachedResult = await this.cache?.getDimensions(this.imgUrl);
            if (typeof cachedResult !== 'undefined') {
                return cachedResult;
            }
        } catch (err) {
            LOGGER.warn('Failed to retrieve image dimensions from cache', err);
        }

        try {
            const liveResult = await getImageDimensions(this.imgUrl);
            await this.cache?.putDimensions(this.imgUrl, liveResult);
            return liveResult;
        } catch (err) {
            LOGGER.error('Failed to retrieve image dimensions', err);
        }

        return undefined;
    }

    public async getFileInfo(): Promise<FileInfo | undefined> {
        try {
            const cachedResult = await this.cache?.getFileInfo(this.imgUrl);
            if (typeof cachedResult !== 'undefined') {
                return cachedResult;
            }
        } catch (err) {
            LOGGER.warn('Failed to retrieve image file info from cache', err);
        }

        try {
            const liveResult = await this.loadFileInfo();
            await this.cache?.putFileInfo(this.imgUrl, liveResult);
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


function transformCAAURL(url: string): string {
    const urlObj = new URL(url);

    if (urlObj.host === 'coverartarchive.org' && urlObj.pathname.startsWith('/release/')) {
        const [releaseId, imageName] = urlObj.pathname.split('/').slice(2);
        return `https://archive.org/download/mbid-${releaseId}/mbid-${releaseId}-${imageName}`;
    }

    return url;
}


/**
 * Parse IDs from CAA URLs.
 *
 * @param      {string}            url     The url.
 * @return     {[string, string]}  IA item ID and image ID.
 */
function parseCAAIDs(url: string): [string, string] {
    const urlObj = new URL(url);

    if (urlObj.host === 'coverartarchive.org' && urlObj.pathname.startsWith('/release/')) {
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
        fullSizeUrl = transformCAAURL(fullSizeUrl);

        super(fullSizeUrl, cache);

        const [itemId, imageId] = parseCAAIDs(thumbnailUrl ?? fullSizeUrl);
        this.itemId = itemId;
        this.imageId = imageId;
    }

    public override getDimensions(): Promise<Dimensions | undefined> {
        if (this.imgUrl.endsWith('.pdf')) {
            LOGGER.warn(`Cannot get dimensions of PDF, skipping ${this.imgUrl}`);
            return Promise.resolve(undefined);
        }

        return super.getDimensions();
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
