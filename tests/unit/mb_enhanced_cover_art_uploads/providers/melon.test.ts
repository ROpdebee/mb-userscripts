import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { MelonProvider } from '@src/mb_enhanced_cover_art_uploads/providers/melon';

import { itBehavesLike } from '@test-utils/shared_behaviour';

import { urlMatchingSpec } from './url_matching_spec';
import { findImagesSpec } from './find_images_spec';

describe('melon provider', () => {
    const provider = new MelonProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'release URLs',
            url: 'https://www.melon.com/album/detail.htm?albumId=10749882',
            id: '10749882',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://www.melon.com/artist/timeline.htm?artistId=561051',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release',
            url: 'https://www.melon.com/album/detail.htm?albumId=10749882',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '10749882_20211022144758',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://www.melon.com/album/detail.htm?albumId=0',
            errorMessage: 'Melon release does not exist',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
