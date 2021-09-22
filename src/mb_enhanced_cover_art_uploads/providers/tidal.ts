import { assertHasValue } from '../../lib/util/assert';
import { parseDOM, qs, qsMaybe } from '../../lib/util/dom';
import { gmxhr } from '../../lib/util/xhr';

import type { CoverArt, CoverArtProvider } from './base';
import { ArtworkTypeIDs } from './base';

export class TidalProvider implements CoverArtProvider {
    supportedDomains = ['tidal.com', 'listen.tidal.com', 'store.tidal.com']
    favicon = 'https://listen.tidal.com/favicon.ico'
    name = 'Tidal'

    supportsUrl(url: URL): boolean {
        return /\/album\/\d+/.test(url.pathname);
    }

    async findImages(url: URL): Promise<CoverArt[]> {
        // Rewrite the URL to point to the main page
        const albumId = url.pathname.match(/\/album\/(\d+)/)?.[1];
        assertHasValue(albumId);
        url.href = `https://tidal.com/browse/album/${albumId}`;

        const resp = await gmxhr({ url: url.href, method: 'GET' });
        const respDocument = parseDOM(resp.responseText);

        if (qsMaybe('p#cmsg') !== null) {
            throw {reason: 'captcha'};
        }

        const coverElmt = qs<HTMLMetaElement>('head > meta[property="og:image"]', respDocument);
        return [{
            url: new URL(coverElmt.content),
            type: [ArtworkTypeIDs.Front],
        }];
    }
}
