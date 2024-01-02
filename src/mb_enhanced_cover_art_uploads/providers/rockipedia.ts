import { LOGGER } from '@lib/logging/logger';
import { filterNonNull } from '@lib/util/array';
import { assertDefined } from '@lib/util/assert';
import { parseDOM, qsa } from '@lib/util/dom';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

// There's an API, but it requires an API key.
export class RockipediaProvider extends CoverArtProvider {
    public readonly supportedDomains = ['rockipedia.no'];
    public readonly favicon = 'https://www.rockipedia.no/wp-content/themes/rockipedia/img/favicon.ico';
    public readonly name = 'Rockipedia';
    protected readonly urlRegex = /utgivelser\/.+?-(\d+)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        const id = this.extractId(url);
        assertDefined(id);
        const imageBrowserUrl = new URL(`https://www.rockipedia.no/?imagebrowser=true&t=album&id=${id}`);
        const imageBrowserDocument = parseDOM(await this.fetchPage(imageBrowserUrl), url.href);

        // No failure case, even for wrong IDs it still returns an empty gallery.

        const coverElements = qsa<HTMLLIElement>('li.royalSlide', imageBrowserDocument);
        return filterNonNull(coverElements.map((coverElement) => {
            const coverUrl = coverElement.dataset.src;
            // istanbul ignore if: Should not happen
            if (!coverUrl) {
                LOGGER.warn(`Could not extract a cover for Rockipedia release ${url}: Unexpected null src`);
                return null;
            }

            return {
                url: new URL(coverUrl),
                // No types. Sometimes there's a caption "Omslagsfoto", which
                // translates to "cover photo", but I don't think that necessarily
                // means "front cover". See e.g. https://www.rockipedia.no/utgivelser/good_man_good_girl__(radio_edit)-25786/,
                // that's a picture of the medium.
            };
        }));
    }
}
