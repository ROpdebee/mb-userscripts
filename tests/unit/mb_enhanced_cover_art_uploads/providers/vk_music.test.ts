import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { VKMusicProvider } from '@src/mb_enhanced_cover_art_uploads/providers/vk_music';
import { itBehavesLike } from '@test-utils/shared_behaviour';

import { findImagesSpec } from './find_images_spec';
import { urlMatchingSpec } from './url_matching_spec';

describe('vk music provider', () => {
    const provider = new VKMusicProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'album URLs',
            url: 'https://vk.com/music/album/-2000547103_15547103',
            id: '2000547103_15547103',
        }, {
            desc: 'mobile album URLs',
            url: 'https://m.vk.com/audio?act=audio_playlist-2000547103_15547103',
            id: '2000547103_15547103',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://vk.com/artist/shortparis',
        }, {
            desc: 'video URLs',
            url: 'https://vk.com/video-55721573_456239715',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release',
            url: 'https://vk.com/music/album/-2000027853_11027853',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'c858436/v858436087/232f2b/dIzw5aVzr1A.jpg',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://vk.com/music/album/-20547120_15547120',
            errorMessage: /./, // Error message is incorrect because in the tests, we're getting redirected to the mobile site.
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
