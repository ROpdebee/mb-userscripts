import { qsMaybe } from '@lib/util/dom';

import { HeadMetaPropertyProvider } from './base';

export class MelonProvider extends HeadMetaPropertyProvider {
    public readonly supportedDomains = ['melon.com'];
    public readonly favicon = 'https://www.melon.com/favicon.ico';
    public readonly name = 'Melon';
    protected readonly urlRegex = /album\/detail\.htm.*[?&]albumId=(\d+)/;

    protected override cleanUrl(url: URL): string {
        // Album ID is in the query params, base `cleanUrl` strips those away.
        return super.cleanUrl(url) + url.search;
    }

    protected override is404Page(document_: Document): boolean {
        return qsMaybe('body > input#returnUrl', document_) !== null;
    }
}
