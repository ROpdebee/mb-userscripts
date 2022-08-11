import type { ArchiveMetadata } from '@lib/IA/ArchiveMetadata';
import { getItemMetadata } from '@lib/IA/ArchiveMetadata';
import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { assertDefined } from '@lib/util/assert';
import { safeParseJSON } from '@lib/util/json';
import { request } from '@lib/util/request';
import { urlBasename, urlJoin } from '@lib/util/urls';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

interface CAAIndex {
    images: Array<{
        comment: string;
        types: string[];
        id: string | number;  // Used to be string in the past, hasn't been applied retroactively yet, see CAA-129
        image: string;
    }>;
}

export class ArchiveProvider extends CoverArtProvider {
    public readonly supportedDomains = ['archive.org'];
    public readonly favicon = 'https://archive.org/images/glogo.jpg';
    public readonly name = 'Archive.org';
    protected readonly urlRegex = /(?:details|metadata|download)\/([^/?#]+)/;

    private static readonly CAA_ITEM_REGEX = /^mbid-[a-f\d-]+$/;
    private static readonly IMAGE_FILE_FORMATS = [
        'JPEG',
        'PNG',
        'Text PDF',  // TODO: Is there a non-text variant?
        'Animated GIF',  // TODO: Is there a non-animated variant?
    ];

    public async findImages(url: URL): Promise<CoverArt[]> {
        const itemId = this.extractId(url);
        assertDefined(itemId);

        const itemMetadata = await getItemMetadata(itemId);
        const baseDownloadUrl = this.createBaseDownloadUrl(itemMetadata);

        if (ArchiveProvider.CAA_ITEM_REGEX.test(itemId)) {
            // For MB/CAA items, try to extract from the CAA index.json to
            // prevent grabbing images which have been unlinked from the
            // release, and to extract artwork type information.
            try {
                return await this.extractCAAImages(itemId, baseDownloadUrl);
            } catch {
                // pass, fall through to generic extraction
                // istanbul ignore next: difficult to cover.
                LOGGER.warn('Failed to extract CAA images, falling back on generic IA extraction');
            }
        }

        return this.extractGenericImages(itemMetadata, baseDownloadUrl);
    }

    /**
     * Entrypoint for MB/CAA providers to delegate to IA. Does not fall back
     * onto generic extraction.
     */
    public async findImagesCAA(itemId: string): Promise<CoverArt[]> {
        const itemMetadata = await getItemMetadata(itemId);
        const baseDownloadUrl = this.createBaseDownloadUrl(itemMetadata);
        return this.extractCAAImages(itemId, baseDownloadUrl);
    }

    private async extractCAAImages(itemId: string, baseDownloadUrl: URL): Promise<CoverArt[]> {
        // Grabbing metadata through CAA isn't 100% reliable, since the info
        // in the index.json isn't always up-to-date (see CAA-129, only a few
        // cases though).
        const caaIndexUrl = `https://archive.org/download/${itemId}/index.json`;
        const caaIndexResp = await request.get(caaIndexUrl);
        const caaIndex = safeParseJSON<CAAIndex>(caaIndexResp.text, 'Could not parse index.json');

        return caaIndex.images.map((img) => {
            const imageFileName = urlBasename(img.image);
            return {
                url: urlJoin(baseDownloadUrl, `${itemId}-${imageFileName}`),
                comment: img.comment,
                types: img.types.map((type) => ArtworkTypeIDs[type as keyof typeof ArtworkTypeIDs]),
            };
        });
    }

    private extractGenericImages(itemMetadata: ArchiveMetadata, baseDownloadUrl: URL): CoverArt[] {
        const originalImagePaths = itemMetadata.files
            .filter((file) => file.source === 'original' && ArchiveProvider.IMAGE_FILE_FORMATS.includes(file.format))
            .map((file) => encodeURIComponent(file.name).replaceAll('%2F', '/')); // keep path separators

        return originalImagePaths.map((path) => {
            return {
                url: urlJoin(baseDownloadUrl, path),
            };
        });
    }

    private createBaseDownloadUrl(itemMetadata: ArchiveMetadata): URL {
        // While we could just use the standard archive.org/download/... URL,
        // it would always lead to redirection warnings which can be avoided.
        return urlJoin(`https://${itemMetadata.server}`, `${itemMetadata.dir}/`);
    }
}
