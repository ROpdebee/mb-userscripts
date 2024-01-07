import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { BoothProvider } from '@src/mb_enhanced_cover_art_uploads/providers/booth';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('booth provider', () => {
    const provider = new BoothProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'item URLs in Japanese',
            url: 'https://booth.pm/ja/items/1973472',
            id: '1973472',
        }, {
            description: 'item URLs in English',
            url: 'https://booth.pm/en/items/2969400',
            id: '2969400',
        }, {
            description: 'item URLs with shop subdomain',
            url: 'https://iosys.booth.pm/items/4182601',
            id: '4182601',
        }];

        const unsupportedUrls = [{
            description: 'browse URLs',
            url: 'https://booth.pm/en/browse/Vocaloid',
        }, {
            description: 'items URLs without item ID',
            url: 'https://booth.pm/en/items?sort=new',
        }, {
            description: 'shop subdomains without item',
            url: 'https://iosys.booth.pm/',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'album with one image',
            url: 'https://booth.pm/en/items/2969400',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'cb2b3f79-e5d1-4186-811f-229bc4a8cdad',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            description: 'album with multiple images and YouTube embedded video',
            url: 'https://booth.pm/en/items/5211347',
            imageCount: 4,
            expectedImages: [{
                index: 0,
                urlPart: '32585695-9750-4d03-a352-a28b5758c0b0',
                types: [ArtworkTypeIDs.Front],
            }, {
                index: 1,
                urlPart: 'fcd03dd8-8b0b-43b2-8e48-2e653ee29983',
            }],
        }, {
            description: 'item with no images',
            url: 'https://booth.pm/en/items/4129879',
            imageCount: 0,
            expectedImages: [],
        }, {
            description: 'item on custom shop domain',
            url: 'https://iosys.booth.pm/items/4182601',
            imageCount: 2,
            expectedImages: [{
                index: 0,
                urlPart: 'f03d93f8-0b45-4848-a23b-53d5320fb2d1',
                types: [ArtworkTypeIDs.Front],
            }, {
                index: 1,
                urlPart: '6131c0c0-aaa1-4351-9cbf-352abe945f83',
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://booth.pm/ja/items/404',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
