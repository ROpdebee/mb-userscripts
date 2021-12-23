import { qsMaybe } from '@lib/util/dom';

import { HeadMetaPropertyProvider } from './base';

export class MelonProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['melon.com'];
    favicon = 'https://www.melon.com/favicon.ico';
    name = 'Melon';
    urlRegex = /album\/detail\.htm.*[?&]albumId=(\d+)/;

    override cleanUrl(url: URL): string {
        // Album ID is in the query params, base `cleanUrl` strips those away.
        return super.cleanUrl(url) + url.search;
    }

    override is404Page(doc: Document): boolean {
        return qsMaybe('body > input#returnUrl', doc) !== null;
    }
}
