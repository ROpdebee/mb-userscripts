// istanbul ignore file: Covered by E2E

import { ConsoleSink } from '@lib/logging/consoleSink';
import { LogLevel } from '@lib/logging/levels';
import { LOGGER } from '@lib/logging/logger';
import { logFailure } from '@lib/util/async';
import { onDocumentLoaded, qs, qsa, qsMaybe } from '@lib/util/dom';

import type { InfoCache } from './InfoCache';
import { displayedCoverArtFactory, DisplayedQueuedUploadImage, displayInfoWhenInView } from './DisplayedImage';
import { setupExports } from './exports';
import { createCache } from './InfoCache';
import { setupStyle } from './style';

import DEBUG_MODE from 'consts:debug-mode';
import USERSCRIPT_NAME from 'consts:userscript-name';

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

function detectAndObserveImages(cache: InfoCache): void {
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
}

const cachePromise = createCache();
// Need to setup the exports before we wait for the cache promise to resolve,
// since otherwise the exports might not yet be available for scripts that
// might need them.
setupExports(cachePromise);

onDocumentLoaded(() => {
    setupStyle();

    logFailure(cachePromise.then((cache) => {
        detectAndObserveImages(cache);
    }));
});
