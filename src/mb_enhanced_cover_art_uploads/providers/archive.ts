import { assertDefined } from '@lib/util/assert';
import { safeParseJSON } from '@lib/util/json';

import type { CoverArt } from './base';
import { CoverArtProvider } from './base';

// Incomplete.
interface ArchiveMetadata {
    server: string; // Server hostname on which the file is hosted
    dir: string; // Path to item on ^
    files: ArchiveFileMetadata[];
    is_dark?: true;
}

interface ArchiveFileMetadata {
    name: string;  // For files in subdirectories, this will contain the full path including directory paths.
    source: 'original' | 'derivative';
    format: string;
}

export class ArchiveProvider extends CoverArtProvider {
    supportedDomains = ['archive.org'];
    favicon = 'https://archive.org/images/glogo.jpg';
    name = 'Archive.org';
    urlRegex = /(?:details|metadata|download)\/([^/?#]+)/;

    static IMAGE_FILE_FORMATS = [
        'JPEG',
        'PNG',
        'Text PDF',  // TODO: Is there a non-text variant?
        'Animated GIF',  // TODO: Is there a non-animated variant?
    ];

    async findImages(url: URL): Promise<CoverArt[]> {
        const id = this.extractId(url);
        assertDefined(id);

        const itemMetadataResp = await this.fetchPage(new URL(`https://archive.org/metadata/${id}`));
        const itemMetadata = safeParseJSON<ArchiveMetadata>(itemMetadataResp, 'Could not parse IA metadata');

        // IA's metadata API always returns a 200, even for items which don't
        // exist.
        if (!itemMetadata.server) {
            throw new Error('Empty IA metadata, item might not exist');
        }

        if (itemMetadata.is_dark) {
            throw new Error('Cannot extract images: This item is darked');
        }

        // While we could just use the standard archive.org/download/... URL,
        // it would always lead to redirection warnings which can be avoided.
        const baseDownloadPath = `https://${itemMetadata.server}/${itemMetadata.dir}/`;

        const originalImagePaths = itemMetadata.files
            .filter((file) => file.source === 'original' && ArchiveProvider.IMAGE_FILE_FORMATS.includes(file.format))
            .map((file) => file.name);

        return originalImagePaths.map((path) => {
            return {
                url: new URL(baseDownloadPath + path),
            };
        });
    }
}
