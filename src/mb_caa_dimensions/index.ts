// istanbul ignore file: Covered by E2E

import { logFailure } from '@lib/util/async';
import { insertStylesheet } from '@lib/util/css';
import { onDocumentLoaded, qs, qsa, qsMaybe } from '@lib/util/dom';

import type { InfoCache } from './info-cache';
import { displayedCoverArtFactory, DisplayedQueuedUploadImage, displayInfoWhenInView } from './displayed-image';
import { setupExports } from './exports';
import { createCache } from './info-cache';

import css from './style.scss';

// Query for the span element containing the cover art image.
// Old class name is "cover-art-image", new (since beta.MBS of May 24 2024) is "artwork-image".
// TODO: Change this when new class name lands in production MBS.
const ARTWORK_QUERY = '.cover-art-image, .artwork-image';

function processPageChange(mutations: MutationRecord[], cache: InfoCache): void {
    const addedNodes = mutations.flatMap((mutation) => [...mutation.addedNodes]);
    for (const addedNode of addedNodes) {
        if (!(addedNode instanceof HTMLImageElement)) continue;

        const displayedImage = displayedCoverArtFactory(addedNode, cache);
        if (displayedImage !== undefined) {
            displayInfoWhenInView(displayedImage);
        }
    }
}

function observeQueuedUploads(queuedUploadTable: HTMLTableElement): void {
    const queuedUploadObserver = new MutationObserver((mutations) => {
        const addedNodes = mutations.flatMap((mutation) => [...mutation.addedNodes]);
        // Looking for additions of table rows, this indicates a newly queued upload.
        for (const addedNode of addedNodes) {
            if (!(addedNode instanceof HTMLTableRowElement)) continue;

            const image = qsMaybe<HTMLImageElement>('img', addedNode);
            if (image !== null) {
                displayInfoWhenInView(new DisplayedQueuedUploadImage(image));
            }
        }
    });

    queuedUploadObserver.observe(qs('tbody', queuedUploadTable), {
        childList: true,
    });
}

function detectAndObserveImages(cache: InfoCache): void {
    // MB's react lazily loads images, and this might run before it was able
    // to insert the <img> elements. So we'll use a mutation observer and
    // process the image whenever it gets added.
    const imageLoadObserver = new MutationObserver((mutations) => {
        processPageChange(mutations, cache);
    });

    for (const container of qsa(ARTWORK_QUERY)) {
        // Seems to cover all possible cover art images except for queued upload thumbnails
        const imageElement = qsMaybe<HTMLImageElement>('img', container);

        // Cover art not available or not loaded by react yet.
        if (imageElement === null) {
            imageLoadObserver.observe(container, {
                childList: true,
            });
        } else {
            const displayedImage = displayedCoverArtFactory(imageElement, cache);
            if (!displayedImage) continue;
            displayInfoWhenInView(displayedImage);
        }
    }

    // Listen for new queued uploads on "add cover art" pages
    const queuedUploadTable = qsMaybe<HTMLTableElement>('#add-cover-art > table');
    if (queuedUploadTable !== null) {
        observeQueuedUploads(queuedUploadTable);
    }
}

const cachePromise = createCache();
// Need to setup the exports before we wait for the cache promise to resolve,
// since otherwise the exports might not yet be available for scripts that
// might need them.
setupExports(cachePromise);

onDocumentLoaded(() => {
    insertStylesheet(css);

    cachePromise.then((cache) => {
        detectAndObserveImages(cache);
    }).catch(logFailure());
});
