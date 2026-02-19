import type { CoverArtProvider } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { RateYourMusicProvider } from '@src/mb_enhanced_cover_art_uploads/providers/rateyourmusic';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('rateyourmusic provider', () => {
    const provider: CoverArtProvider = new RateYourMusicProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'album URLs',
            url: 'https://rateyourmusic.com/release/album/fishmans/long-season.p/',
            id: 'album/fishmans/long-season.p',
        }, {
            description: 'album buy URLs',
            url: 'https://rateyourmusic.com/release/album/fishmans/long-season.p/buy/',
            id: 'album/fishmans/long-season.p',
        }, {
            description: 'single URLs',
            url: 'https://rateyourmusic.com/release/single/hot_dad/undertale/',
            id: 'single/hot_dad/undertale',
        }, {
            description: 'single buy URLs',
            url: 'https://rateyourmusic.com/release/single/hot_dad/undertale/buy',
            id: 'single/hot_dad/undertale',
        }, {
            description: 'EP URLs',
            url: 'https://rateyourmusic.com/release/ep/the-atlas-moth-ken-mode/the-atlas-moth-ken-mode/',
            id: 'ep/the-atlas-moth-ken-mode/the-atlas-moth-ken-mode',
        }, {
            description: 'music video URLs',
            url: 'https://rateyourmusic.com/release/musicvideo/ken-mode/the-terror-pulse/',
            id: 'musicvideo/ken-mode/the-terror-pulse',
        }, {
            description: 'additional release URLs',
            url: 'https://rateyourmusic.com/release/additional/ken-mode/daytrotter-session/',
            id: 'additional/ken-mode/daytrotter-session',
        }, {
            description: 'compilation URLs',
            url: 'https://rateyourmusic.com/release/comp/various-artists/killed-by-canada/',
            id: 'comp/various-artists/killed-by-canada',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://rateyourmusic.com/artist/fishmans',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'release',
            url: 'https://rateyourmusic.com/release/album/fishmans/long-season.p/',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: '779dd5ed865edb423844a27cd996343a/10504082',
                types: [ArtworkTypeIDs.Front],
                comment: undefined,
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://rateyourmusic.com/release/album/fishmans/long/',
        }, {
            description: 'Cloudflare captcha pages',
            url: 'https://rateyourmusic.com/release/album/fishmans/long-season.p/',
            errorMessage: /Cloudflare captcha/,
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});

// 2026-02: RYM not reachable, unknown if working.
