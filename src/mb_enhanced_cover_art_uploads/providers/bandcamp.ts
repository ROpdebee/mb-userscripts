import { HeadMetaPropertyProvider } from './base';

const ID_REGEX = /:\/\/(.+)\.bandcamp\.com\/(track|album)\/([^/]+)(?:\/|$)/;

export class BandcampProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['bandcamp.com']
    favicon = 'https://s4.bcbits.com/img/favicon/favicon-32x32.png'
    name = 'Bandcamp'

    supportsUrl(url: URL): boolean {
        return ID_REGEX.test(url.href);
    }

    extractId(url: URL): string | undefined {
        return url.href.match(ID_REGEX)?.slice(1)?.join('/');
    }
}
