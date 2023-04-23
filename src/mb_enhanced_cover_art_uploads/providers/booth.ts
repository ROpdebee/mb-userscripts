import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { assertDefined } from '@lib/util/assert';
import { safeParseJSON } from '@lib/util/json';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

interface BoothAPIInformation {
    id: number;
    images: Array<{
        original: string;
        resized: string;
        caption: string | null; // TODO: Can we do something with this?
    }>;
}

export class BoothProvider extends CoverArtProvider {
    public readonly supportedDomains = ['*.booth.pm'];
    public readonly favicon = 'https://booth.pm/static-images/pwa/icon_size_96.png';
    public readonly name = 'Booth';
    protected readonly urlRegex = /items\/(\d+)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        const itemId = this.extractId(url);
        assertDefined(itemId);
        const apiJson = await this.fetchPage(this.createApiUrl(itemId));
        const apiData = safeParseJSON<BoothAPIInformation>(apiJson, 'Failed to parse Booth API response');
        const covers: CoverArt[] = apiData.images.map((img) => ({ url: new URL(img.original) }));

        if (covers.length > 0) {
            // Assume first image is front cover.
            covers[0].types = [ArtworkTypeIDs.Front];
        }

        return covers;
    }

    private createApiUrl(itemId: string): URL {
        return new URL(`https://booth.pm/en/items/${itemId}.json`);
    }
}
