import { LOGGER } from '@lib/logging/logger';
import { assertDefined, assertNonNull } from '@lib/util/assert';
import { logFailure } from '@lib/util/async';
import { qs, qsMaybe } from '@lib/util/dom';
import { formatFileSize } from '@lib/util/format';

import type { ImageInfo } from './ImageInfo';
import type { InfoCache } from './InfoCache';
import { CAAImage, QueuedUploadImage } from './Image';

export interface DisplayedImage {
    readonly imgElement: HTMLImageElement;
    loadAndDisplay(): Promise<void>;
}

export function createDimensionsString(imageInfo: ImageInfo): string {
    return (imageInfo.dimensions !== undefined
        ? `${imageInfo.dimensions.width}x${imageInfo.dimensions.height}`
        : 'failed :(');
}

export function createFileInfoString(imageInfo: ImageInfo): string {
    const details: string[] = [];
    if (imageInfo.size !== undefined) {
        details.push(formatFileSize(imageInfo.size));
    }
    if (imageInfo.fileType !== undefined) {
        details.push(imageInfo.fileType);
    }
    if (imageInfo.pageCount !== undefined) {
        details.push(imageInfo.pageCount.toString() + (imageInfo.pageCount === 1 ? ' page' : ' pages'));
    }

    return details.join(', ');
}

abstract class BaseDisplayedImage implements DisplayedImage {
    public readonly imgElement: HTMLImageElement;
    private _dimensionsSpan: HTMLSpanElement | null = null;
    private _fileInfoSpan: HTMLSpanElement | null = null;

    public constructor(imgElement: HTMLImageElement) {
        this.imgElement = imgElement;
    }

    protected get dimensionsSpan(): HTMLSpanElement {
        if (this._dimensionsSpan !== null) return this._dimensionsSpan;

        // Possibly already added previously. Shouldn't happen within this script,
        // but can happen in Supercharged CAA Edits.
        this._dimensionsSpan = qsMaybe<HTMLSpanElement>('span.ROpdebee_dimensions', this.imgElement.parentElement!);
        if (this._dimensionsSpan !== null) return this._dimensionsSpan;

        // First time accessing the dimensions, add it now.
        this._dimensionsSpan = <span className={'ROpdebee_dimensions'}></span>;
        this.imgElement.insertAdjacentElement('afterend', this._dimensionsSpan);
        return this._dimensionsSpan;
    }

    protected get fileInfoSpan(): HTMLSpanElement {
        if (this._fileInfoSpan !== null) return this._fileInfoSpan;

        this._fileInfoSpan = qsMaybe<HTMLSpanElement>('span.ROpdebee_fileInfo', this.imgElement.parentElement!);
        if (this._fileInfoSpan !== null) return this._fileInfoSpan;

        this._fileInfoSpan = <span className={'ROpdebee_fileInfo'}></span>;
        this.dimensionsSpan.insertAdjacentElement('afterend', this._fileInfoSpan);
        return this._fileInfoSpan;
    }

    public abstract loadAndDisplay(): Promise<void>;
}

abstract class DisplayedCAAImage extends BaseDisplayedImage {
    private readonly image: CAAImage;

    public constructor(imgElement: HTMLImageElement, image: CAAImage) {
        super(imgElement);
        this.image = image;
    }

    public async loadAndDisplay(): Promise<void> {
        // Don't load dimensions if it's already loaded/currently being loaded
        if (this.imgElement.getAttribute('ROpdebee_lazyDimensions')) {
            return;
        }

        this.displayInfo('pending…');

        try {
            const imageInfo = await this.image.getImageInfo();
            this.displayInfo(this.createDimensionsString(imageInfo), this.createFileInfoString(imageInfo));
        } catch (err) {
            LOGGER.error('Failed to load image information', err);
            this.displayInfo('failed :(');
        }
    }

    protected displayInfo(dimensionsString: string, fileInfoString?: string): void {
        this.imgElement.setAttribute('ROpdebee_lazyDimensions', dimensionsString);

        this.dimensionsSpan.textContent = dimensionsString;
        if (fileInfoString !== undefined) {
            this.fileInfoSpan.textContent = fileInfoString;
        }
    }

    protected createDimensionsString(imageInfo: ImageInfo): string {
        return `Dimensions: ${createDimensionsString(imageInfo)}`;
    }

    protected createFileInfoString(imageInfo: ImageInfo): string | undefined {
        const detailsString = createFileInfoString(imageInfo);
        if (detailsString) {
            return detailsString;
        }
        return undefined;
    }
}

/**
 * CAA images contained within an anchor element with `artwork-image` class.
 *
 * The full-size URL is the `href` of that anchor.
 */
export class ArtworkImageAnchorCAAImage extends DisplayedCAAImage {
    public constructor(imgElement: HTMLImageElement, cache: InfoCache) {
        const fullSizeUrl = imgElement.closest<HTMLAnchorElement>('a.artwork-image, a.artwork-pdf')?.href;
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
    public constructor(imgElement: HTMLImageElement, cache: InfoCache) {
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
    public constructor(imgElement: HTMLImageElement, cache: InfoCache) {
        const fullSizeUrl = imgElement.getAttribute('fullSizeURL');
        assertNonNull(fullSizeUrl);
        super(imgElement, new CAAImage(fullSizeUrl, cache));
    }
}

/**
 * Like `ArtworkImageAnchorCAAImage`, but shorter info string.
 */
export class ThumbnailCAAImage extends ArtworkImageAnchorCAAImage {
    protected override createDimensionsString(imageInfo: ImageInfo): string {
        return createDimensionsString(imageInfo);
    }
}

export class DisplayedQueuedUploadImage extends BaseDisplayedImage {
    private readonly image: QueuedUploadImage;

    // No cache, unnecessary to cache.
    public constructor(imgElement: HTMLImageElement) {
        super(imgElement);
        this.image = new QueuedUploadImage(imgElement);
    }

    public async loadAndDisplay(): Promise<void> {
        // Don't display on PDF images
        if (this.imgElement.src.endsWith('/static/images/icons/pdf-icon.png')) return;

        const dimensions = await this.image.getDimensions();
        const infoString = `${dimensions.width}x${dimensions.height}`;
        this.dimensionsSpan.textContent = infoString;
    }
}

export function displayedCoverArtFactory(img: HTMLImageElement, cache: InfoCache): DisplayedImage | undefined {
    try {
        if (img.closest('.artwork-cont') !== null) {  // Release cover art tab
            return new CoverArtTabCAAImage(img, cache);
        } else if (img.closest('.thumb-position') !== null || img.closest('form#set-cover-art') !== null) {  // Add cover art page, existing images; set-cover-art pages for RG
            return new ThumbnailCAAImage(img, cache);
        } else {
            return new ArtworkImageAnchorCAAImage(img, cache);
        }
    } catch (err) {
        LOGGER.error('Failed to process image', err);
        return undefined;
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
