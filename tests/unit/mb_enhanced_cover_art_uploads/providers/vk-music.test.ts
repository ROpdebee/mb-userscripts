import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { VKMusicProvider } from '@src/mb_enhanced_cover_art_uploads/providers/vk-music';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('vk music provider', () => {
    const provider = new VKMusicProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'album URLs',
            url: 'https://vk.com/music/album/-2000547103_15547103',
            id: '2000547103_15547103',
        }, {
            description: 'mobile album URLs',
            url: 'https://m.vk.com/audio?act=audio_playlist-2000547103_15547103',
            id: '2000547103_15547103',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://vk.com/artist/shortparis',
        }, {
            description: 'video URLs',
            url: 'https://vk.com/video-55721573_456239715',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'release',
            url: 'https://vk.com/music/album/-2000027853_11027853',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'c858436/v858436087/232f2b/dIzw5aVzr1A.jpg',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://vk.com/music/album/-20547120_15547120',
            errorMessage: /./, // Error message is incorrect because in the tests, we're getting redirected to the mobile site.
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});

// 2026-02: Authwalled.
