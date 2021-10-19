import { LOGGER } from '@lib/logging/logger';
import { parseDOM, qsa, qsMaybe } from '@lib/util/dom';
import { safeParseJSON } from '@lib/util/json';

import type { CoverArt } from './base';
import { ArtworkTypeIDs, CoverArtProvider } from './base';

const PLACEHOLDER_IMG_REGEX = /01RmK(?:\+|%2B)J4pJL/;

// Incomplete, only what we need
interface AmazonImage {
    hiRes: string | null; // URL of the largest version, can still be maximised by IMU
    thumb: string; // this kind of URL can also be extracted from the sidebar (DOM)
    large: string; // maximised version of `thumb`, can not be further maximised by IMU
    variant: string; // see mapping below
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

        // Look for products which only have a single image, the front cover.
        const frontCover = this.#extractFrontCover(pageDom);
        if (frontCover) {
            return [frontCover];
        }

        // For physical products we have to extract the embedded JS from the
        // page source to get all images in their highest available resolution.
        let covers = this.extractFromEmbeddedJS(pageContent);
        if (!covers) {
            // Use the (smaller) image thumbnails in the sidebar as a fallback,
            // although it might not contain all of them. IMU will maximise,
            // but the results are still inferior to the embedded hires images.
            covers = this.extractFromThumbnailSidebar(pageDom);
        }
        if (!covers.length) {
            // Handle physical audiobooks, the above extractors fail for those.
            LOGGER.warn('Found no release images, trying to find an Amazon (audio)book gallery…');
            covers = this.extractFromEmbeddedJSGallery(pageContent) ?? /* istanbul ignore next: Should never happen */[];
        }

        // Filter out placeholder images.
        return covers.filter((img) => !PLACEHOLDER_IMG_REGEX.test(img.url.href));
    }

    #extractFrontCover(pageDom: Document): CoverArt | undefined {
        const frontCoverSelectors = [
            '#digitalMusicProductImage_feature_div > img', // Streaming/MP3 products
            'img#main-image', // Audible products
        ];

        for (const selector of frontCoverSelectors) {
            const productImage = qsMaybe<HTMLImageElement>(selector, pageDom);
            if (productImage) {
                // Only returning the thumbnail, IMU will maximise
                return {
                    url: new URL(productImage.src),
                    types: [ArtworkTypeIDs.Front],
                };
            }
        }

        // Different product type (or no image found)
        return;
    }

    extractFromEmbeddedJS(pageContent: string): CoverArt[] | undefined {
        const embeddedImages = pageContent.match(/^'colorImages': { 'initial': (.+)},$/m)?.[1];
        if (!embeddedImages) {
            LOGGER.warn('Failed to extract Amazon images from the embedded JS, falling back to thumbnails');
            return;
        }

        const imgs = safeParseJSON<AmazonImage[]>(embeddedImages);
        if (!Array.isArray(imgs)) {
            LOGGER.error("Failed to parse Amazon's embedded JS, falling back to thumbnails");
            return;
        }

        return imgs.map((img) => {
            // `img.hiRes` is probably only `null` when `img.large` is the placeholder image?
            return this.#convertVariant({ url: img.hiRes ?? img.large, variant: img.variant });
        });
    }

    extractFromEmbeddedJSGallery(pageContent: string): CoverArt[] | undefined {
        const embeddedGallery = pageContent.match(/^'imageGalleryData' : (.+),$/m)?.[1];
        if (!embeddedGallery) {
            LOGGER.warn('Failed to extract Amazon images from the embedded JS (audio)book gallery');
            return;
        }

        const imgs = safeParseJSON<Array<{ mainUrl: string }>>(embeddedGallery);
        if (!Array.isArray(imgs)) {
            LOGGER.error("Failed to parse Amazon's embedded JS (audio)book gallery");
            return;
        }

        // Amazon embeds no image variants on these pages, so we don't know the types
        return imgs.map((img) => ({ url: new URL(img.mainUrl) }));
    }

    extractFromThumbnailSidebar(pageDom: Document): CoverArt[] {
        const imgs = qsa<HTMLImageElement>('#altImages img', pageDom);
        return imgs.map((img) => {
            const dataThumbAction = img.closest('span[data-thumb-action]')?.getAttribute('data-thumb-action');
            const variant = dataThumbAction && safeParseJSON<{ variant: string }>(dataThumbAction)?.variant;

            /* istanbul ignore if: Difficult to exercise */
            if (!variant) {
                LOGGER.warn('Failed to extract the Amazon image variant code from the JSON attribute');
            }

            return this.#convertVariant({ url: img.src, variant });
        });
    }

    #convertVariant(cover: { url: string; variant?: string | null }): CoverArt {
        const url = new URL(cover.url);
        const type = cover.variant && VARIANT_TYPE_MAPPING[cover.variant];
        LOGGER.debug(`${url.href} has the Amazon image variant code '${cover.variant}'`);

        if (type) {
            return { url, types: [type] };
        }
        return { url };
    }
}
