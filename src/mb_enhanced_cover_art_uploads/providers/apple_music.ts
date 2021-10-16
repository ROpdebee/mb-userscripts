import { HeadMetaPropertyProvider } from './base';

const ID_REGEX = /\w{2}\/album\/(?:.+\/)?(?:id)?(\d+)/;

export class AppleMusicProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['music.apple.com', 'itunes.apple.com']
    favicon = 'https://music.apple.com/favicon.ico'
    name = 'Apple Music'

    supportsUrl(url: URL): boolean {
        return ID_REGEX.test(url.pathname);
    }

    extractId(url: URL): string | undefined {
        return url.pathname.match(ID_REGEX)?.[1];
    }
}
