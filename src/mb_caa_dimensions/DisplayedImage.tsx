import { LOGGER } from '@lib/logging/logger';
import { assertDefined, assertNonNull } from '@lib/util/assert';
import { logFailure } from '@lib/util/async';
import { qs } from '@lib/util/dom';
import { formatSize } from '@lib/util/format';

import type { ImageInfo } from './ImageInfo';
import type { InfoCache } from './InfoCache';
import { CAAImage, QueuedUploadImage } from './Image';

export interface DisplayedImage {
    readonly imgElement: HTMLImageElement;
    loadAndDisplay(): Promise<void>;
}

export function createDimensionsString(imageInfo: ImageInfo): string {
    if (typeof imageInfo.dimensions !== 'undefined') {
        return `${imageInfo.dimensions.height}x${imageInfo.dimensions.width}`;
    } else {
        return 'failed :(';
    }
}

export function createFileInfoString(imageInfo: ImageInfo): string {
    const details: string[] = [];
    if (typeof imageInfo.size !== 'undefined') {
        details.push(formatSize(imageInfo.size));
    }
    if (typeof imageInfo.fileType !== 'undefined') {
        details.push(imageInfo.fileType);
    }

    return details.join(', ');
}

abstract class DisplayedCAAImage implements DisplayedImage {
    readonly imgElement: HTMLImageElement;
    private readonly image: CAAImage;
    protected infoSpan?: HTMLSpanElement;

    constructor(imgElement: HTMLImageElement, image: CAAImage) {
        this.imgElement = imgElement;
        this.image = image;
    }

    async loadAndDisplay(): Promise<void> {
        // Don't load dimensions if it's already loaded/currently being loaded
        if (this.imgElement.getAttribute('ROpdebee_lazyDimensions')) {
            return;
        }

        this.displayInfo('pending…');

        try {
            const imageInfo = await this.image.getImageInfo();
            this.displayInfo(this.createInfoString(imageInfo));
        } catch (e) {
            LOGGER.error('Failed to load image information', e);
            this.displayInfo('failed :(');
        }
    }

    protected displayInfo(infoString: string): void {
        this.imgElement.setAttribute('ROpdebee_lazyDimensions', infoString);

        if (typeof this.infoSpan === 'undefined') {
            this.infoSpan = <span className={'ROpdebee_dimensions'}></span>;
            this.imgElement.insertAdjacentElement('afterend', this.infoSpan);
        }

        this.infoSpan.textContent = infoString;
    }

    protected createInfoString(imageInfo: ImageInfo): string {
        const infoString = `Dimensions: ${createDimensionsString(imageInfo)}`;
        const detailsString = createFileInfoString(imageInfo);
        if (detailsString) {
            return `${infoString} (${detailsString})`;
        }
        return infoString;
    }
}

/**
 * CAA images contained within an anchor element with `artwork-image` class.
 *
 * The full-size URL is the `href` of that anchor.
 */
export class ArtworkImageAnchorCAAImage extends DisplayedCAAImage {

    constructor(imgElement: HTMLImageElement, cache: InfoCache) {
        const fullSizeUrl = imgElement.closest<HTMLAnchorElement>('a.artwork-image')?.href;
        assertDefined(fullSizeUrl);
        super(imgElement, new CAAImage(fullSizeUrl, cache, imgElement.src));
    }

}

/**
 * CAA images on the cover art tab.
 *
 * Full-size URL needs to be retrieved from the anchors below the image.
 */
export class CoverArtTabCAAImage extends DisplayedCAAImage {

    constructor(imgElement: HTMLImageElement, cache: InfoCache) {
        const container = imgElement.closest('div.artwork-cont');
        assertNonNull(container);
        const fullSizeUrl = qs<HTMLAnchorElement>('p.small > a:last-of-type', container).href;
        super(imgElement, new CAAImage(fullSizeUrl, cache));
    }

}

/**
 * CAA images with a `fullSizeURL` property.
 *
 * Intended for backward compatibility with other scripts.
 */
export class CAAImageWithFullSizeURL extends DisplayedCAAImage {
    constructor(imgElement: HTMLImageElement, cache: InfoCache) {
        const fullSizeUrl = imgElement.getAttribute('fullSizeURL');
        assertNonNull(fullSizeUrl);
        super(imgElement, new CAAImage(fullSizeUrl, cache));
    }
}

/**
 * Like `ArtworkImageAnchorCAAImage`, but shorter info string.
 */
export class ThumbnailCAAImage extends ArtworkImageAnchorCAAImage {

    protected override createInfoString(imageInfo: ImageInfo): string {
        const dimensionsString = createDimensionsString(imageInfo);
        const detailsString = createFileInfoString(imageInfo);
        if (detailsString) {
            return `${dimensionsString} (${detailsString})`;
        }
        return dimensionsString;
    }
}

export class DisplayedQueuedUploadImage implements DisplayedImage {
    readonly imgElement: HTMLImageElement;
    private readonly image: QueuedUploadImage;
    private infoSpan?: HTMLSpanElement;

    // No cache, unnecessary to cache.
    constructor(imgElement: HTMLImageElement) {
        this.imgElement = imgElement;
        this.image = new QueuedUploadImage(imgElement);

    }

    async loadAndDisplay(): Promise<void> {
        const dimensions = await this.image.getDimensions();

        if (typeof this.infoSpan === 'undefined') {
            this.infoSpan = <span className={'ROpdebee_dimensions'}></span>;
            this.imgElement.insertAdjacentElement('afterend', this.infoSpan);
        }

        const infoString = `${dimensions.height}x${dimensions.width}`;

        this.infoSpan.textContent = infoString;
    }
}

export function displayedCoverArtFactory(img: HTMLImageElement, cache: InfoCache): DisplayedImage {
    if (img.closest('.artwork-cont') !== null) {  // Release cover art tab
        return new CoverArtTabCAAImage(img, cache);
    } else if (img.closest('.thumb-position') !== null) {  // Add cover art page, existing images
        return new ThumbnailCAAImage(img, cache);
    } else {
        return new ArtworkImageAnchorCAAImage(img, cache);
    }
}

export const displayInfoWhenInView = ((): ((image: DisplayedImage) => void) => {
    // Map image src to DisplayedImage instances. We'll retrieve from this map
    // when the image scrolls into view.
    const imageMap = new Map<HTMLImageElement, DisplayedImage>();

    function inViewCb(entries: IntersectionObserverEntry[]): void {
        entries
            .filter((entry) => entry.intersectionRatio > 0)
            .forEach((entry) => {
                const image = imageMap.get(entry.target as HTMLImageElement)!;
                logFailure(image.loadAndDisplay(), 'Failed to process image');
            });
    }
    const observer = new IntersectionObserver(inViewCb, {
        root: document,
    });

    return (image) => {
        if (imageMap.has(image.imgElement)) {
            // Already observing
            return;
        }
        imageMap.set(image.imgElement, image);
        observer.observe(image.imgElement);
    };
})();
