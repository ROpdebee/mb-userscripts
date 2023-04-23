import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { assertDefined } from '@lib/util/assert';
import { parseDOM, qs, qsMaybe } from '@lib/util/dom';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

const ERROR_404_QUERY = '.n-for404';
const COVER_IMG_QUERY = '.cover > img.j-img';

export class NetEaseProvider extends CoverArtProvider {
    public readonly supportedDomains = ['music.163.com'];
    public readonly name = 'NetEase';
    public readonly favicon = 'https://s1.music.126.net/style/favicon.ico';
    protected readonly urlRegex = /\/album\?id=(\d+)/;

    protected override cleanUrl(url: URL): string {
        // Album ID is in the query params, base `cleanUrl` strips those away.
        // Could also be part of the hash, so we'll just return the entire URL.
        return url.href;
    }

    public async findImages(url: URL): Promise<CoverArt[]> {
        // There's an API at https://music.163.com/api/album/${releaseId}, however,
        // it requires a cookie to be set to access. To set this cookie, we'd
        // need to access one of the NetEase pages, so we may as well just
        // load the release page and extract the image from the HTML.
        const releaseId = this.extractId(url);
        // The hash-based URL loads the cover data dynamically, the normal URL
        // already has the necessary information available.
        const staticUrl = new URL(`https://music.163.com/album?id=${releaseId}`);
        const respDocument = parseDOM(await this.fetchPage(staticUrl), url.href);

        // Returns HTTP 200 on 404 errors. :facepalm:
        if (qsMaybe(ERROR_404_QUERY, respDocument) !== null) {
            throw new Error('NetEase release does not exist');
        }

        const imgElement = qs<HTMLImageElement>(COVER_IMG_QUERY, respDocument);
        const coverUrl = imgElement.dataset.src;
        assertDefined(coverUrl, 'No image found in NetEase release');

        return [{
            url: new URL(coverUrl),
            types: [ArtworkTypeIDs.Front],
        }];
    }
}
