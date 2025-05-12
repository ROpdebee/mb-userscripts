import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { parseDOM, qs } from '@lib/util/dom';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

export class MetalArchivesProvider extends CoverArtProvider {
    public readonly supportedDomains = ['metal-archives.com'];
    public readonly favicon = 'https://www.metal-archives.com/favicon.ico';
    public readonly name = 'Metal Archives';
    protected readonly urlRegex = /albums\/([^/]+\/[^/]+(?:\/\d+)?)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        // We can actually figure out the cover image URL from the release ID
        // but explicitly requesting the page helps to identify dead links.
        const responseContent = await this.fetchPage(url);

        // Check for "redirects" when the release ID is invalid but an album with
        // the same name exists. These could be removed variants, perhaps.
        if (/'Release ID "\d+" not found/.test(responseContent)) {
            throw new Error('Release ID not found');
        }

        const responseDocument = parseDOM(responseContent, url.href);
        const imageAnchor = qs<HTMLAnchorElement>('#cover', responseDocument);

        return [{
            url: new URL(imageAnchor.href),
            // Assume front
            types: [ArtworkTypeIDs.Front],
        }];
    }
}
