import { parseDOM, qs, qsa, qsMaybe } from '@lib/util/dom';

import type { CoverArt } from './base';
import { ArtworkTypeIDs, CoverArtProvider } from './base';

const PLACEHOLDER_IMG_REGEX = /01RmK(?:\+|%2B)J4pJL/;

// Incomplete, only what we need
interface AmazonImage {
    hiRes: string | null // URL of the largest version, can still be maximised by IMU
    thumb: string // this kind of URL can also be extracted from the DOM
    large: string // maximised version of `thumb`, can not be further maximised by IMU
    variant: string // see mapping below
}

const VARIANT_TYPE_MAPPING: Record<string, ArtworkTypeIDs | undefined> = {
    MAIN: ArtworkTypeIDs.Front,
    BACK: ArtworkTypeIDs.Back,
    // PT01: ArtworkTypeIDs.Other,
    // PT02... Are these additional images always photos or renderings of the packaging?
};

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
        const page = await this.fetchPage(url);
        const pageDom = parseDOM(page);

        if (qsMaybe('#digitalMusicProductImage_feature_div', pageDom) !== null) {
            // Streaming/MP3 product
            return this.#extractFromStreamingProduct(pageDom);
        }

        // eslint-disable-next-line init-declarations
        let covers: CoverArt[];

        const embeddedImages = page.match(/^'colorImages': { 'initial': (.+)},$/m)?.[1];
        if (embeddedImages) {
            // Found image sources in the page's embedded JavaScript
            const imgs = JSON.parse(embeddedImages) as AmazonImage[];
            covers = imgs.map((img) => {
                // `img.hiRes` is probably only `null` when `img.large` is the placeholder image?
                const url = new URL(img.hiRes ?? img.large);
                const type = VARIANT_TYPE_MAPPING[img.variant];
                if (type) {
                    return { url, types: [type] };
                }
                return { url };
            });
        } else {
            // Thumbnails in the sidebar, IMU will maximise (but it might not be the highest resolution available)
            const imgs = qsa<HTMLImageElement>('#altImages img', pageDom);
            covers = imgs.map((img) => ({ url: new URL(img.src) }));
        }

        // Filter out placeholder images.
        covers = covers.filter((img) => !PLACEHOLDER_IMG_REGEX.test(img.url.href));

        // We don't know anything about the types of these images if they are
        // from the thumbnail sidebar, but we can probably assume the first
        // image is the front cover if its type has not been set already.
        if (covers.length && covers[0].types === undefined) {
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
