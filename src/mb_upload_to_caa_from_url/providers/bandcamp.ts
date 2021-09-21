import { HeadMetaPropertyProvider } from './base';

export class BandcampProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['bandcamp.com']

    supportsUrl(url: URL): boolean {
        return /bandcamp\.com\/(?:track|album)\//.test(url.href);
    }
}
