import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { TraxsourceProvider } from '@src/mb_enhanced_cover_art_uploads/providers/traxsource';
import { itBehavesLike } from '@test-utils/shared_behaviour';

import { findImagesSpec } from './find_images_spec';
import { urlMatchingSpec } from './url_matching_spec';

describe('traxsource provider', () => {
    const provider = new TraxsourceProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'album URLs with album name',
            url: 'https://www.traxsource.com/title/1018921/distorting-space-time-remix-ep',
            id: '1018921',
        }, {
            desc: 'album URLs without album name',
            url: 'https://www.traxsource.com/title/1018921',
            id: '1018921',
        }];

        const unsupportedUrls = [{
            desc: 'track URLs',
            url: 'https://www.traxsource.com/track/5596610/distorting-space-time-ron-trent-remix',
        }, {
            desc: 'artist URLs',
            url: 'https://www.traxsource.com/artist/584/joey-negro',
        }, {
            desc: 'label URLs',
            url: 'https://www.traxsource.com/label/49/z-records',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release',
            url: 'https://www.traxsource.com/title/1018921',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'e2dbe7526b59f6adee122addb7817c5c.jpg',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://www.traxsource.com/title/404',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
