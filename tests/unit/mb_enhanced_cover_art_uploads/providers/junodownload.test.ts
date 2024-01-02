import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { JunoDownloadProvider } from '@src/mb_enhanced_cover_art_uploads/providers/junodownload';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('juno download provider', () => {
    const provider = new JunoDownloadProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'product URLs with album name',
            url: 'https://www.junodownload.com/products/david-bowie-lets-dance-40th-anniversary-remix-e/6024697-02/',
            id: '6024697-02',
        }, {
            description: 'product URLs without album name',
            url: 'https://www.junodownload.com/products/6024697-02',
            id: '6024697-02',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://www.junodownload.com/artists/David+Bowie/releases/',
        }, {
            description: 'label URLs',
            url: 'https://www.junodownload.com/labels/Rhino/',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'release',
            url: 'https://www.junodownload.com/products/david-bowie-lets-dance-40th-anniversary-remix-e/6024697-02',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'CS6024697-02A-BIG.jpg',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://www.junodownload.com/products/404-02/',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
