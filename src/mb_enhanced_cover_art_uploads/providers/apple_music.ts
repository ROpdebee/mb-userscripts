import { HeadMetaPropertyProvider } from './base';

export class AppleMusicProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['music.apple.com', 'itunes.apple.com'];
    favicon = 'https://music.apple.com/favicon.ico';
    name = 'Apple Music';
    urlRegex = /\w{2}\/album\/(?:.+\/)?(?:id)?(\d+)/;
}
