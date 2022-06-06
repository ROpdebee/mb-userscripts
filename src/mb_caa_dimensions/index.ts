import { ConsoleSink } from '@lib/logging/consoleSink';
import { LogLevel } from '@lib/logging/levels';
import { LOGGER } from '@lib/logging/logger';
import { logFailure } from '@lib/util/async';
import { onDocumentLoaded, qs, qsa, qsMaybe } from '@lib/util/dom';

import type { DisplayedImage } from './DisplayedImage';
import type { ImageInfo } from './ImageInfo';
import type { InfoCache } from './InfoCache';
import { ArtworkImageAnchorCAAImage, CAAImageWithFullSizeURL, CoverArtTabCAAImage, DisplayedQueuedUploadImage, ThumbnailCAAImage } from './DisplayedImage';
import { CAAImage } from './Image';
import { createCache } from './InfoCache';

import DEBUG_MODE from 'consts:debug-mode';
import USERSCRIPT_NAME from 'consts:userscript-name';

// TODO: Refactor this so it's already awaited and we can use the bare cache instead of a promise all the time.
const cacheProm = createCache();

const displayInfoWhenInView = ((): ((image: DisplayedImage) => void) => {
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

interface LegacyImageInfo {
    url: string;
    width: number;
    height: number;
    size?: number;
    format?: string;
}

async function getCAAImageInfo(imgUrl: string): Promise<ImageInfo> {
    if (new URL(imgUrl).hostname !== 'archive.org') {
        throw new Error('Unsupported URL: Need direct image URL');
    }

    const cache = await cacheProm;
    const image = new CAAImage(imgUrl, cache);
    return image.getImageInfo();
}

declare global {
    interface Window {
        ROpdebee_getDimensionsWhenInView: (imgElement: HTMLImageElement) => void;
        ROpdebee_getCAAImageInfo: typeof getCAAImageInfo;
        ROpdebee_loadImageDimensions: (imgUrl: string) => Promise<LegacyImageInfo>;
    }
}

// Expose the function for use in other scripts that may load images.
window.ROpdebee_getDimensionsWhenInView = ((imgElement: HTMLImageElement): void => {
    logFailure(cacheProm.then((cache) => {
        const image = new CAAImageWithFullSizeURL(imgElement, cache);
        displayInfoWhenInView(image);
    }), `Something went wrong when attempting to load image info for ${imgElement.src}`);
});
// Deprecated, use `ROpdebee_getImageInfo` instead.
window.ROpdebee_loadImageDimensions = ((imgUrl: string): Promise<LegacyImageInfo> =>
    getCAAImageInfo(imgUrl)
        .then((imageInfo) => ({
            url: imgUrl,
            ...imageInfo.dimensions ?? { width: 0, height: 0 },
            size: imageInfo.size,
            format: imageInfo.fileType,
        }))
);
window.ROpdebee_getCAAImageInfo = getCAAImageInfo;

function setupStyle(): void {
    const style = document.createElement('style');
    style.id = 'ROpdebee_CAA_Dimensions';
    document.head.appendChild(style);
    // Thumbnails in add/reorder cover art pages
    style.sheet?.insertRule(`div.thumb-position {
        height: auto;
        display: flex;
        flex-direction: column;
    }`);
    style.sheet?.insertRule(`.image-position {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }`);
    // Put the reorder buttons at the bottom
    style.sheet?.insertRule(`div.thumb-position > div:last-of-type::before {
        margin-bottom: auto;
    }`);
    style.sheet?.insertRule(`div.thumb-position > div:last-of-type {
        margin-top: auto;
        padding-top: 5px;
    }`);
    // Center the thumbnail img
    style.sheet?.insertRule(`div.thumb-position img {
        display: block;
        margin: auto;
    }`);

    style.sheet?.insertRule(`span.ROpdebee_dimensions {
        display: block;
    }`);
    style.sheet?.insertRule(`div.thumb-position span.ROpdebee_dimensions {
        text-align: center;
        font-size: smaller;
        padding: 0.5em 0;
    }`);

    style.sheet?.insertRule(`img.uploader-preview-column > span.ROpdebee_dimensions {
        display: inline;
    }`);
}

LOGGER.configure({
    logLevel: DEBUG_MODE ? LogLevel.DEBUG : LogLevel.INFO,
});
LOGGER.addSink(new ConsoleSink(USERSCRIPT_NAME));

async function processPageChange(mutations: MutationRecord[], cache: InfoCache): Promise<void> {
    mutations.flatMap((mutation) => [...mutation.addedNodes])
        .filter((addedNode) => addedNode instanceof HTMLImageElement)
        .forEach((addedImage) => {
            displayInfoWhenInView(displayedCoverArtFactory(addedImage as HTMLImageElement, cache));
        });
}

function displayedCoverArtFactory(img: HTMLImageElement, cache: InfoCache): DisplayedImage {
    if (img.closest('.artwork-cont') !== null) {  // Release cover art tab
        return new CoverArtTabCAAImage(img, cache);
    } else if (img.closest('.thumb-position') !== null) {  // Add cover art page, existing images
        return new ThumbnailCAAImage(img, cache);
    } else {
        return new ArtworkImageAnchorCAAImage(img, cache);
    }
}

function observeQueuedUploads(queuedUploadTable: HTMLTableElement): void {
    const queuedUploadObserver = new MutationObserver((mutations) => {
        // Looking for additions of table rows, this indicates a newly queued upload.
        mutations.forEach((mutation) => {
            [...mutation.addedNodes]
                .filter((addedNode) => addedNode instanceof HTMLTableRowElement)
                .forEach((addedRow) => {
                    const img = qsMaybe<HTMLImageElement>('img', addedRow as HTMLTableRowElement);
                    if (img !== null) {
                        displayInfoWhenInView(new DisplayedQueuedUploadImage(img));
                    }
                });
        });
    });

    queuedUploadObserver.observe(qs('tbody', queuedUploadTable), {
        childList: true,
    });
}

onDocumentLoaded(() => {
    setupStyle();

    cacheProm.then((cache) => {
        // MB's react lazily loads images, and this might run before it was able
        // to insert the <img> elements. So we'll use a mutation observer and
        // process the image whenever it gets added.
        const imageLoadObserver = new MutationObserver((mutations) => {
            logFailure(processPageChange(mutations, cache));
        });

        qsa('.cover-art-image').forEach((container) => {
            // Seems to cover all possible cover art images except for queued upload thumbnails
            const imgElement = qsMaybe<HTMLImageElement>('img', container);

            // Cover art not available or not loaded by react yet.
            if (imgElement === null) {
                imageLoadObserver.observe(container, {
                    childList: true,
                });
            } else {
                displayInfoWhenInView(displayedCoverArtFactory(imgElement, cache));
            }
        });

        // Listen for new queued uploads on "add cover art" pages
        const queuedUploadTable = qsMaybe<HTMLTableElement>('#add-cover-art > table');
        if (queuedUploadTable !== null) {
            observeQueuedUploads(queuedUploadTable);
        }
    }).catch((err) => {
        LOGGER.error('Something went wrong when initialising', err);
    });
});
