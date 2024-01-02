import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { JamendoProvider } from '@src/mb_enhanced_cover_art_uploads/providers/jamendo';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('jamendo provider', () => {
    const provider = new JamendoProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'album URL without album name',
            url: 'https://www.jamendo.com/album/454973',
            id: '454973',
        }, {
            description: 'album URL with album name',
            url: 'https://www.jamendo.com/album/454973/to-aurora',
            id: '454973',
        }];

        const unsupportedUrls = [{
            description: 'artist URL',
            url: 'https://www.jamendo.com/artist/535912/smoking-with-poets',
        }, {
            description: 'track URL',
            url: 'https://www.jamendo.com/track/1885651/to-aurora',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'album',
            url: 'https://www.jamendo.com/album/454973/to-aurora',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'cid=1652438482',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://www.jamendo.com/album/abcdef',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
