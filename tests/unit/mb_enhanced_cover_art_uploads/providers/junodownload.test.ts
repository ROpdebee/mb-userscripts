import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { JunoDownloadProvider } from '@src/mb_enhanced_cover_art_uploads/providers/junodownload';
import { itBehavesLike } from '@test-utils/shared_behaviour';

import { findImagesSpec } from './find_images_spec';
import { urlMatchingSpec } from './url_matching_spec';

describe('juno download provider', () => {
    const provider = new JunoDownloadProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'product URLs with album name',
            url: 'https://www.junodownload.com/products/david-bowie-lets-dance-40th-anniversary-remix-e/6024697-02/',
            id: '6024697-02',
        }, {
            desc: 'product URLs without album name',
            url: 'https://www.junodownload.com/products/6024697-02',
            id: '6024697-02',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://www.junodownload.com/artists/David+Bowie/releases/',
        }, {
            desc: 'label URLs',
            url: 'https://www.junodownload.com/labels/Rhino/',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release',
            url: 'https://www.junodownload.com/products/david-bowie-lets-dance-40th-anniversary-remix-e/6024697-02',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'CS6024697-02A-BIG.jpg',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://www.junodownload.com/products/404-02/',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
