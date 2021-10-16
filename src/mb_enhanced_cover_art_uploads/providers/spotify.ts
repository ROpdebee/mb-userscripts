import { HeadMetaPropertyProvider } from './base';

const ID_REGEX = /\/album\/(\w+)/;
export class SpotifyProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['open.spotify.com']
    favicon = 'https://open.scdn.co/cdn/images/favicon32.8e66b099.png'
    name = 'Spotify'

    supportsUrl(url: URL): boolean {
        return ID_REGEX.test(url.pathname);
    }

    extractId(url: URL): string | undefined {
        return url.pathname.match(ID_REGEX)?.[1];
    }
}
