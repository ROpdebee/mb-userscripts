import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { RateYourMusicProvider } from '@src/mb_enhanced_cover_art_uploads/providers/rateyourmusic';

import { itBehavesLike } from '@test-utils/shared_behaviour';

import { urlMatchingSpec } from './url_matching_spec';
import { findImagesSpec } from './find_images_spec';

describe('rateyourmusic provider', () => {
    const provider = new RateYourMusicProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'album URLs',
            url: 'https://rateyourmusic.com/release/album/fishmans/long-season.p/',
            id: 'fishmans/long-season.p',
        }, {
            desc: 'album buy URLs',
            url: 'https://rateyourmusic.com/release/album/fishmans/long-season.p/buy/',
            id: 'fishmans/long-season.p',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://rateyourmusic.com/artist/fishmans',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        // Note that we're manually modifying the recording since the tests are
        // not logged in.
        const extractionCases = [{
            desc: 'release when logged in',
            url: 'https://rateyourmusic.com/release/album/fishmans/long-season.p/',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'dd6dc758bde2ed6dfeb5db2b486d97c1/7461038',
                types: [ArtworkTypeIDs.Front],
                comment: undefined,
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://rateyourmusic.com/release/album/fishmans/long/',
        }, {
            desc: 'release when not logged in',
            url: 'https://rateyourmusic.com/release/album/fishmans/long-season.p/',
            errorMessage: /requires being logged in/,
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
