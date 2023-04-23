import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { BoothProvider } from '@src/mb_enhanced_cover_art_uploads/providers/booth';
import { itBehavesLike } from '@test-utils/shared_behaviour';

import { findImagesSpec } from './find_images_spec';
import { urlMatchingSpec } from './url_matching_spec';

describe('booth provider', () => {
    const provider = new BoothProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'item URLs in Japanese',
            url: 'https://booth.pm/ja/items/1973472',
            id: '1973472',
        }, {
            desc: 'item URLs in English',
            url: 'https://booth.pm/en/items/2969400',
            id: '2969400',
        }];

        const unsupportedUrls = [{
            desc: 'browse URLs',
            url: 'https://booth.pm/en/browse/Vocaloid',
        }, {
            desc: 'items URLs without item ID',
            url: 'https://booth.pm/en/items?sort=new',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'album with one image',
            url: 'https://booth.pm/en/items/2969400',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'cb2b3f79-e5d1-4186-811f-229bc4a8cdad',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            desc: 'album with multiple images and YouTube embedded video',
            url: 'https://booth.pm/ja/items/1973472',
            numImages: 2,
            expectedImages: [{
                index: 0,
                urlPart: '80eef6e0-2ac9-4e0a-95ce-47163efe9717',
                types: [ArtworkTypeIDs.Front],
            }, {
                index: 1,
                urlPart: '0cb0b6fa-647d-4300-9c04-35a78c3c9fce',
            }],
        }, {
            desc: 'item with no images',
            // Not really an album
            url: 'https://booth.pm/en/items/4710069',
            numImages: 0,
            expectedImages: [],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://booth.pm/ja/items/404',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
