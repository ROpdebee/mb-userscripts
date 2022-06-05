import { LOGGER } from '@lib/logging/logger';
import { formatSize } from '@lib/util/format';

import type { ImageInfo } from './ImageInfo';
import { CAAImage } from './Image';
import { createCache } from './InfoCache';

// TODO: Refactor this so it's already awaited and we can use the bare cache instead of a promise all the time.
const cacheProm = createCache();


function displayInfo(imgElement: HTMLImageElement, infoStr: string): void {
    imgElement.setAttribute('ROpdebee_lazyDimensions', infoStr);

    let dimensionStr: string;
    if (imgElement.closest('div.thumb-position') || imgElement.classList.contains('uploader-preview-image')) {
        // Shorter for thumbnails
        dimensionStr = infoStr;
    } else {
        dimensionStr = `Dimensions: ${infoStr}`;
    }
    let existing = imgElement.parentNode?.querySelector('span.ROpdebee_dimensions');
    if (!existing) {
        existing = document.createElement('span');
        existing.classList.add('ROpdebee_dimensions');
        imgElement.insertAdjacentElement('afterend', existing);
    }
    existing.textContent = dimensionStr;
}

function createInfoString(result: ImageInfo): string {
    let dimStr: string, sizeStr: string;
    if (typeof result.dimensions === 'undefined') {
        dimStr = 'failed :(';
    } else {
        dimStr = `${result.dimensions.width}x${result.dimensions.height}`;
    }

    if (typeof result.size === 'undefined') {
        sizeStr = '??? KB';
    } else {
        sizeStr = formatSize(result.size);
    }

    if (typeof result.fileType !== 'undefined') {
        sizeStr += `, ${result.fileType}`;
    }

    return `${dimStr} (${sizeStr})`;
}

async function cbImageInView(imgElement: HTMLImageElement): Promise<void> {
    // Don't load dimensions if it's already loaded/currently being loaded
    if (imgElement.getAttribute('ROpdebee_lazyDimensions')) {
        return;
    }

    // Placeholder while loading, prevent from loading again.
    displayInfo(imgElement, 'pending…');
    const cache = await cacheProm;
    const image = new CAAImage(imgElement.getAttribute('fullSizeURL') ?? imgElement.src, cache, imgElement.src);

    try {
        const imageInfo = await image.getImageInfo();
        displayInfo(imgElement, createInfoString(imageInfo));
    } catch (e) {
        LOGGER.error('Failed to load image information', e);
        displayInfo(imgElement, 'failed :(');
    }
}

const getDimensionsWhenInView = (function(): (imgElement: HTMLImageElement) => void {
    const options = {
        root: document,
    };
    const observer = new IntersectionObserver((entries) => {
        entries
            .filter((evt) => evt.intersectionRatio > 0)
            .forEach((evt) => {
                cbImageInView(evt.target as HTMLImageElement)
                    .catch((err) => {
                        LOGGER.error('Something went wrong', err);
                    });
            });
    }, options);
    return (elmt) => {
        observer.observe(elmt);
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
        ROpdebee_getDimensionsWhenInView: typeof getDimensionsWhenInView;
        ROpdebee_getCAAImageInfo: typeof getCAAImageInfo;
        ROpdebee_loadImageDimensions: (imgUrl: string) => Promise<LegacyImageInfo>;
    }
}

// Expose the function for use in other scripts that may load images.
window.ROpdebee_getDimensionsWhenInView = getDimensionsWhenInView;
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

function listenForNewCoverArtThumbs(): void {
    // On add cover art pages
    // Continuously check for images and display their dimensions.
    // TODO: Wouldn't this be much more efficient if we were to use a mutation
    // observer? Now it's just rechecking the same images over and over.
    setInterval(() => {
        document.querySelectorAll<HTMLImageElement>('img.uploader-preview-image').forEach((img) => {
            if (img.getAttribute('ROpdebee_lazyDimensions')) return;
            // Too early to get dimensions, src hasn't been set yet
            if (!img.naturalWidth) return;
            // Don't display on PDF images
            if (img.src.endsWith('/static/images/icons/pdf-icon.png')) return;

            // No need to load these through the network here.
            displayInfo(img, `${img.naturalWidth}x${img.naturalHeight}`);
        });
    }, 500);
}

window.addEventListener('load', () => {

    setupStyle();

    // cover art pages
    document.querySelectorAll('#content div.artwork-cont').forEach((div) => {
        const imgElement = div.querySelector<HTMLImageElement>('span.cover-art-image > img');
        // Could be absent if the image isn't available in CAA yet.
        if (!imgElement) {
            return;
        }
        const anchor = div.querySelector<HTMLAnchorElement>('p.small > a:last-of-type');
        if (!anchor) return;
        imgElement.setAttribute('fullSizeURL', anchor.href);
        getDimensionsWhenInView(imgElement);
    });

    // edit pages + release page + add/remove/edit/reorder cover art pages
    document.querySelectorAll<HTMLImageElement>('.edit-cover-art img, p.artwork img, #sidebar .cover-art-image > img, div.thumb-position > a.artwork-image img').forEach((img) => {
        const anchor = img.closest<HTMLAnchorElement>('a.artwork-image');
        if (!anchor) return;
        img.setAttribute('fullSizeURL', anchor.href);
        getDimensionsWhenInView(img);
    });

    // add cover art pages, listen for new images
    if (document.querySelector('#add-cover-art')) {
        listenForNewCoverArtThumbs();
    }
});
