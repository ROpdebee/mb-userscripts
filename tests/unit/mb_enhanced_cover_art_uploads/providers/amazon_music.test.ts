import { AmazonMusicProvider } from '@src/mb_enhanced_cover_art_uploads/providers/amazon_music';
import { itBehavesLike } from '@test-utils/shared_behaviour';

import { findImagesSpec } from './find_images_spec';
import { urlMatchingSpec } from './url_matching_spec';

describe('amazon music provider', () => {
    const provider = new AmazonMusicProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'album URLs',
            url: 'https://music.amazon.com/albums/B08Y99SFVJ',
            id: 'B08Y99SFVJ',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://music.amazon.com/artists/B08YC6GFB7/hannapeles',
        }, {
            desc: 'playlist URLs',
            url: 'https://music.amazon.com/playlists/B07H8NWNNF',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        /*const extractionCases = [{
            desc: 'release using Amazon provider',
            url: 'https://music.amazon.com/albums/B08MCFCQD8',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '81NnKXVjJvL',
                types: [ArtworkTypeIDs.Front],
            }],
        }];*/
        const extractionFailedCases = [{
            desc: 'release using Amazon provider',
            url: 'https://music.amazon.com/albums/B08MCFCQD8',
            errorMessage: /Amazon Music releases are currently not supported/,
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases: [], extractionFailedCases });
    });
});
