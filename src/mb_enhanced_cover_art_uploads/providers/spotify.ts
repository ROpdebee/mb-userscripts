import { qsMaybe } from '@lib/util/dom';

import { HeadMetaPropertyProvider } from './base';

export class SpotifyProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['open.spotify.com'];
    favicon = 'https://open.scdn.co/cdn/images/favicon32.8e66b099.png';
    name = 'Spotify';
    urlRegex = /\/album\/(\w+)/;

    override is404Page(doc: Document): boolean {
        return qsMaybe('head > meta[property="og:title"]', doc) === null;
    }
}
