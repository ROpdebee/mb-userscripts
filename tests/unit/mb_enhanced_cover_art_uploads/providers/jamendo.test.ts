import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { JamendoProvider } from '@src/mb_enhanced_cover_art_uploads/providers/jamendo';
import { itBehavesLike } from '@test-utils/shared_behaviour';

import { findImagesSpec } from './find_images_spec';
import { urlMatchingSpec } from './url_matching_spec';

describe('jamendo provider', () => {
    const provider = new JamendoProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'album URL without album name',
            url: 'https://www.jamendo.com/album/454973',
            id: '454973',
        }, {
            desc: 'album URL with album name',
            url: 'https://www.jamendo.com/album/454973/to-aurora',
            id: '454973',
        }];

        const unsupportedUrls = [{
            desc: 'artist URL',
            url: 'https://www.jamendo.com/artist/535912/smoking-with-poets',
        }, {
            desc: 'track URL',
            url: 'https://www.jamendo.com/track/1885651/to-aurora',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'album',
            url: 'https://www.jamendo.com/album/454973/to-aurora',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'cid=1652438482',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://www.jamendo.com/album/abcdef',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
