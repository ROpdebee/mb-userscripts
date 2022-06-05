import { getItemMetadata } from '@lib/IA/ArchiveMetadata';
import { memoize } from '@lib/util/functions';

import type { FileInfo } from './ImageInfo';

// Use memoized fetch so that a single page can reuse the same metadata.
// Don't cache metadata across page loads, as it might change.
const fetchIAMetadata = memoize(getItemMetadata);

export async function getCAAInfo(itemId: string, imageName: string): Promise<FileInfo> {
    const iaManifest = await fetchIAMetadata(itemId);
    const imgMetadata = iaManifest.files.find((fileMeta) => fileMeta.name === imageName);
    if (typeof imgMetadata === 'undefined') {
        throw new Error(`Could not find image "${imageName}" in IA manifest`);
    }

    return {
        fileType: imgMetadata.format,
        size: parseInt(imgMetadata.size),
    };
}

