import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { DeezerProvider } from '@src/mb_enhanced_cover_art_uploads/providers/deezer';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('deezer provider', () => {
    const provider = new DeezerProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'clean album URLs',
            url: 'https://www.deezer.com/album/260364202',
            id: '260364202',
        }, {
            description: 'dirty album URLs',
            url: 'https://www.deezer.com/en/album/215928292?deferredFl=1',
            id: '215928292',
        }, {
            description: 'album URLs with language',
            url: 'https://www.deezer.com/en/album/215928292',
            id: '215928292',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://www.deezer.com/en/artist/4023815',
        }, {
            description: 'track URLs',
            url: 'https://www.deezer.com/en/track/1500277672',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'release',
            url: 'https://www.deezer.com/en/album/260364202',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: '4097bb08bad497561ef60ec53162351e',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            description: 'release with placeholder image',
            url: 'https://www.deezer.com/us/album/6279837',
            imageCount: 0,
            expectedImages: [],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://www.deezer.com/en/album/1',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});

// 2026-02: Release with placeholder image is 404, but the placeholder image still has the same hash
//          as evidenced by the Deezer image in `dimensions.test.ts`.
