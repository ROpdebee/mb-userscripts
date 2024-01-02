// istanbul ignore file: Covered by other scripts.

import { logFailure } from '@lib/util/async';

import type { ImageInfo } from './image-info';
import type { InfoCache } from './info-cache';
import { CAAImageWithFullSizeURL, displayInfoWhenInView } from './displayed-image';
import { CAAImage } from './image';

interface LegacyImageInfo {
    url: string;
    width: number;
    height: number;
    size?: number;
    format?: string;
}

declare global {
    interface Window {
        ROpdebee_getDimensionsWhenInView: (imageElement: HTMLImageElement) => void;
        ROpdebee_getCAAImageInfo: (imageUrl: string) => Promise<ImageInfo>;
        ROpdebee_loadImageDimensions: (imageUrl: string) => Promise<LegacyImageInfo>;
    }
}

export function setupExports(cachePromise: Promise<InfoCache>): void {
    async function getCAAImageInfo(imageUrl: string): Promise<ImageInfo> {
        if (new URL(imageUrl).hostname !== 'archive.org') {
            throw new Error('Unsupported URL: Need direct image URL');
        }

        const cache = await cachePromise;
        const image = new CAAImage(imageUrl, cache);
        return image.getImageInfo();
    }

    function getDimensionsWhenInView(imageElement: HTMLImageElement): void {
        cachePromise.then((cache) => {
            const image = new CAAImageWithFullSizeURL(imageElement, cache);
            displayInfoWhenInView(image);
        }).catch(logFailure(`Something went wrong when attempting to load image info for ${imageElement.src}`));
    }

    async function loadImageDimensions(imageUrl: string): Promise<LegacyImageInfo> {
        const imageInfo = await getCAAImageInfo(imageUrl);
        return {
            url: imageUrl,
            ...imageInfo.dimensions ?? { width: 0, height: 0 },
            size: imageInfo.size,
            format: imageInfo.fileType,
        };
    }

    // Expose the function for use in other scripts that may load images.
    window.ROpdebee_getDimensionsWhenInView = getDimensionsWhenInView;
    // Deprecated, use `ROpdebee_getImageInfo` instead.
    window.ROpdebee_loadImageDimensions = loadImageDimensions;
    window.ROpdebee_getCAAImageInfo = getCAAImageInfo;
}
