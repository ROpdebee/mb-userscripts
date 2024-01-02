import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { MelonProvider } from '@src/mb_enhanced_cover_art_uploads/providers/melon';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('melon provider', () => {
    const provider = new MelonProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'release URLs',
            url: 'https://www.melon.com/album/detail.htm?albumId=10749882',
            id: '10749882',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://www.melon.com/artist/timeline.htm?artistId=561051',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'release',
            url: 'https://www.melon.com/album/detail.htm?albumId=10749882',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: '10749882_20211022144758',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://www.melon.com/album/detail.htm?albumId=0',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
