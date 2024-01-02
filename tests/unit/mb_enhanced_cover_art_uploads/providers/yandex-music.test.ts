import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { YandexMusicProvider } from '@src/mb_enhanced_cover_art_uploads/providers/yandex-music';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('yandex music provider', () => {
    const provider = new YandexMusicProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'album URL',
            url: 'https://music.yandex.com/album/13554341',
            id: '13554341',
        }];

        const unsupportedUrls = [{
            desc: 'artist URL',
            url: 'https://music.yandex.com/artist/168862',
        }, {
            desc: 'label URL',
            url: 'https://music.yandex.com/label/2681159',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'album',
            url: 'https://music.yandex.com/album/13554341',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '4382806/8af5be94.a.13554341-1',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://music.yandex.com/album/abcdef',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
