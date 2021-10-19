import { qs, qsa, qsMaybe } from '@lib/util/dom';

import type { CoverArt } from './base';
import { ArtworkTypeIDs, CoverArtProvider } from './base';

const PLACEHOLDER_IMG_REGEX = /01RmK(?:\+|%2B)J4pJL/;

export class AmazonProvider extends CoverArtProvider {
    supportedDomains = [
        'amazon.ca', 'amazon.cn', 'amazon.de', 'amazon.es', 'amazon.fr',
        'amazon.it', 'amazon.jp', 'amazon.nl', 'amazon.co.jp', 'amazon.co.uk',
        'amazon.com'];
    // Favicon URL is blocked by Firefox' Enhanced Tracking Protection
    get favicon(): string {
        return GM_getResourceURL('amazonFavicon');
    }

    name = 'Amazon';
    urlRegex = /\/(?:gp\/product|dp)\/([A-Za-z0-9]{10})(?:\/|$)/;

    async findImages(url: URL): Promise<CoverArt[]> {
        const pageDom = await this.fetchPageDOM(url);

        if (qsMaybe('#digitalMusicProductImage_feature_div', pageDom) !== null) {
            // Streaming/MP3 product
            return this.#extractFromStreamingProduct(pageDom);
        }

        // Thumbnails in the sidebar, IMU will maximise
        const imgs = qsa<HTMLImageElement>('#altImages img', pageDom);
        const covers: CoverArt[] = imgs
            // Filter out placeholder images.
            .filter((img) => !PLACEHOLDER_IMG_REGEX.test(img.src))
            .map((img) => {
                return { url: new URL(img.src) };
            });

        // We don't know anything about the types of these images, but we can
        // probably assume the first image is the front cover.
        if (covers.length) {
            covers[0].types = [ArtworkTypeIDs.Front];
        }

        return covers;
    }

    #extractFromStreamingProduct(doc: Document): CoverArt[] {
        const img = qs<HTMLImageElement>('#digitalMusicProductImage_feature_div > img', doc);
        // For MP3/Streaming releases, we know the cover is the front one.
        // Only returning the thumbnail, IMU will maximise
        return [{
            url: new URL(img.src),
            types: [ArtworkTypeIDs.Front],
        }];
    }
}
