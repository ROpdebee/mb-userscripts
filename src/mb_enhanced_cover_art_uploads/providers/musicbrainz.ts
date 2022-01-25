import { assertDefined } from '@lib/util/assert';

import type { CoverArt } from './base';
import { ArchiveProvider } from './archive';
import { CoverArtProvider } from './base';

export class MusicBrainzProvider extends CoverArtProvider {
    supportedDomains = ['musicbrainz.org', 'beta.musicbrainz.org'];
    favicon = 'https://musicbrainz.org/static/images/favicons/favicon-32x32.png';
    override allowButtons = false;
    name = 'MusicBrainz';
    urlRegex = /release\/([a-z0-9-]+)/;

    async findImages(url: URL): Promise<CoverArt[]> {
        const mbid = this.extractId(url);
        assertDefined(mbid);
        // Delegate to Archive.org provider to prevent useless redirects.
        return new ArchiveProvider().findImagesCAA(`mbid-${mbid}`);
    }
}
