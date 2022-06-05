import { LOGGER } from '@lib/logging/logger';

import type { Dimensions, FileInfo, ImageInfo } from './ImageInfo';
import type { InfoCache } from './InfoCache';
import { getCAAInfo } from './caa_info';
import { getImageDimensions } from './dimensions';

export abstract class Image {

    private readonly imgUrl: string;
    private readonly cache?: InfoCache;

    constructor(imgUrl: string, cache?: InfoCache) {
        this.imgUrl = imgUrl;
        this.cache = cache;
    }

    async getDimensions(): Promise<Dimensions | undefined> {
        try {
            const cachedResult = await this.cache?.getDimensions(this.imgUrl);
            if (typeof cachedResult !== 'undefined') {
                return cachedResult;
            }
        } catch (e) /* istanbul ignore next: Difficult to cover */ {
            LOGGER.warn('Failed to retrieve image dimensions from cache', e);
        }

        try {
            const liveResult = await getImageDimensions(this.imgUrl);
            await this.cache?.putDimensions(this.imgUrl, liveResult);
            return liveResult;
        } catch (e) {
            LOGGER.error('Failed to retrieve image dimensions', e);
        }

        return undefined;
    }

    async getFileInfo(): Promise<FileInfo | undefined> {
        try {
            const cachedResult = await this.cache?.getFileInfo(this.imgUrl);
            if (typeof cachedResult !== 'undefined') {
                return cachedResult;
            }
        } catch (e)  /* istanbul ignore next: Difficult to cover */ {
            LOGGER.warn('Failed to retrieve image file info from cache', e);
        }

        try {
            const liveResult = await this.loadFileInfo();
            await this.cache?.putFileInfo(this.imgUrl, liveResult);
            return liveResult;
        } catch (e) {
            LOGGER.error('Failed to retrieve image file info', e);
        }

        return undefined;
    }

    async getImageInfo(): Promise<ImageInfo> {
        const dimensions = await this.getDimensions();
        const fileInfo = await this.getFileInfo();
        return {
            dimensions,
            ...fileInfo,
        };
    }

    protected abstract loadFileInfo(): Promise<FileInfo>;
}


export class CAAImage extends Image {

    private readonly itemId: string;
    private readonly imageName: string;

    constructor(itemId: string, imageName: string, cache?: InfoCache) {
        const imgUrl = `https://archive.org/download/${itemId}/${imageName}`;
        super(imgUrl, cache);
        this.itemId = itemId;
        this.imageName = imageName;
    }

    loadFileInfo(): Promise<FileInfo> {
        return getCAAInfo(this.itemId, this.imageName);
    }
}
