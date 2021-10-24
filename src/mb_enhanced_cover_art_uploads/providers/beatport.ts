import { parseDOM, qs } from '@lib/util/dom';

import type { CoverArt } from './base';
import { ArtworkTypeIDs, CoverArtProvider } from './base';

export class BeatportProvider extends CoverArtProvider {
    supportedDomains = ['beatport.com'];
    favicon = 'https://geo-pro.beatport.com/static/ea225b5168059ba412818496089481eb.png';
    name = 'Beatport';
    urlRegex = /release\/[^/]+\/(\d+)(?:\/|$)/;

    async findImages(url: URL): Promise<CoverArt[]> {
        // Like the implementation of HeadMetaPropertyProvider, but Beatport
        // uses <meta name="og:image" ...> instead of <meta property="og:image" ...>
        const respDocument = parseDOM(await this.fetchPage(url), url.href);
        const coverElmt = qs<HTMLMetaElement>('head > meta[name="og:image"]', respDocument);
        return [{
            url: new URL(coverElmt.content),
            types: [ArtworkTypeIDs.Front],
        }];
    }
}
