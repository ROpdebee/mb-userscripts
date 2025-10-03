import type { RequestOptions } from '@lib/util/request';
import { qsMaybe } from '@lib/util/dom';

import { HeadMetaPropertyProvider } from './base';

export class SpotifyProvider extends HeadMetaPropertyProvider {
    public readonly supportedDomains = ['open.spotify.com'];
    public readonly favicon = 'https://open.spotifycdn.com/cdn/images/favicon32.8e66b099.png';
    public readonly name = 'Spotify';
    protected readonly urlRegex = /\/album\/(\w+)/;

    protected override is404Page(document_: Document): boolean {
        return qsMaybe('head > meta[property="og:title"]', document_) === null;
    }

    // Spotify messes with Open Graph tags based on User-Agent. See also https://community.metabrainz.org/t/551947/210
    protected override fetchPage(url: URL, options?: RequestOptions): Promise<string> {
        return super.fetchPage(url, {
            ...options,
            headers: {
                ...options?.headers,
                'User-Agent': '',
            },
        });
    }
}
