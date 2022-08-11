import { safeParseJSON } from '@lib/util/json';
import { request } from '@lib/util/request';

// Incomplete.
export interface ArchiveMetadata {
    server: string; // Server hostname on which the file is hosted
    dir: string; // Path to item on ^
    files: ArchiveFileMetadata[];
    is_dark?: true;
}

export interface ArchiveFileMetadata {
    name: string;  // For files in subdirectories, this will contain the full path including directory paths.
    source: 'original' | 'derivative';
    format: string;
    size: string;  // String, for some reason
}

/**
 * Retrieve metadata of an Internet Archive item.
 *
 * @param      {string}                    itemId  The item identifier.
 * @return     {Promise<ArchiveMetadata>}  Promise resolving to the parsed
 *                                         metadata, or rejecting in case the
 *                                         item does not exist or has been
 *                                         taken down.
 */
export async function getItemMetadata(itemId: string): Promise<ArchiveMetadata> {
    const itemMetadataResp = await request.get(new URL(`https://archive.org/metadata/${itemId}`));
    const itemMetadata = safeParseJSON<ArchiveMetadata>(itemMetadataResp.text, 'Could not parse IA metadata');

    // IA's metadata API always returns a 200, even for items which don't
    // exist.
    if (!itemMetadata.server) {
        throw new Error('Empty IA metadata, item might not exist');
    }

    if (itemMetadata.is_dark) {
        throw new Error('Cannot access IA metadata: This item is darkened');
    }

    return itemMetadata;
}
