import { HeadMetaPropertyProvider } from './base';

export class SpotifyProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['open.spotify.com']

    supportsUrl(url: URL): boolean {
        return /\/album\/\w+/.test(url.pathname);
    }
}
