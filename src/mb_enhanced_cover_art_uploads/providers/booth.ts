import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { filterNonNull } from '@lib/util/array';
import { assert } from '@lib/util/assert';
import { parseDOM, qsa } from '@lib/util/dom';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

export class BoothProvider extends CoverArtProvider {
    public readonly supportedDomains = ['booth.pm'];
    public readonly favicon = 'https://booth.pm/static-images/pwa/icon_size_96.png';
    public readonly name = 'Booth';
    protected readonly urlRegex = /items\/(\d+)/;

    // The JS on the page renders the images into .slick-slide and may also insert
    // clones which shouldn't be matched. However, since we're not executing the JS,
    // we don't have to account for that.
    private static readonly IMG_QUERY = '.primary-image-area img.market-item-detail-item-image';

    public async findImages(url: URL): Promise<CoverArt[]> {
        const respDocument = parseDOM(await this.fetchPage(url), url.href);
        const imageElements = qsa<HTMLImageElement>(BoothProvider.IMG_QUERY, respDocument);

        if (imageElements.length === 0) {
            throw new Error('No images found in Booth page');
        }

        const coverUrls = filterNonNull(imageElements.map((img) => img.dataset.origin));
        assert(
            coverUrls.length === imageElements.length,
            `Some images may be missing: Found ${imageElements.length} images but ${coverUrls.length} URLs`);

        const covers: CoverArt[] = coverUrls.map((coverUrl) => ({ url: new URL(coverUrl) }));
        // Assume first image is front cover.
        covers[0].types = [ArtworkTypeIDs.Front];

        return covers;
    }
}
