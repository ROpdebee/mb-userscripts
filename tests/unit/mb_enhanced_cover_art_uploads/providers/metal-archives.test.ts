import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { MetalArchivesProvider } from '@src/mb_enhanced_cover_art_uploads/providers/metal-archives';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('metal archives provider', () => {
    const provider = new MetalArchivesProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'album URLs',
            url: 'https://www.metal-archives.com/albums/Desaster/The_Evil_Dead_Will_Rise_Again/671199',
            id: 'Desaster/The_Evil_Dead_Will_Rise_Again/671199',
        }, {
            description: 'album URLs without ID',
            url: 'https://www.metal-archives.com/albums/Desaster/The_Evil_Dead_Will_Rise_Again/',
            id: 'Desaster/The_Evil_Dead_Will_Rise_Again',
        }];

        const unsupportedUrls = [{
            description: 'band URLs',
            url: 'https://www.metal-archives.com/bands/Desaster/277',
        }, {
            description: 'label URLs',
            url: 'https://www.metal-archives.com/labels/M_Entertainment_Label_%28Maharaja_Network%29/31066',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'album',
            url: 'https://www.metal-archives.com/albums/Desaster/The_Evil_Dead_Will_Rise_Again/671199',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: '6/7/1/1/671199.jpg',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://www.metal-archives.com/albums/eede/abdd/99999999',
        }, {
            description: 'non-existent release ID with existing title',
            url: 'https://www.metal-archives.com/albums/Desaster/The_Evil_Dead_Will_Rise_Again/99999999',
            errorMessage: /Release ID not found/,
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
