import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { BeatportProvider } from '@src/mb_enhanced_cover_art_uploads/providers/beatport';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('beatport provider', () => {
    const provider = new BeatportProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'album URLs',
            url: 'https://www.beatport.com/release/osa-ep/1778814',
            id: '1778814',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://www.beatport.com/artist/mark-storie/27940',
        }, {
            description: 'label URLs',
            url: 'https://www.beatport.com/label/20-20-ldn-recordings/51248',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'release',
            url: 'https://www.beatport.com/release/osa-ep/1778814',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'e638a042-973b-4822-8478-7470d30064d5',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://www.beatport.com/release/osa-ep/1778',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
