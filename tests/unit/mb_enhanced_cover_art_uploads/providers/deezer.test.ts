import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { DeezerProvider } from '@src/mb_enhanced_cover_art_uploads/providers/deezer';
import { itBehavesLike } from '@test-utils/shared_behaviour';

import { findImagesSpec } from './find_images_spec';
import { urlMatchingSpec } from './url_matching_spec';

describe('deezer provider', () => {
    const provider = new DeezerProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'clean album URLs',
            url: 'https://www.deezer.com/album/260364202',
            id: '260364202',
        }, {
            desc: 'dirty album URLs',
            url: 'https://www.deezer.com/en/album/215928292?deferredFl=1',
            id: '215928292',
        }, {
            desc: 'album URLs with language',
            url: 'https://www.deezer.com/en/album/215928292',
            id: '215928292',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://www.deezer.com/en/artist/4023815',
        }, {
            desc: 'track URLs',
            url: 'https://www.deezer.com/en/track/1500277672',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release',
            url: 'https://www.deezer.com/en/album/260364202',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '4097bb08bad497561ef60ec53162351e',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            desc: 'release with placeholder image',
            url: 'https://www.deezer.com/de/album/673547',
            numImages: 0,
            expectedImages: [],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://www.deezer.com/en/album/1',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
