import { LOGGER } from '@lib/logging/logger';
import { filterNonNull } from '@lib/util/array';
import { parseDOM, qsa } from '@lib/util/dom';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

export class MusicCircleProvider extends CoverArtProvider {
    public readonly supportedDomains = ['musiccircle.co.in'];
    public readonly favicon = 'https://musiccircle.co.in/cdn/shop/files/musiccircle_siteicon_b3ee4fab-31d5-4ff6-aa1d-9a88c84ffaf0.png';
    public readonly name = 'MusicCircle';
    protected readonly urlRegex = /products\/([a-zA-Z\d-]+)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        const responseDocument = parseDOM(await this.fetchPage(url), url.href);

        // .productView-images-wrapper to avoid noscript part.
        // .productView-thumbnail-link selects <div>s that wrap the images in the gallery.
        // These have the image URL as a data attribute; as not all <img> elements have their src set due to lazy loading.
        const imageDivs = qsa<HTMLDivElement>('.productView-images-wrapper .productView-thumbnail-link', responseDocument);

        return filterNonNull(imageDivs.map((div, index) => {
            let imageUrl = div.dataset.image;

            /* istanbul ignore next: Defensive, shouldn't happen */
            if (!imageUrl) {
                LOGGER.error(`Could not extract URL for image at index ${index}`);
                return null;
            }

            /* istanbul ignore else: Defensive, shouldn't happen */
            if (imageUrl.startsWith('//')) {
                imageUrl = `https:${imageUrl}`;
            }

            return {
                url: new URL(imageUrl),
            };
        }));
    }
}
