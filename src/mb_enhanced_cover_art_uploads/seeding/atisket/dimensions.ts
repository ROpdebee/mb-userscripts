import type { Dimensions, FileInfo } from '@src/mb_caa_dimensions/ImageInfo';
import { LOGGER } from '@lib/logging/logger';
import { safeParseJSON } from '@lib/util/json';
import { BaseImage } from '@src/mb_caa_dimensions/Image';

// Use a multiple of 3, most a-tisket releases have 3 images.
// Currently set to 30, should allow 10 releases open in parallel.
export const MAX_CACHED_IMAGES = 30;

export const CACHE_LOCALSTORAGE_KEY = 'ROpdebee_dimensions_cache';

export interface CacheEntry {
    dimensions?: Dimensions;
    fileInfo?: FileInfo;
    addedDatetime: number;
}
export type CacheStore = Record<string, CacheEntry>;

// Simple local storage-backed info cache. We want to cache a image information
// for a limited number of images to prevent reloading information that we
// already loaded. E.g. we loaded image information on the main page, and now
// the images are displayed again on the post-submit screen. However, we don't
// need as large of a cache as CAA Dimensions, and we don't want to reuse the
// IndexedDB implementation since it adds quite a few dependencies.
// We cannot use session storage since that's not shared between tabs and the
// submission button opens a new tab.
export /* for tests */ const localStorageCache = {
    getStore: function(): CacheStore {
        const store = safeParseJSON<CacheStore>(localStorage.getItem(CACHE_LOCALSTORAGE_KEY) ?? '{}');
        if (!store) {
            LOGGER.warn('Cache was malformed, resetting');
            this.putStore({});
            return {};
        }
        return store;
    },

    putStore: function(store: CacheStore): void {
        localStorage.setItem(CACHE_LOCALSTORAGE_KEY, JSON.stringify(store));
    },

    getInfo: function(imageUrl: string): CacheEntry | undefined {
        return this.getStore()[imageUrl];
    },

    putInfo: function(imageUrl: string, cacheEntry: Omit<CacheEntry, 'addedDatetime'>): void {
        const prevStore = this.getStore();
        if (Object.keys(prevStore).length >= MAX_CACHED_IMAGES) {
            const entries = Object.entries(prevStore);
            entries.sort(([, info1], [, info2]) => info2.addedDatetime - info1.addedDatetime);
            // Cannot use Object.fromEntries, it's not available in all browser versions that we support and a-tisket doesn't polyfill it.
            // So we can't just create a new object and assign it. Instead, just delete the entries we need to delete.
            for (const [url] of entries.slice(MAX_CACHED_IMAGES - 1)) {
                delete prevStore[url];
            }
        }

        this.putStore({
            ...prevStore,
            [imageUrl]: {
                ...cacheEntry,
                addedDatetime: Date.now(),
            },
        });
    },

    getDimensions: function(imageUrl: string): Promise<Dimensions | undefined> {
        return Promise.resolve(this.getInfo(imageUrl)?.dimensions);
    },

    getFileInfo: function(imageUrl: string): Promise<FileInfo | undefined> {
        return Promise.resolve(this.getInfo(imageUrl)?.fileInfo);
    },

    putDimensions: function(imageUrl: string, dimensions: Dimensions): Promise<void> {
        const prevEntry = this.getInfo(imageUrl);
        this.putInfo(imageUrl, {
            ...prevEntry,
            dimensions,
        });
        return Promise.resolve();
    },

    putFileInfo: function(imageUrl: string, fileInfo: FileInfo): Promise<void> {
        const prevEntry = this.getInfo(imageUrl);
        this.putInfo(imageUrl, {
            ...prevEntry,
            fileInfo,
        });
        return Promise.resolve();
    },
};

export class AtisketImage extends BaseImage {
    public constructor(imgUrl: string) {
        super(imgUrl, localStorageCache);
    }

    protected loadFileInfo(): Promise<FileInfo> {
        // Not using .split('.') here because Spotify images do not have an extension.
        const ext = this.imgUrl.match(/\.(\w+)$/)?.[1];
        return Promise.resolve({
            fileType: ext?.toUpperCase(),
        });
    }
}
