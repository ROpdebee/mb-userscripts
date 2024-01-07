import { MusikSammlerProvider } from '@src/mb_enhanced_cover_art_uploads/providers/musik-sammler';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('musik-sammler provider', () => {
    const provider = new MusikSammlerProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'release URLs',
            url: 'https://www.musik-sammler.de/release/vanilla-fudge-vanilla-fudge-cd-1539691/',
            id: '1539691',
        }, {
            description: 'short release URLs',
            url: 'https://www.musik-sammler.de/release/1539691/',
            id: '1539691',
        }];

        const unsupportedUrls = [{
            description: 'album URLs',
            url: 'https://www.musik-sammler.de/album/vanilla-fudge-vanilla-fudge-995842/',
        }, {
            description: 'artist URLs',
            url: 'https://www.musik-sammler.de/artist/vanilla-fudge/',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'release',
            url: 'https://www.musik-sammler.de/release/vanilla-fudge-vanilla-fudge-cd-1539691/',
            imageCount: 3,
            expectedImages: [{
                index: 0,
                urlPart: '1539691_1635313476.jpg',
            }, {
                index: 1,
                urlPart: '1539691_1_1635313476.jpg',
            }, {
                index: 2,
                urlPart: '1539691_2_1635313476.jpg',
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://www.musik-sammler.de/release/vanilla-fudge-vanilla-fudge-cd-1539/',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
