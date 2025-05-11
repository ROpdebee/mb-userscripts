import { GMgetResourceUrl } from '@lib/compat';
import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { assertNonNull } from '@lib/util/assert';
import { parseDOM, qsMaybe } from '@lib/util/dom';
import { safeParseJSON } from '@lib/util/json';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

const PLACEHOLDER_IMG_NAMES = [
    '01RmK+J4pJL', // .com via B000Q3KSMQ
    '01QFb8SNuTL', // .de via B08F6QNPJ4
    '01PkLIhTX3L', // .fr via B08F6QNPJ4
    '01MKUOLsA5L', // .co.jp via B003XZRSAE
    '31CTP6oiIBL', // Found on .pl and .es, e.g. B00E6GJAE6
];

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
const MUSIC_DIGITAL_PAGE_QUERY = '#nav-global-location-data-modal-action[data-a-modal*="dmusicRetailMp3Player"]'; // Dynamically loaded Amazon Music digital pages.

export class AmazonProvider extends CoverArtProvider {
    public readonly supportedDomains = [
        'amazon.ae', 'amazon.ca', 'amazon.cn', 'amazon.de', 'amazon.eg',
        'amazon.es', 'amazon.fr', 'amazon.in', 'amazon.it', 'amazon.jp',
        'amazon.nl', 'amazon.pl', 'amazon.sa', 'amazon.se', 'amazon.sg',
        'amazon.co.jp', 'amazon.co.uk', 'amazon.com', 'amazon.com.au',
        'amazon.com.br', 'amazon.com.mx', 'amazon.com.tr'];

    // Favicon URL is blocked by Firefox' Enhanced Tracking Protection
    public get favicon(): Promise<string> {
        return GMgetResourceUrl('amazonFavicon');
    }

    public readonly name = 'Amazon';
    protected readonly urlRegex = /\/(?:gp\/product|dp|hz\/audible\/mlp\/mfpdp)\/([A-Za-z\d]{10})(?:\/|$)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        const pageContent = await this.fetchPage(url);
        const pageDom = parseDOM(pageContent, url.href);

        // Check for Amazon rate limiting
        // istanbul ignore next: Difficult to exercise in tests.
        if (qsMaybe('form[action="/errors/validateCaptcha"]', pageDom) !== null) {
            throw new Error('Amazon served a captcha page');
        }

        // Amazon made it really difficult to extract images from these sort
        // of pages, so we don't support it for now.
        if (qsMaybe(MUSIC_DIGITAL_PAGE_QUERY, pageDom)) {
            throw new Error('Amazon Music releases are currently not supported. Please use a different provider or copy the image URL manually.');
        }

        const covers = this.findGenericPhysicalImages(url, pageContent);
        return covers.filter((image) => !PLACEHOLDER_IMG_NAMES.some((name) => decodeURIComponent(image.url.pathname).includes(name)));
    }

    private findGenericPhysicalImages(_url: URL, pageContent: string): CoverArt[] {
        const imgs = this.extractEmbeddedJSImages(pageContent, /\s*'colorImages': { 'initial': (.+)},$/m) as AmazonImage[] | null;
        assertNonNull(imgs, 'Failed to extract images from embedded JS on generic physical page');

        return imgs.map((image) => {
            // `img.hiRes` is probably only `null` when `img.large` is the placeholder image?
            return this.convertVariant({ url: image.hiRes ?? image.large, variant: image.variant });
        });
    }

    private extractEmbeddedJSImages(pageContent: string, jsonRegex: RegExp): object[] | null {
        const embeddedImages = jsonRegex.exec(pageContent)?.[1];
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

    private convertVariant(cover: { url: string; variant?: string | null }): CoverArt {
        const url = new URL(cover.url);
        const type = cover.variant && VARIANT_TYPE_MAPPING[cover.variant];
        LOGGER.debug(`${url.href} has the Amazon image variant code '${cover.variant}'`);

        if (type) {
            return { url, types: [type] };
        }
        return { url };
    }
}
