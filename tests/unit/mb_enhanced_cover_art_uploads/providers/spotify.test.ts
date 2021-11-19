import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { SpotifyProvider } from '@src/mb_enhanced_cover_art_uploads/providers/spotify';

import { itBehavesLike } from '@test-utils/shared_behaviour';

import { urlMatchingSpec } from './url_matching_spec';
import { findImagesSpec } from './find_images_spec';

describe('spotify provider', () => {
    const provider = new SpotifyProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'clean album URLs',
            url: 'https://open.spotify.com/album/3hVr04Z3d9HgUCYOjXQHQL',
            id: '3hVr04Z3d9HgUCYOjXQHQL',
        }, {
            desc: 'dirty album URLs',
            url: 'https://open.spotify.com/album/5Lj94YpHLkmjM7JZ8wuURl?si=oXJ7iNcXTqSkcIk8jYBqFQ&dl_branch=1',
            id: '5Lj94YpHLkmjM7JZ8wuURl',
        }];

        const unsupportedUrls = [{
            desc: 'track URLs',
            url: 'https://open.spotify.com/track/49tMnLt1iXNT6QBOsepFyg?si=61de9abff5f94f51',
        }, {
            desc: 'artist URLs',
            url: 'https://open.spotify.com/artist/5Igpc9iLZ3YGtKeYfSrrOE?si=a31abf58e12948fd',
        }, {
            desc: 'playlist URLs',
            url: 'https://open.spotify.com/playlist/2yNg6AGxM4liENyBAE8Wyr'
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release',
            url: 'https://open.spotify.com/album/5Lj94YpHLkmjM7JZ8wuURl',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: /image\/ab67616d0000b273bebe715d1d624070951a795a$/,
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://open.spotify.com/album/5Lj94YpHLkmjM7JZ8wuURi',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
