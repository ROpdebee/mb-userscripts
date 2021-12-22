import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { assertNonNull } from '@lib/util/assert';
import { parseDOM, qsMaybe } from '@lib/util/dom';
import { safeParseJSON } from '@lib/util/json';
import { GMgetResourceUrl } from '@src/compat';

import type { CoverArt } from './base';
import { CoverArtProvider } from './base';

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

// CSS queries to figure out which type of page we're on
const AUDIBLE_PAGE_QUERY = '.audible_mm_title';  // Audible buttons on standard product pages
const DIGITAL_PAGE_QUERY = '.DigitalMusicDetailPage';
const PHYSICAL_AUDIOBOOK_PAGE_QUERY = '#booksImageBlock_feature_div';

// CSS queries to extract a front cover from a page
const AUDIBLE_FRONT_IMAGE_QUERY = '#mf_pdp_hero_widget_book_img img';  // Only for /hz/audible/mlp/mfpdp pages.
const DIGITAL_FRONT_IMAGE_QUERY = '#digitalMusicProductImage_feature_div > img';

export class AmazonProvider extends CoverArtProvider {
    supportedDomains = [
        'amazon.ae', 'amazon.ca', 'amazon.cn', 'amazon.de', 'amazon.eg',
        'amazon.es', 'amazon.fr', 'amazon.in', 'amazon.it', 'amazon.jp',
        'amazon.nl', 'amazon.pl', 'amazon.sa', 'amazon.se', 'amazon.sg',
        'amazon.co.jp', 'amazon.co.uk', 'amazon.com', 'amazon.com.au',
        'amazon.com.br', 'amazon.com.mx', 'amazon.com.tr'];
    // Favicon URL is blocked by Firefox' Enhanced Tracking Protection
    get favicon(): Promise<string> {
        return GMgetResourceUrl('amazonFavicon');
    }

    name = 'Amazon';
    urlRegex = /\/(?:gp\/product|dp|hz\/audible\/mlp\/mfpdp)\/([A-Za-z0-9]{10})(?:\/|$)/;

    async findImages(url: URL): Promise<CoverArt[]> {
        const pageContent = await this.fetchPage(url);
        const pageDom = parseDOM(pageContent, url.href);

        // eslint-disable-next-line init-declarations
        let finder: typeof this.findDigitalImages;
        if (qsMaybe(AUDIBLE_PAGE_QUERY, pageDom)) {
            LOGGER.debug('Searching for images in Audible page');
            finder = this.findAudibleImages;
        } else if (qsMaybe(DIGITAL_PAGE_QUERY, pageDom)) {
            LOGGER.debug('Searching for images in digital release page');
            finder = this.findDigitalImages;
        } else if (qsMaybe(PHYSICAL_AUDIOBOOK_PAGE_QUERY, pageDom)) {
            LOGGER.debug('Searching for images in physical audiobook page');
            finder = this.findPhysicalAudiobookImages;
        } else {
            LOGGER.debug('Searching for images in generic physical page');
            finder = this.findGenericPhysicalImages;
        }

        const covers = await finder.bind(this)(url, pageContent, pageDom);
        return covers.filter((img) => !PLACEHOLDER_IMG_REGEX.test(img.url.href));
    }

    async findGenericPhysicalImages(_url: URL, pageContent: string): Promise<CoverArt[]> {
        const imgs = this.#extractEmbeddedJSImages(pageContent, /\s*'colorImages': { 'initial': (.+)},$/m) as AmazonImage[] | null;
        assertNonNull(imgs, 'Failed to extract images from embedded JS on generic physical page');

        return imgs.map((img) => {
            // `img.hiRes` is probably only `null` when `img.large` is the placeholder image?
            return this.#convertVariant({ url: img.hiRes ?? img.large, variant: img.variant });
        });
    }

    async findPhysicalAudiobookImages(_url: URL, pageContent: string): Promise<CoverArt[]> {
        const imgs = this.#extractEmbeddedJSImages(pageContent, /\s*'imageGalleryData' : (.+),$/m) as Array<{ mainUrl: string }> | null;
        assertNonNull(imgs, 'Failed to extract images from embedded JS on physical audiobook page');

        // Amazon embeds no image variants on these pages, so we don't know the types
        return imgs.map((img) => ({ url: new URL(img.mainUrl) }));
    }

    async findDigitalImages(_url: URL, _pageContent: string, pageDom: Document): Promise<CoverArt[]> {
        return this.#extractFrontCover(pageDom, DIGITAL_FRONT_IMAGE_QUERY);
    }

    async findAudibleImages(url: URL, _pageContent: string, pageDom: Document): Promise<CoverArt[]> {
        // We can only extract 500px images from standard product pages. Prefer
        // /hz/audible/mlp/mfpdp pages which should have the same image in its
        // full resolution.
        if (/\/(?:gp\/product|dp)\//.test(url.pathname)) {
            const audibleUrl = new URL(url.pathname.replace(/\/(?:gp\/product|dp)\//, '/hz/audible/mlp/mfpdp/'), url);
            const audibleContent = await this.fetchPage(audibleUrl);
            const audibleDom = parseDOM(audibleContent, audibleUrl.href);
            return this.findAudibleImages(audibleUrl, audibleContent, audibleDom);
        }

        return this.#extractFrontCover(pageDom, AUDIBLE_FRONT_IMAGE_QUERY);
    }

    #extractFrontCover(pageDom: Document, selector: string): CoverArt[] {
        const productImage = qsMaybe<HTMLImageElement>(selector, pageDom);
        assertNonNull(productImage, 'Could not find front image on Amazon page');
        return [{
            // Only returning the thumbnail, IMU will maximise
            url: new URL(productImage.src),
            types: [ArtworkTypeIDs.Front],
        }];
    }

    #extractEmbeddedJSImages(pageContent: string, jsonRegex: RegExp): object[] | null {
        const embeddedImages = pageContent.match(jsonRegex)?.[1];
        if (!embeddedImages) {
            LOGGER.debug('Could not extract embedded JS images, regex did not match');
            return null;
        }

        const imgs = safeParseJSON<object[]>(embeddedImages);
        if (!Array.isArray(imgs)) {
            LOGGER.debug(`Could not parse embedded JS images, not array, got ${imgs}`);
            return null;
        }

        return imgs;
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