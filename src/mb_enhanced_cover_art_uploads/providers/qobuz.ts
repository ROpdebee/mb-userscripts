import { assertHasValue } from '../../lib/util/assert';

import type { CoverArt, CoverArtProvider } from './base';
import { ArtworkTypeIDs } from './base';

// Splitting these regexps up for each domain. www.qobuz.com includes the album
// title in the URL, open.qobuz.com does not. Although we could make the album
// title part optional and match both domains with the same regexp, this could
// lead to issues with URLs like this:
// https://open.qobuz.com/album/1234567890/related
// Not sure if such URLs would ever occur, but using a single regexp could
// lead to `related` being matched as the ID and the actual ID as the title.
const WWW_ID_MATCH_REGEX = /\/album\/[^/]+\/([A-Za-z0-9]+)(?:\/|$)/;
const OPEN_ID_MATCH_REGEX = /\/album\/([A-Za-z0-9]+)(?:\/|$)/;

export class QobuzProvider implements CoverArtProvider {
    supportedDomains = ['qobuz.com', 'open.qobuz.com']
    favicon = 'https://www.qobuz.com/favicon.ico'
    name = 'Qobuz'

    supportsUrl(url: URL): boolean {
        if (url.hostname === 'open.qobuz.com') {
            return OPEN_ID_MATCH_REGEX.test(url.pathname);
        }

        return WWW_ID_MATCH_REGEX.test(url.pathname);
    }

    static extractId(url: URL): string {
        if (url.hostname === 'open.qobuz.com') {
            return url.pathname.match(OPEN_ID_MATCH_REGEX)?.[1];
        }

        return url.pathname.match(WWW_ID_MATCH_REGEX)?.[1];
    }

    async findImages(url: URL): Promise<CoverArt[]> {
        const id = QobuzProvider.extractId(url);
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
