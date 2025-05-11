import type { RequestOptions } from '@lib/util/request';

import { HeadMetaPropertyProvider } from './base';

export class YoutubeProvider extends HeadMetaPropertyProvider {
    public readonly supportedDomains = ['youtube.com'];
    public readonly favicon = 'https://www.youtube.com/s/desktop/e4d15d2c/img/favicon_144x144.png';
    public readonly name = 'YouTube';
    protected readonly urlRegex = /watch\?v=(\w+)/;

    protected override cleanUrl(url: URL): string {
        return super.cleanUrl(url) + url.search;
    }

    protected override is404Page(document_: Document): boolean {
        return document_.body.innerHTML.includes("This video isn't available anymore");
    }

    protected override fetchPage(url: URL, options?: RequestOptions): Promise<string> {
        // Override to add a language header, otherwise the 404 check will break depending on countries.
        return super.fetchPage(url, {
            ...options,
            headers: {
                ...options?.headers,
                'Accept-Language': 'en-GB,en;q=0.5',
            },
        });
    }
}
