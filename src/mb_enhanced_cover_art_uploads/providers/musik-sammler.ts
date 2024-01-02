import { assertDefined } from '@lib/util/assert';
import { parseDOM, qsa } from '@lib/util/dom';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

export class MusikSammlerProvider extends CoverArtProvider {
    public readonly supportedDomains = ['musik-sammler.de'];
    public readonly name = 'Musik-Sammler';
    public readonly favicon = 'https://www.musik-sammler.de/favicon.ico';
    protected readonly urlRegex = /release\/(?:.*-)?(\d+)(?:\/|$)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        const page = parseDOM(await this.fetchPage(url), url.href);
        const coverElements = qsa<HTMLLIElement>('#imageGallery > li', page);
        return coverElements.map((coverLi) => {
            const coverSource = coverLi.dataset.src;
            assertDefined(coverSource, 'Musik-Sammler image without source?');
            return {
                url: new URL(coverSource, 'https://www.musik-sammler.de/'),
            };
        });
    }
}
