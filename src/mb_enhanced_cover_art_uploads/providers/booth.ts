import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { filterNonNull } from '@lib/util/array';
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

        // Placeholder images don't have the data-origin attribute, so they're removed here.
        const coverUrls = filterNonNull(imageElements.map((img) => img.dataset.origin));

        const covers: CoverArt[] = coverUrls.map((coverUrl) => ({ url: new URL(coverUrl) }));
        if (covers.length > 0) {
            // Assume first image is front cover.
            covers[0].types = [ArtworkTypeIDs.Front];
        }

        return covers;
    }
}
