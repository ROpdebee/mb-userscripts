import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { NetEaseProvider } from '@src/mb_enhanced_cover_art_uploads/providers/netease';
import { itBehavesLike } from '@test-utils/shared_behaviour';

import { findImagesSpec } from './find_images_spec';
import { urlMatchingSpec } from './url_matching_spec';

describe('netease provider', () => {
    const provider = new NetEaseProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'album URL with ID in hash',
            url: 'https://music.163.com/#/album?id=163089853',
            id: '163089853',
        }, {
            desc: 'album URL without hash',
            url: 'https://music.163.com/album?id=163089853',
            id: '163089853',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://music.163.com/artist?id=33913095',
        }, {
            desc: 'song URLs',
            url: 'https://music.163.com/song?id=2020080118',
        }, {
            desc: 'playlist URLs',
            url: 'https://music.163.com/playlist?id=6988887522',
        }, {
            desc: 'playlist URLs with hash',
            url: 'https://music.163.com/#/playlist?id=6988887522',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'album',
            url: 'https://music.163.com/#/album?id=163089853',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '109951168552478687.jpg',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://music.163.com/album?id=1231232',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
