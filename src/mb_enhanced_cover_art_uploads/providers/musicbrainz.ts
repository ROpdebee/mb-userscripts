import { assertDefined } from '@lib/util/assert';

import type { CoverArt } from '../types';
import { ArchiveProvider } from './archive';
import { CoverArtProvider } from './base';

export class MusicBrainzProvider extends CoverArtProvider {
    public readonly supportedDomains = ['musicbrainz.org', 'beta.musicbrainz.org'];
    public readonly favicon: string = 'https://musicbrainz.org/static/images/favicons/favicon-32x32.png';
    public override readonly allowButtons = false;
    public readonly name: string = 'MusicBrainz';
    protected readonly urlRegex = /release\/([a-f\d-]+)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        const mbid = this.extractId(url);
        assertDefined(mbid);
        // Delegate to Archive.org provider to prevent useless redirects.
        return new ArchiveProvider().findImagesCAA(`mbid-${mbid}`);
    }
}

// Mostly identical to MB provider, but a different domain and name.
export class CoverArtArchiveProvider extends MusicBrainzProvider {
    public override readonly supportedDomains = ['coverartarchive.org'];
    public override readonly favicon = 'https://coverartarchive.org/favicon.png';
    public override readonly name = 'Cover Art Archive';
    protected override readonly urlRegex = /release\/([a-f\d-]+)\/?$/; // Don't match direct image URLs!
}
