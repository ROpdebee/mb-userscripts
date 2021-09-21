import { HeadMetaPropertyProvider } from './base';

export class DeezerProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['deezer.com']

    supportsUrl(url: URL): boolean {
        return /(?:\w{2}\/)?album\/\d+/.test(url.pathname);
    }
}
