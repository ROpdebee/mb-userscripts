import { AllMusicProvider } from '@src/mb_enhanced_cover_art_uploads/providers/allmusic';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('allmusic provider', () => {
    const provider = new AllMusicProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'dirty release URLs',
            url: 'https://www.allmusic.com/album/release/thank-you-mr0005436124',
            id: 'mr0005436124',
        }, {
            desc: 'clean release URLs',
            url: 'https://www.allmusic.com/album/release/mr0001629006',
            id: 'mr0001629006',
        }];

        const unsupportedUrls = [{
            desc: 'album URLs',
            url: 'https://www.allmusic.com/album/mw0002164927',
        }, {
            desc: 'artist URLs',
            url: 'https://www.allmusic.com/artist/mn0002274989',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release',
            url: 'https://www.allmusic.com/album/release/thank-you-mr0005436124',
            numImages: 2,
            expectedImages: [{
                index: 0,
                urlPart: '4p3r7hpq0yPN_xNPFX06ICpQg_7iAU1wjqLgK_xGXts',
            }, {
                index: 1,
                urlPart: 'vzF6ozntwFTLCP_8J89ceIAf7E_1E-2MlBBPmPAXRBU',
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release redirecting to album',
            url: 'https://www.allmusic.com/album/release/mr1234',
            errorMessage: /Refusing to extract images from/,
        }, {
            desc: 'non-existent release redirecting to homepage',
            url: 'https://www.allmusic.com/album/release/mr12314',
            errorMessage: /Refusing to extract images from/,
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
