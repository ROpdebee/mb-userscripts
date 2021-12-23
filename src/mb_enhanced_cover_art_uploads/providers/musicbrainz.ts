import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { assertDefined } from '@lib/util/assert';
import { safeParseJSON } from '@lib/util/json';
import { urlBasename } from '@lib/util/urls';

import type { CoverArt } from './base';
import { CoverArtProvider } from './base';

interface CAAIndex {
    images: Array<{
        comment: string;
        types: string[];
        id: string | number;  // Used to be string in the past, hasn't been applied retroactively yet, see CAA-129
        image: string;
    }>;
}

export class MusicBrainzProvider extends CoverArtProvider {
    supportedDomains = ['musicbrainz.org', 'beta.musicbrainz.org'];
    favicon = 'https://musicbrainz.org/static/images/favicons/favicon-32x32.png';
    override allowButtons = false;
    name = 'MusicBrainz';
    urlRegex = /release\/([a-z0-9-]+)/;

    async findImages(url: URL): Promise<CoverArt[]> {
        const mbid = this.extractId(url);
        assertDefined(mbid);
        // Grabbing metadata through CAA isn't 100% reliable, since the info
        // in the index.json isn't always up-to-date (see CAA-129, only a few
        // cases though).
        const caaIndexUrl = `https://archive.org/download/mbid-${mbid}/index.json`;
        const caaResp = await fetch(caaIndexUrl);
        if (caaResp.status >= 400) {
            throw new Error(`Cannot load index.json: HTTP error ${caaResp.status}`);
        }
        // Could just use resp.json() here, but let's be safe in case IA returns
        // something other than JSON.
        const caaIndex = safeParseJSON<CAAIndex>(await caaResp.text(), 'Could not parse index.json');

        return caaIndex.images.map((img) => {
            const imageFileName = urlBasename(img.image);
            return {
                // Skip one level of indirection
                url: new URL(`https://archive.org/download/mbid-${mbid}/mbid-${mbid}-${imageFileName}`),
                comment: img.comment,
                types: img.types.map((type) => ArtworkTypeIDs[type as keyof typeof ArtworkTypeIDs]),
            };
        });
    }
}
