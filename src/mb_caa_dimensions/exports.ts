// istanbul ignore file: Covered by other scripts.

import { logFailure } from '@lib/util/async';

import type { Dimensions, ImageInfo } from './ImageInfo';
import type { InfoCache } from './InfoCache';
import { CAAImageWithFullSizeURL, displayInfoWhenInView } from './DisplayedImage';
import { CAAImage } from './Image';

export type ROpdebee_getDimensionsWhenInView = (imgElement: HTMLImageElement) => void;
export type ROpdebee_getCAAImageInfo = (imgUrl: string) => Promise<ImageInfo>;
export type ROpdebee_getImageDimensions = (imgUrl: string) => Promise<Dimensions | undefined>;

declare global {
    interface Window {
        ROpdebee_getDimensionsWhenInView: ROpdebee_getDimensionsWhenInView;
        ROpdebee_getCAAImageInfo: ROpdebee_getCAAImageInfo;
        ROpdebee_getImageDimensions: ROpdebee_getImageDimensions;
    }
}

export function setupExports(cachePromise: Promise<InfoCache>): void {
    async function getCAAImageInfo(imgUrl: string): Promise<ImageInfo> {
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

    async function getImageDimensions(imgUrl: string): Promise<Dimensions | undefined> {
        const cache = await cachePromise;
        const image = new CAAImage(imgUrl, cache);
        return image.getDimensions();
    }

    // Expose the function for use in other scripts that may load images.
    window.ROpdebee_getDimensionsWhenInView = getDimensionsWhenInView;
    window.ROpdebee_getImageDimensions = getImageDimensions;
    window.ROpdebee_getCAAImageInfo = getCAAImageInfo;
}
