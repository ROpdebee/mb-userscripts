import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { assertHasValue } from '@lib/util/assert';
import { parseDOM, qs, qsMaybe } from '@lib/util/dom';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

export class RateYourMusicProvider extends CoverArtProvider {
    public readonly supportedDomains = ['rateyourmusic.com'];
    public readonly favicon = 'https://e.snmc.io/2.5/img/sonemic.png';
    public readonly name = 'RateYourMusic';
    // Include release type in the ID to make sure it doesn't redirect a single
    // to an album and vice versa, and also to simplify the URL transformation
    // below. Release type can be "single", "album", "ep", "musicvideo", etc.
    protected readonly urlRegex = /\/release\/(\w+(?:\/[^/]+){2})(?:\/|$)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        const releaseId = this.extractId(url);
        assertHasValue(releaseId);
        // Need to go through the Buy page to find full-res images. The user
        // must be logged in to get the full-res image. We can't use the
        // thumbnails in case the user is not logged in, since they're served
        // as WebP, which isn't supported by CAA (yet).
        const buyUrl = `https://rateyourmusic.com/release/${releaseId}/buy`;
        const buyDocument = parseDOM(await this.fetchPage(new URL(buyUrl)), buyUrl);

        if (qsMaybe('.header_profile_logged_in', buyDocument) === null) {
            throw new Error('Extracting covers from RYM requires being logged in to an RYM account.');
        }

        const fullResolutionUrl = qs<HTMLAnchorElement>('.qq a', buyDocument).href;
        return [{
            url: new URL(fullResolutionUrl),
            types: [ArtworkTypeIDs.Front],
        }];
    }
}
