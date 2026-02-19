import { LOGGER } from '@lib/logging/logger';
import { assertDefined, assertNonNull } from '@lib/util/assert';
import { logFailure } from '@lib/util/async';
import { qsa, qsMaybe } from '@lib/util/dom';
import { formatFileSize } from '@lib/util/format';

import type { ImageInfo } from './image-info';
import type { InfoCache } from './info-cache';
import { CAAImage, QueuedUploadImage } from './image';

export interface DisplayedImage {
    readonly imageElement: HTMLImageElement;
    loadAndDisplay(): Promise<void>;
}

export function createDimensionsString(imageInfo: ImageInfo): string {
    return (imageInfo.dimensions !== undefined
        ? `${imageInfo.dimensions.width}×${imageInfo.dimensions.height}`
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
    public readonly imageElement: HTMLImageElement;
    private readonly _labelPlacementAnchor: Element;
    private _dimensionsSpan: HTMLSpanElement | null = null;
    private _fileInfoSpan: HTMLSpanElement | null = null;

    public constructor(imageElement: HTMLImageElement, labelPlacementAnchor?: Element | null) {
        this._labelPlacementAnchor = labelPlacementAnchor ?? imageElement;
        this.imageElement = imageElement;
    }

    protected get dimensionsSpan(): HTMLSpanElement {
        if (this._dimensionsSpan !== null) return this._dimensionsSpan;

        // Possibly already added previously. Shouldn't happen within this script,
        // but can happen in Supercharged CAA Edits.
        this._dimensionsSpan = qsMaybe<HTMLSpanElement>('span.ROpdebee_dimensions', this.imageElement.parentElement!);
        if (this._dimensionsSpan !== null) return this._dimensionsSpan;

        // First time accessing the dimensions, add it now.
        this._dimensionsSpan = <span className="ROpdebee_dimensions"></span>;
        this._labelPlacementAnchor.insertAdjacentElement('afterend', this._dimensionsSpan);
        return this._dimensionsSpan;
    }

    protected get fileInfoSpan(): HTMLSpanElement {
        if (this._fileInfoSpan !== null) return this._fileInfoSpan;

        this._fileInfoSpan = qsMaybe<HTMLSpanElement>('span.ROpdebee_fileInfo', this.imageElement.parentElement!);
        if (this._fileInfoSpan !== null) return this._fileInfoSpan;

        this._fileInfoSpan = <span className="ROpdebee_fileInfo"></span>;
        this.dimensionsSpan.insertAdjacentElement('afterend', this._fileInfoSpan);
        return this._fileInfoSpan;
    }

    public abstract loadAndDisplay(): Promise<void>;
}

abstract class DisplayedCAAImage extends BaseDisplayedImage {
    private readonly image: CAAImage;
    protected imageInfo: ImageInfo | null = null;

    public constructor(imageElement: HTMLImageElement, image: CAAImage) {
        super(imageElement);
        this.image = image;
    }

    public async loadAndDisplay(): Promise<void> {
        // Don't load dimensions if it's already loaded/currently being loaded
        if (this.imageElement.getAttribute('ROpdebee_lazyDimensions')) {
            return;
        }

        this.displayInfo('pending…');

        try {
            this.imageInfo = await this.image.getImageInfo();
            this.displayInfo(this.createDimensionsString(this.imageInfo), this.createFileInfoString(this.imageInfo));
        } catch (error) {
            LOGGER.error('Failed to load image information', error);
            this.displayInfo('failed :(');
        }
    }

    protected displayInfo(dimensionsString: string, fileInfoString?: string): void {
        this.imageElement.setAttribute('ROpdebee_lazyDimensions', dimensionsString);

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
    public constructor(imageElement: HTMLImageElement, cache: InfoCache) {
        const fullSizeUrl = imageElement.closest<HTMLAnchorElement>('a.artwork-image, a.artwork-pdf')?.href;
        assertDefined(fullSizeUrl);
        super(imageElement, new CAAImage(fullSizeUrl, cache, imageElement.src));
    }
}

/**
 * CAA images on the cover art tab.
 *
 * Full-size URL needs to be retrieved from the anchors below the image.
 */
export class CoverArtTabCAAImage extends DisplayedCAAImage {
    private readonly anchors: HTMLAnchorElement[];

    public constructor(imageElement: HTMLImageElement, cache: InfoCache) {
        const container = imageElement.closest('div.artwork-cont');
        assertNonNull(container);
        const anchors = qsa<HTMLAnchorElement>('p.small > a', container);
        const fullSizeUrl = anchors[anchors.length - 1].href;
        super(imageElement, new CAAImage(fullSizeUrl, cache));
        this.anchors = anchors;
    }

    public override async loadAndDisplay(): Promise<void> {
        await super.loadAndDisplay();
        if (this.imageInfo?.dimensions === undefined) return;

        const { height, width } = this.imageInfo.dimensions;
        const maxDimension = Math.max(height, width);

        for (const anchor of this.anchors) {
            const resolutionString = /^(\d+)\s*px/.exec(anchor.textContent.trim())?.[1];
            if (resolutionString === undefined) continue;

            const resolution = Number.parseInt(resolutionString);
            if (resolution > maxDimension) {
                anchor.classList.add('unavailable');
            }
        }
    }
}

/**
 * CAA images with a `fullSizeURL` property.
 *
 * Intended for backward compatibility with other scripts.
 */
export class CAAImageWithFullSizeURL extends DisplayedCAAImage {
    public constructor(imageElement: HTMLImageElement, cache: InfoCache) {
        const fullSizeUrl = imageElement.getAttribute('fullSizeURL');
        assertNonNull(fullSizeUrl);
        super(imageElement, new CAAImage(fullSizeUrl, cache));
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
    public constructor(imageElement: HTMLImageElement) {
        super(imageElement, imageElement.parentElement?.lastElementChild);
        this.image = new QueuedUploadImage(imageElement);
    }

    public async loadAndDisplay(): Promise<void> {
        // Don't display on PDF images
        if (this.imageElement.src.endsWith('/static/images/icons/pdf-icon.png')) return;

        const dimensions = await this.image.getDimensions();
        const infoString = `${dimensions.width}×${dimensions.height}`;
        this.dimensionsSpan.textContent = infoString;
    }
}

export function displayedCoverArtFactory(image: HTMLImageElement, cache: InfoCache): DisplayedImage | undefined {
    try {
        if (image.closest('.artwork-cont') !== null) { // Release cover art tab
            return new CoverArtTabCAAImage(image, cache);
        } else if (image.closest('.thumb-position') !== null || image.closest('form#set-cover-art') !== null) { // Add cover art page, existing images; set-cover-art pages for RG
            return new ThumbnailCAAImage(image, cache);
        } else {
            return new ArtworkImageAnchorCAAImage(image, cache);
        }
    } catch (error) {
        LOGGER.error('Failed to process image', error);
        return undefined;
    }
}

export const displayInfoWhenInView = ((): ((image: DisplayedImage) => void) => {
    // Map image src to DisplayedImage instances. We'll retrieve from this map
    // when the image scrolls into view.
    const imageMap = new Map<HTMLImageElement, DisplayedImage>();

    function inViewCallback(entries: IntersectionObserverEntry[]): void {
        for (const entry of entries) {
            if (entry.intersectionRatio <= 0) continue;
            const image = imageMap.get(entry.target as HTMLImageElement)!;
            image.loadAndDisplay().catch(logFailure('Failed to process image'));
        }
    }
    const observer = new IntersectionObserver(inViewCallback, {
        root: document,
    });

    return (image) => {
        if (imageMap.has(image.imageElement)) {
            // Already observing
            return;
        }
        imageMap.set(image.imageElement, image);
        observer.observe(image.imageElement);
    };
})();
