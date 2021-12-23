import { qsMaybe } from '@lib/util/dom';

import { HeadMetaPropertyProvider } from './base';

export class AppleMusicProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['music.apple.com', 'itunes.apple.com'];
    favicon = 'https://music.apple.com/favicon.ico';
    name = 'Apple Music';
    urlRegex = /\w{2}\/album\/(?:.+\/)?(?:id)?(\d+)/;

    override is404Page(doc: Document): boolean {
        return qsMaybe('head > title', doc) === null;
    }
}
