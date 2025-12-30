import { qsMaybe } from '@lib/util/dom';

import { HeadMetaPropertyProvider } from './base';

export class AppleMusicProvider extends HeadMetaPropertyProvider {
    public readonly supportedDomains = ['music.apple.com', 'itunes.apple.com'];
    public readonly favicon = 'https://music.apple.com/assets/favicon/favicon-32.png';
    public readonly name = 'Apple Music';
    protected readonly urlRegex = /\w{2}\/album\/(?:.+\/)?(?:id)?(\d+)/;

    protected override is404Page(document_: Document): boolean {
        return qsMaybe('head > title', document_) === null;
    }
}
