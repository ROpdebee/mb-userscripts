import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { TraxsourceProvider } from '@src/mb_enhanced_cover_art_uploads/providers/traxsource';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('traxsource provider', () => {
    const provider = new TraxsourceProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'album URLs with album name',
            url: 'https://www.traxsource.com/title/1018921/distorting-space-time-remix-ep',
            id: '1018921',
        }, {
            description: 'album URLs without album name',
            url: 'https://www.traxsource.com/title/1018921',
            id: '1018921',
        }];

        const unsupportedUrls = [{
            description: 'track URLs',
            url: 'https://www.traxsource.com/track/5596610/distorting-space-time-ron-trent-remix',
        }, {
            description: 'artist URLs',
            url: 'https://www.traxsource.com/artist/584/joey-negro',
        }, {
            description: 'label URLs',
            url: 'https://www.traxsource.com/label/49/z-records',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'release',
            url: 'https://www.traxsource.com/title/1018921',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'e2dbe7526b59f6adee122addb7817c5c.jpg',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://www.traxsource.com/title/404',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});

// 2026-02: Test case bumps into a 502 error but confirmed working in the built scripts.
