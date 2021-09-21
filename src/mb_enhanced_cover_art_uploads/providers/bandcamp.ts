import { HeadMetaPropertyProvider } from './base';

export class BandcampProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['bandcamp.com']
    favicon = 'https://s4.bcbits.com/img/favicon/favicon-32x32.png'
    name = 'Bandcamp'

    supportsUrl(url: URL): boolean {
        return /bandcamp\.com\/(?:track|album)\//.test(url.href);
    }
}
