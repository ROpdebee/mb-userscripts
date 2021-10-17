import { HeadMetaPropertyProvider } from './base';

export class BandcampProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['bandcamp.com']
    favicon = 'https://s4.bcbits.com/img/favicon/favicon-32x32.png'
    name = 'Bandcamp'
    urlRegex = /:\/\/(.+)\.bandcamp\.com\/(track|album)\/([^/]+)(?:\/|$)/;

    override extractId(url: URL): string | undefined {
        return url.href.match(this.urlRegex)?.slice(1)?.join('/');
    }
}
