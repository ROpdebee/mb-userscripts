import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { BugsProvider } from '@src/mb_enhanced_cover_art_uploads/providers/bugs';
import { itBehavesLike } from '@test-utils/shared_behaviour';

import { findImagesSpec } from './find_images_spec';
import { urlMatchingSpec } from './url_matching_spec';

describe('bugs provider', () => {
    const provider = new BugsProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'release URLs',
            url: 'https://music.bugs.co.kr/album/4078166',
            id: '4078166',
        }, {
            desc: 'dirty release URLs',
            url: 'https://music.bugs.co.kr/album/4078166?wl_ref=list_ab_03_ar',
            id: '4078166',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://music.bugs.co.kr/artist/80373333',
        }, {
            desc: 'track URLs',
            url: 'https://music.bugs.co.kr/track/6170522',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release',
            url: 'https://music.bugs.co.kr/album/4078166',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '40781/4078166',
                types: [ArtworkTypeIDs.Front],
                comment: undefined,
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://music.bugs.co.kr/album/abcd',
            errorMessage: 'Bugs! release does not exist',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
