import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { assertDefined } from '@lib/util/assert';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

// Monstercat releases have multiple options for cover art:
// https://www.monstercat.com/release/{release_id}/cover
//      -> Redirects to Google storage, seems like the original?
// https://cdx.monstercat.com/?encoding=...&url={above_url}&width=...
//      -> For some parameters, redirects to URL above.
//      -> For other parameters, seems to redirect to a cached copy of transcoded/resized image.
//
// In some cases, e.g. https://www.monstercat.com/release/MCEP270, the second
// URL provides a higher resolution image. However, the images in both URLs are
// of quite poor quality, while the image on Bandcamp is better.

export class MonstercatProvider extends CoverArtProvider {
    public readonly supportedDomains = ['monstercat.com', 'player.monstercat.app'];
    public readonly favicon = 'https://www.monstercat.com/favicon.ico';
    public readonly name = 'Monstercat';
    protected readonly urlRegex = /release\/([^/]+)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        const releaseId = this.extractId(url);
        assertDefined(releaseId);

        // We'll return the image through URL rewriting, but we'll first fetch
        // the page to ensure the release exists and doesn't redirect.
        // player.monstercat.app loads data dynamically, need to check the API
        // instead.
        const checkUrl = (
            url.host === 'player.monstercat.app'
                ? new URL('https://player.monstercat.app/api/catalog/release/' + releaseId)
                : url);
        await this.fetchPage(checkUrl);

        return [{
            // We'll let the fetcher follow the redirect
            url: new URL(`https://www.monstercat.com/release/${releaseId}/cover`),
            types: [ArtworkTypeIDs.Front],
        }];
    }
}
