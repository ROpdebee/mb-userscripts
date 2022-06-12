// istanbul ignore file: Covered by other scripts.

import { logFailure } from '@lib/util/async';

import type { ImageInfo } from './ImageInfo';
import type { InfoCache } from './InfoCache';
import { CAAImageWithFullSizeURL, displayInfoWhenInView } from './DisplayedImage';
import { CAAImage } from './Image';

interface LegacyImageInfo {
    url: string;
    width: number;
    height: number;
    size?: number;
    format?: string;
}

declare global {
    interface Window {
        ROpdebee_getDimensionsWhenInView: (imgElement: HTMLImageElement) => void;
        ROpdebee_getCAAImageInfo: (imgUrl: string) => Promise<ImageInfo>;
        ROpdebee_loadImageDimensions: (imgUrl: string) => Promise<LegacyImageInfo>;
    }
}

export function setupExports(cachePromise: Promise<InfoCache>): void {
    async function getCAAImageInfo(imgUrl: string): Promise<ImageInfo> {
        if (new URL(imgUrl).hostname !== 'archive.org') {
            throw new Error('Unsupported URL: Need direct image URL');
        }

        const cache = await cachePromise;
        const image = new CAAImage(imgUrl, cache);
        return image.getImageInfo();
    }

    function getDimensionsWhenInView(imgElement: HTMLImageElement): void {
        logFailure(cachePromise.then((cache) => {
            const image = new CAAImageWithFullSizeURL(imgElement, cache);
            displayInfoWhenInView(image);
        }), `Something went wrong when attempting to load image info for ${imgElement.src}`);
    }

    async function loadImageDimensions(imgUrl: string): Promise<LegacyImageInfo> {
        const imageInfo = await getCAAImageInfo(imgUrl);
        return {
            url: imgUrl,
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
