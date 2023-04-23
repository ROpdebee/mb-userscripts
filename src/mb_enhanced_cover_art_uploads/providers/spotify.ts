import { qsMaybe } from '@lib/util/dom';

import { HeadMetaPropertyProvider } from './base';

export class SpotifyProvider extends HeadMetaPropertyProvider {
    public readonly supportedDomains = ['open.spotify.com'];
    public readonly favicon = 'https://open.spotifycdn.com/cdn/images/favicon32.8e66b099.png';
    public readonly name = 'Spotify';
    protected readonly urlRegex = /\/album\/(\w+)/;

    protected override is404Page(doc: Document): boolean {
        return qsMaybe('head > meta[property="og:title"]', doc) === null;
    }
}
