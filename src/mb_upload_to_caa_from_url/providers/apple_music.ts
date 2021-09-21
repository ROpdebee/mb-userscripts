import { HeadMetaPropertyProvider } from './base';

export class AppleMusicProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['music.apple.com', 'itunes.apple.com']

    supportsUrl(url: URL): boolean {
        return /\w{2}\/album\/(?:.+\/)?(?:id)?\d+/.test(url.pathname);
    }
}
