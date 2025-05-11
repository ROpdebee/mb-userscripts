import { AmazonMusicProvider } from '@src/mb_enhanced_cover_art_uploads/providers/amazon-music';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('amazon music provider', () => {
    const provider = new AmazonMusicProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'album URLs',
            url: 'https://music.amazon.com/albums/B08Y99SFVJ',
            id: 'B08Y99SFVJ',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://music.amazon.com/artists/B08YC6GFB7/hannapeles',
        }, {
            description: 'playlist URLs',
            url: 'https://music.amazon.com/playlists/B07H8NWNNF',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionFailedCases = [{
            description: 'release using Amazon provider',
            url: 'https://music.amazon.com/albums/B08MCFCQD8',
            errorMessage: /Amazon Music releases are currently not supported/,
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases: [], extractionFailedCases });
    });
});
