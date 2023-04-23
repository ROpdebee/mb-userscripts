import { qsMaybe } from '@lib/util/dom';

import { HeadMetaPropertyProvider } from './base';

export class BugsProvider extends HeadMetaPropertyProvider {
    public readonly supportedDomains = ['music.bugs.co.kr'];
    public readonly favicon = 'https://file.bugsm.co.kr/wbugs/common/faviconBugs.ico';
    public readonly name = 'Bugs!';
    protected readonly urlRegex = /album\/(\d+)/;

    protected override isSafeRedirect(originalUrl: URL, redirectedUrl: URL): boolean {
        // HACK: Bugs! redirects to '/noMusic' but doesn't return a 404 status code.
        // We need to consider this a safe redirect, otherwise the unsafe redirect
        // error gets thrown before we can check for 404 pages.
        return redirectedUrl.pathname === '/noMusic' || super.isSafeRedirect(originalUrl, redirectedUrl);
    }

    protected override is404Page(doc: Document): boolean {
        return qsMaybe('.pgNoMusic', doc) !== null;
    }
}
