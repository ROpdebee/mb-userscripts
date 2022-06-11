import { assertHasValue } from '@lib/util/assert';

import type { CoverArt } from './base';
import { AmazonProvider } from './amazon';
import { CoverArtProvider } from './base';

export class AmazonMusicProvider extends CoverArtProvider {
    public readonly supportedDomains = [
        'music.amazon.ca', 'music.amazon.de', 'music.amazon.es',
        'music.amazon.fr', 'music.amazon.in', 'music.amazon.it',
        'music.amazon.co.jp', 'music.amazon.co.uk', 'music.amazon.com',
        'music.amazon.com.au', 'music.amazon.com.br', 'music.amazon.com.mx'];

    public readonly favicon = 'https://d5fx445wy2wpk.cloudfront.net/icons/amznMusic_favicon.png';
    public readonly name = 'Amazon Music';
    protected readonly urlRegex = /\/albums\/([A-Za-z\d]{10})(?:\/|$)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        // Translate Amazon Music to Amazon product links. The cover art should
        // be the same, but extracting the cover art from Amazon Music requires
        // complex API requests with CSRF tokens, whereas product pages are much
        // easier. Besides, cover art on product pages tends to be larger.
        // NOTE: I'm not 100% certain the images are always identical, or that
        // the associated product always exists.
        const asin = this.extractId(url);
        assertHasValue(asin);
        const productUrl = new URL(url.href);
        productUrl.hostname = productUrl.hostname.replace(/^music\./, '');
        productUrl.pathname = '/dp/' + asin;

        return new AmazonProvider().findImages(productUrl);
    }
}
