import pRetry from 'p-retry';

import { LOGGER } from '@lib/logging/logger';
import { memoize } from '@lib/util/functions';

import type { Dimensions } from './image-info';

function _getImageDimensions(url: string): Promise<Dimensions> {
    LOGGER.info(`Getting image dimensions for ${url}`);

    return new Promise((resolve, reject) => {
        let done = false;

        function dimensionsLoaded(dimensions: Dimensions): void {
            // Make sure we don't poll again, it's not necessary.
            clearInterval(interval);
            if (!done) {  // Prevent resolving twice.
                resolve(dimensions);
                done = true;
                img.src = '';  // Cancel loading the image
            }
        }

        function dimensionsFailed(evt: ErrorEvent): void {
            clearInterval(interval);
            if (!done) {
                done = true;
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Firefox doesn't have a message property.
                reject(new Error(evt.message ?? 'Image failed to load for unknown reason'));
            }
        }

        const img = document.createElement('img');
        img.addEventListener('load', () => {
            dimensionsLoaded({
                height: img.naturalHeight,
                width: img.naturalWidth,
            });
        });
        img.addEventListener('error', dimensionsFailed);

        // onload and onerror are asynchronous, so this interval should have
        // already been set before they are called.
        const interval = window.setInterval(() => {
            if (img.naturalHeight) {
                // naturalHeight will be non-zero as soon as enough of the image
                // is loaded to determine its dimensions.
                dimensionsLoaded({
                    height: img.naturalHeight,
                    width: img.naturalWidth,
                });
            }
        }, 50);

        // Start loading the image
        img.src = url;
    });
}

export const getImageDimensions = memoize((url: string) => pRetry(() => _getImageDimensions(url), {
    retries: 5,
    onFailedAttempt: /* istanbul ignore next: Difficult to cover */ (err) => {
        LOGGER.warn(`Failed to retrieve image dimensions: ${err.message}. Retrying…`);
    },
}));
