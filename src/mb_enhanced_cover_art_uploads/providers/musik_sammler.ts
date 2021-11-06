import { assertNonNull } from '@lib/util/assert';
import { parseDOM, qsa } from '@lib/util/dom';

import type { CoverArt } from './base';
import { CoverArtProvider } from './base';

export class MusikSammlerProvider extends CoverArtProvider {
    supportedDomains = ['musik-sammler.de'];
    name = 'Musik-Sammler';
    favicon = 'https://www.musik-sammler.de/favicon.ico';
    urlRegex = /release\/(?:.*-)?(\d+)(?:\/|$)/;

    async findImages(url: URL): Promise<CoverArt[]> {
        const page = parseDOM(await this.fetchPage(url), url.href);
        const coverElements = qsa('#imageGallery > li', page);
        return coverElements.map((coverLi) => {
            const coverSrc = coverLi.getAttribute('data-src');
            assertNonNull(coverSrc, 'Musik-Sammler image without source?');
            return {
                url: new URL(coverSrc, 'https://www.musik-sammler.de/'),
            };
        });
    }
}
