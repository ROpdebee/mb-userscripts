import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { assertHasValue } from '@lib/util/assert';
import { parseDOM, qs, qsMaybe } from '@lib/util/dom';

import type { CoverArt } from './base';
import { CoverArtProvider } from './base';


export class RateYourMusicProvider extends CoverArtProvider {
    supportedDomains = ['rateyourmusic.com'];
    favicon = 'https://e.snmc.io/2.5/img/sonemic.png';
    name = 'RateYourMusic';
    // Include release type in the ID to make sure it doesn't redirect a single
    // to an album and vice versa, and also to simplify the URL transformation
    // below.
    urlRegex = /\/release\/((?:album|single)(?:\/[^/]+){2})(?:\/|$)/;

    async findImages(url: URL): Promise<CoverArt[]> {
        const releaseId = this.extractId(url);
        assertHasValue(releaseId);
        // Need to go through the Buy page to find full-res images. The user
        // must be logged in to get the full-res image. We can't use the
        // thumbnails in case the user is not logged in, since they're served
        // as WebP, which isn't supported by CAA (yet).
        const buyUrl = `https://rateyourmusic.com/release/${releaseId}/buy`;
        const buyDoc = parseDOM(await this.fetchPage(new URL(buyUrl)), buyUrl);

        if (qsMaybe('.header_profile_logged_in', buyDoc) === null) {
            throw new Error('Extracting covers from RYM requires being logged in to an RYM account.');
        }

        const fullResUrl = qs<HTMLAnchorElement>('.qq a', buyDoc).href;
        return [{
            url: new URL(fullResUrl),
            types: [ArtworkTypeIDs.Front],
        }];
    }
}
