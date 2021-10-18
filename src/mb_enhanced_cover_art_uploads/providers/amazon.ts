import { LOGGER } from '@lib/logging/logger';
import { parseDOM, qs, qsa, qsMaybe } from '@lib/util/dom';

import type { CoverArt } from './base';
import { ArtworkTypeIDs, CoverArtProvider } from './base';

const PLACEHOLDER_IMG_REGEX = /01RmK(?:\+|%2B)J4pJL/;

// Incomplete, only what we need
interface AmazonImage {
    hiRes: string | null // URL of the largest version, can still be maximised by IMU
    thumb: string // this kind of URL can also be extracted from the sidebar (DOM)
    large: string // maximised version of `thumb`, can not be further maximised by IMU
    variant: string // see mapping below
}

const VARIANT_TYPE_MAPPING: Record<string, ArtworkTypeIDs | undefined> = {
    MAIN: ArtworkTypeIDs.Front,
    FRNT: ArtworkTypeIDs.Front, // not seen in use so far, usually MAIN is used for front covers
    BACK: ArtworkTypeIDs.Back,
    SIDE: ArtworkTypeIDs.Spine, // not seen in use so far
    // PT01: ArtworkTypeIDs.Other,
    // See https://sellercentral.amazon.com/gp/help/external/JV4FNMT7563SF5F for further details
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
        const pageContent = await this.fetchPage(url);
        const pageDom = parseDOM(pageContent);

        if (qsMaybe('#digitalMusicProductImage_feature_div', pageDom) !== null) {
            // Streaming/MP3 product
            return this.#extractFromStreamingProduct(pageDom);
        }

        // For physical products we have to extract the embedded JS from the
        // page source to get all images in their highest available resolution.
        let covers = this.extractFromEmbeddedJS(pageContent);
        if (!covers) {
            // Use the (smaller) image thumbnails in the sidebar as a fallback,
            // although it might not contain all of them. IMU will maximise,
            // but the results are still inferior to the embedded hires images.
            const imgs = qsa<HTMLImageElement>('#altImages img', pageDom);
            covers = imgs.map((img) => {
                let variant = '';
                const dataThumbAction = img.closest('span[data-thumb-action]')?.getAttribute('data-thumb-action');
                if (dataThumbAction) {
                    try {
                        const thumbAction = JSON.parse(dataThumbAction) as { variant: string };
                        variant = thumbAction.variant;
                    } catch (err) {
                        LOGGER.warn('Failed to extract the Amazon image variant code from the JSON attribute');
                    }
                }
                return this.#convertVariant({ url: img.src, variant });
            });
        }

        // Filter out placeholder images.
        return covers.filter((img) => !PLACEHOLDER_IMG_REGEX.test(img.url.href));
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

    extractFromEmbeddedJS(pageContent: string): CoverArt[] | undefined {
        const embeddedImages = pageContent.match(/^'colorImages': { 'initial': (.+)},$/m)?.[1];
        if (embeddedImages) {
            try {
                const imgs = JSON.parse(embeddedImages) as AmazonImage[];
                return imgs.map((img) => {
                    // `img.hiRes` is probably only `null` when `img.large` is the placeholder image?
                    return this.#convertVariant({ url: img.hiRes ?? img.large, variant: img.variant });
                });
            } catch (err) {
                LOGGER.error('Failed to parse Amazon\'s embedded JS', err);
            }
        }
        LOGGER.warn('Failed to extract Amazon images from the embedded JS, falling back to thumbnails');
        return;
    }

    #convertVariant(cover: { url: string; variant: string }): CoverArt {
        const url = new URL(cover.url);
        const type = VARIANT_TYPE_MAPPING[cover.variant];
        LOGGER.debug(`${url.href} has the Amazon image variant code '${cover.variant}'`);
        if (type) {
            return { url, types: [type] };
        }
        return { url };
    }
}
