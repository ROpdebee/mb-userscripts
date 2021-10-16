import { HeadMetaPropertyProvider } from './base';

const ID_REGEX = /(?:\w{2}\/)?album\/(\d+)/;

export class DeezerProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['deezer.com']
    favicon = 'https://e-cdns-files.dzcdn.net/cache/images/common/favicon/favicon-16x16.526cde4edf20647be4ee32cdf35c1c13.png'
    name = 'Deezer'

    supportsUrl(url: URL): boolean {
        return ID_REGEX.test(url.pathname);
    }

    extractId(url: URL): string | undefined {
        return url.pathname.match(ID_REGEX)?.[1];
    }
}
