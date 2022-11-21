import pRetry from 'p-retry';

import { getItemMetadata } from '@lib/IA/ArchiveMetadata';
import { LOGGER } from '@lib/logging/logger';
import { parseDOM, qs, qsa } from '@lib/util/dom';
import { memoize } from '@lib/util/functions';

import type { FileInfo } from './ImageInfo';

// Use memoized fetch so that a single page can reuse the same metadata.
// Don't cache metadata across page loads, as it might change.
const fetchIAMetadata = memoize((itemId: string) => pRetry(() => getItemMetadata(itemId), {
    retries: 5,
    onFailedAttempt: /* istanbul ignore next: Difficult to cover */ (err) => {
        LOGGER.warn(`Failed to retrieve IA metadata: ${err.cause}. Retrying…`);
    },
}));

export async function getCAAInfo(itemId: string, imageId: string): Promise<FileInfo> {
    const iaManifest = await fetchIAMetadata(itemId);
    const fileNameRegex = new RegExp(`mbid-[a-f0-9-]{36}-${imageId}\\.\\w+$`);
    const imgMetadata = iaManifest.files.find((fileMeta) => fileNameRegex.test(fileMeta.name));
    if (imgMetadata === undefined) {
        throw new Error(`Could not find image "${imageId}" in IA manifest`);
    }

    const pageCount = imgMetadata.format.endsWith('PDF') ? await tryGetPDFPageCount(itemId, imageId) : undefined;

    return {
        fileType: imgMetadata.format,
        size: parseInt(imgMetadata.size),
        pageCount,
    };
}

async function tryGetPDFPageCount(itemId: string, imageId: string): Promise<number> {
    const zipListingUrl = `https://archive.org/download/${itemId}/${itemId}-${imageId}_jp2.zip/`;
    const zipListingResp = await fetch(zipListingUrl);
    const page = parseDOM(await zipListingResp.text(), zipListingUrl);

    // Grabbing tbody via `qs` separately so we throw an error in case we can't find it.
    const tbody = qs('tbody', page);
    return qsa('tr', tbody).length - 2; // Decrement the header and the directory entry.
}
