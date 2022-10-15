import { LOGGER } from '@lib/logging/logger';

import type { RequestObserver } from './types';

export const loggingObserver: RequestObserver = {
    onStarted({ backend, method, url }) {
        LOGGER.debug(`${method} ${url} - STARTED (backend: ${backend})`);
    },
    onSuccess({ method, url, response }) {
        LOGGER.debug(`${method} ${url} - SUCCESS (code ${response.status})`);
    },
    onFailed({ method, url, error }) {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        LOGGER.debug(`${method} ${url} - FAILED (${error})`);
    },
    // istanbul ignore next: Unit tests don't have progress events.
    onProgress({ method, url, progressEvent }) {
        const { loaded, total } = progressEvent;
        LOGGER.debug(`${method} ${url} - PROGRESS (${loaded}/${total})`);
    },
};
