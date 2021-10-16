import { assertHasValue } from '@lib/util/assert';
import { AmazonProvider } from './amazon';

import type { CoverArt } from './base';
import { CoverArtProvider } from './base';

const ID_REGEX = /\/albums\/([A-Za-z0-9]{10})(?:\/|$)/;

export class AmazonMusicProvider extends CoverArtProvider {
    supportedDomains = [
        'music.amazon.ca', 'music.amazon.cn', 'music.amazon.de',
        'music.amazon.es', 'music.amazon.fr', 'music.amazon.it',
        'music.amazon.jp', 'music.amazon.nl', 'music.amazon.co.jp',
        'music.amazon.co.uk', 'music.amazon.com']
    favicon = 'https://d5fx445wy2wpk.cloudfront.net/icons/amznMusic_favicon.png'
    name = 'Amazon Music'

    supportsUrl(url: URL): boolean {
        return ID_REGEX.test(url.pathname);
    }

    extractId(url: URL): string | undefined {
        return url.pathname.match(ID_REGEX)?.[1];
    }

    async findImages(url: URL): Promise<CoverArt[]> {
        // Translate Amazon Music to Amazon product links. The cover art should
        // be the same, but extracting the cover art from Amazon Music requires
        // complex API requests with CSRF tokens, whereas product pages are much
        // easier. Besides, cover art on product pages tends to be larger.
        // NOTE: I'm not 100% certain the images are always identical, or that
        // the associated product always exists.
        const asin = url.pathname.match(/\/albums\/([A-Za-z0-9]{10})(?:\/|$)/)?.[1];
        assertHasValue(asin);
        const productUrl = new URL(url.href);
        productUrl.hostname = productUrl.hostname.replace(/^music\./, '');
        productUrl.pathname = '/dp/' + asin;

        return new AmazonProvider().findImages(productUrl);
    }
}
