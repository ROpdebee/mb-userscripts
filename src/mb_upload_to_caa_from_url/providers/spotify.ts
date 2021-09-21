import { HeadMetaPropertyProvider } from './base';

export class SpotifyProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['open.spotify.com']
    favicon = 'https://open.scdn.co/cdn/images/favicon32.8e66b099.png'
    name = 'Spotify'

    supportsUrl(url: URL): boolean {
        return /\/album\/\w+/.test(url.pathname);
    }
}
