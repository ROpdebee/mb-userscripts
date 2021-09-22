import { assertHasValue } from '../../lib/util/assert';

import type { CoverArt, CoverArtProvider } from './base';
import { ArtworkTypeIDs } from './base';

const ID_MATCH_REGEX = /\/album\/[^/]+\/([A-Za-z0-9]+)(?:\/|$)/;

export class QobuzProvider implements CoverArtProvider {
    supportedDomains = ['qobuz.com']
    favicon = 'https://www.qobuz.com/favicon.ico'
    name = 'Qobuz'

    supportsUrl(url: URL): boolean {
        return ID_MATCH_REGEX.test(url.pathname);
    }

    async findImages(url: URL): Promise<CoverArt[]> {
        const id = url.pathname.match(ID_MATCH_REGEX)?.[1];
        assertHasValue(id);
        const d1 = id.substring(id.length - 2);
        const d2 = id.substring(id.length - 4, id.length - 2);
        // Is this always .jpg?
        const imgUrl = `https://static.qobuz.com/images/covers/${d1}/${d2}/${id}_org.jpg`;
        return [{
            url: new URL(imgUrl),
            type: [ArtworkTypeIDs.Front],
        }];
    }
}
