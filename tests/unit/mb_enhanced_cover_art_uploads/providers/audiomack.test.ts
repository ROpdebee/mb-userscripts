import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { AudiomackProvider } from '@src/mb_enhanced_cover_art_uploads/providers/audiomack';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('audiomack provider', () => {
    const provider = new AudiomackProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'album URLs',
            url: 'https://audiomack.com/key-glock/album/yellow-tape-2-deluxe',
            id: 'key-glock/album/yellow-tape-2-deluxe',
        }, {
            description: 'song URLs',
            url: 'https://audiomack.com/key-glock/song/pain-killers-clean',
            id: 'key-glock/song/pain-killers-clean',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://audiomack.com/key-glock',
        }, {
            description: 'playlist URLs',
            url: 'https://audiomack.com/joevango/playlist/verified-hh',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'album',
            url: 'https://audiomack.com/key-glock/album/yellow-tape-2-deluxe',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'f879a0938375da775a061d710d7bc8d94e7909f52502fa3d00d5d6337c543b59.jpeg',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            description: 'song',
            url: 'https://audiomack.com/key-glock/song/pain-killers',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'fbc4f33e8133ea04d0fc56abbdee067c117a78ab2f151708346e822d2a1e91aa.jpeg',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://audiomack.com/key-glock/song/pain-killers-test123',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
