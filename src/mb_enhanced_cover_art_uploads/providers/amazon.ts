import { parseDOM, qs, qsa, qsMaybe } from '../../lib/util/dom';
import { gmxhr } from '../../lib/util/xhr';

import type { CoverArt, CoverArtProvider } from './base';
import { ArtworkTypeIDs } from './base';

export class AmazonProvider implements CoverArtProvider {
    supportedDomains = [
        'amazon.ca', 'amazon.cn', 'amazon.de', 'amazon.es', 'amazon.fr',
        'amazon.it', 'amazon.jp', 'amazon.nl', 'amazon.co.jp', 'amazon.co.uk',
        'amazon.com']
    // Favicon URL is blocked by Firefox' Enhanced Tracking Protection
    favicon = GM_getResourceURL('amazonFavicon')
    name = 'Amazon'

    supportsUrl(url: URL): boolean {
        return /\/(?:gp\/product|dp)\/[A-Za-z0-9]{10}(?:\/|$)/.test(url.pathname);
    }

    async findImages(url: URL): Promise<CoverArt[]> {
        const pageResp = await gmxhr({ url: url.href, method: 'GET' });
        const pageDom = parseDOM(pageResp.responseText);

        if (qsMaybe('#digitalMusicProductImage_feature_div', pageDom) !== null) {
            // Streaming/MP3 product
            return this.#extractFromStreamingProduct(pageDom);
        }

        // Thumbnails in the sidebar, IMU will maximise
        const imgs = qsa<HTMLImageElement>('#altImages img', pageDom);
        const covers: CoverArt[] = imgs.map((img) => {
            return { url: new URL(img.src) };
        });

        // We don't know anything about the types of these images, but we can
        // probably assume the first image is the front cover.
        if (covers.length) {
            covers[0].type = [ArtworkTypeIDs.Front];
        }

        return covers;
    }

    #extractFromStreamingProduct(doc: Document): CoverArt[] {
        const img = qs<HTMLImageElement>('#digitalMusicProductImage_feature_div > img', doc);
        // For MP3/Streaming releases, we know the cover is the front one.
        // Only returning the thumbnail, IMU will maximise
        return [{
            url: new URL(img.src),
            type: [ArtworkTypeIDs.Front],
        }];
    }
}
