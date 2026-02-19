import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { NetEaseProvider } from '@src/mb_enhanced_cover_art_uploads/providers/netease';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('netease provider', () => {
    const provider = new NetEaseProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'album URL with ID in hash',
            url: 'https://music.163.com/#/album?id=163089853',
            id: '163089853',
        }, {
            description: 'album URL without hash',
            url: 'https://music.163.com/album?id=163089853',
            id: '163089853',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://music.163.com/artist?id=33913095',
        }, {
            description: 'song URLs',
            url: 'https://music.163.com/song?id=2020080118',
        }, {
            description: 'playlist URLs',
            url: 'https://music.163.com/playlist?id=6988887522',
        }, {
            description: 'playlist URLs with hash',
            url: 'https://music.163.com/#/playlist?id=6988887522',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'album',
            url: 'https://music.163.com/#/album?id=163089853',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: '109951168552478687.jpg',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://music.163.com/album?id=1231232',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});

// 2026-02: Album information now seems authwalled.
