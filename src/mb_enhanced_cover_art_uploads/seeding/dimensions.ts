import pRetry from 'p-retry';

import type { Dimensions, FileInfo, ImageInfo } from '@src/mb_caa_dimensions/image-info';
import { LOGGER } from '@lib/logging/logger';
import { safeParseJSON } from '@lib/util/json';
import { HTTPResponseError, request } from '@lib/util/request';
import { BaseImage } from '@src/mb_caa_dimensions/image';
import { getMaximisedCandidates } from '@src/mb_enhanced_cover_art_uploads/maximise';

// Use a multiple of 3, most a-tisket releases have 3 images.
// Currently set to 30, should allow 10 releases open in parallel.
export const MAX_CACHED_IMAGES = 30;

export const CACHE_LOCALSTORAGE_KEY = 'ROpdebee_dimensions_cache';

export interface CacheEntry {
    dimensions?: Dimensions;
    fileInfo?: FileInfo;
    addedDatetime: number;
}
export type CacheStore = Map<string, CacheEntry>;

// Simple local storage-backed info cache. We want to cache a image information
// for a limited number of images to prevent reloading information that we
// already loaded. E.g. we loaded image information on the main page, and now
// the images are displayed again on the post-submit screen. However, we don't
// need as large of a cache as CAA Dimensions, and we don't want to reuse the
// IndexedDB implementation since it adds quite a few dependencies.
// We cannot use session storage since that's not shared between tabs and the
// submission button opens a new tab.
export /* for tests */ const localStorageCache = {
    getStore: function (): CacheStore {
        const rawStore = localStorage.getItem(CACHE_LOCALSTORAGE_KEY) ?? '{}';
        let store = this.deserializeStore(rawStore);
        if (!store) {
            LOGGER.warn('Cache was malformed, resetting');
            store = this.createEmptyStore();
            this.putStore(store);
        }
        return store;
    },

    putStore: function (store: CacheStore): void {
        localStorage.setItem(CACHE_LOCALSTORAGE_KEY, this.serializeStore(store));
    },

    createEmptyStore: function (): CacheStore {
        return new Map();
    },

    serializeStore: function (store: CacheStore): string {
        return JSON.stringify(Object.fromEntries(store.entries()));
    },

    deserializeStore: function (rawStore: string): CacheStore | undefined {
        const rawObject = safeParseJSON<Record<string, CacheEntry>>(rawStore);
        return rawObject && new Map(Object.entries(rawObject));
    },

    getInfo: function (imageUrl: string): CacheEntry | undefined {
        return this.getStore().get(imageUrl);
    },

    putInfo: function (imageUrl: string, cacheEntry: Omit<CacheEntry, 'addedDatetime'>): void {
        const store = this.getStore();
        if (store.size >= MAX_CACHED_IMAGES) {
            const entries = [...store.entries()];
            entries.sort(([, info1], [, info2]) => info2.addedDatetime - info1.addedDatetime);
            // Cannot use Object.fromEntries, it's not available in all browser versions that we support and a-tisket doesn't polyfill it.
            // So we can't just create a new object and assign it. Instead, just delete the entries we need to delete.
            for (const [url] of entries.slice(MAX_CACHED_IMAGES - 1)) {
                store.delete(url);
            }
        }

        store.set(imageUrl, {
            ...cacheEntry,
            addedDatetime: Date.now(),
        });
        this.putStore(store);
    },

    getDimensions: function (imageUrl: string): Promise<Dimensions | undefined> {
        return Promise.resolve(this.getInfo(imageUrl)?.dimensions);
    },

    getFileInfo: function (imageUrl: string): Promise<FileInfo | undefined> {
        return Promise.resolve(this.getInfo(imageUrl)?.fileInfo);
    },

    putDimensions: function (imageUrl: string, dimensions: Dimensions): Promise<void> {
        const previousEntry = this.getInfo(imageUrl);
        this.putInfo(imageUrl, {
            ...previousEntry,
            dimensions,
        });
        return Promise.resolve();
    },

    putFileInfo: function (imageUrl: string, fileInfo: FileInfo): Promise<void> {
        const previousEntry = this.getInfo(imageUrl);
        this.putInfo(imageUrl, {
            ...previousEntry,
            fileInfo,
        });
        return Promise.resolve();
    },
};

export class SeederImage extends BaseImage {
    public constructor(imageUrl: string) {
        super(imageUrl, localStorageCache);
    }

    protected async loadFileInfo(): Promise<FileInfo> {
        const response = await pRetry(() => request.head(this.imageUrl), {
            retries: 5,
            onFailedAttempt: (error) => {
                // Don't retry on 4xx status codes except for 429. Anything below 400 doesn't throw a HTTPResponseError.
                if (error instanceof HTTPResponseError && error.statusCode < 500 && error.statusCode !== 429) {
                    throw error;
                }

                LOGGER.warn(`Failed to retrieve image file info: ${error.message}. Retrying…`);
            },
        });

        const fileSize = response.headers.get('Content-Length')?.match(/\d+/)?.[0];
        const fileType = response.headers.get('Content-Type')?.match(/^\w+\/(\w+)$/)?.[1];

        return {
            fileType: fileType?.toUpperCase(),
            size: fileSize ? Number.parseInt(fileSize) : /* istanbul ignore next: Probably won't happen */ undefined,
        };
    }
}

export async function getImageInfo(imageUrl: string): Promise<ImageInfo> {
    // Try maximising the image
    for await (const maxCandidate of getMaximisedCandidates(new URL(imageUrl))) {
        // Skip likely broken images. Happens on Apple Music images a lot as the
        // first candidate.
        if (maxCandidate.likely_broken) continue;

        LOGGER.debug(`Trying to get image information for maximised candidate ${maxCandidate.url}`);
        const seederImage = new SeederImage(maxCandidate.url.toString());
        // Query dimensions and file info separately, don't use `Image#getImageInfo`
        // since it resolves even if both queries fail. We're dealing with images
        // that may not exist, so instead we'll call both parts separately and
        // check their output.

        // Load file info first, and skip loading dimensions if file info failed.
        // File info does a HEAD request and fails immediately on 404, dimensions
        // will retry on 404, which would be wasteful.
        const fileInfo = await seederImage.getFileInfo();
        const dimensions = fileInfo && await seederImage.getDimensions();
        if (!dimensions) {
            LOGGER.warn(`Failed to load dimensions for maximised candidate ${maxCandidate.url}`);
            continue;
        }

        return {
            dimensions,
            ...fileInfo,
        };
    }

    // Fall back on original URL. Using `Image#getImageInfo` is fine here.
    return new SeederImage(imageUrl).getImageInfo();
}
