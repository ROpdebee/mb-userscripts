import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { BeatportProvider } from '@src/mb_enhanced_cover_art_uploads/providers/beatport';

import { itBehavesLike } from '@test-utils/shared_behaviour';

import { urlMatchingSpec } from './url_matching_spec';
import { findImagesSpec } from './find_images_spec';

describe('beatport provider', () => {
    const provider = new BeatportProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'album URLs',
            url: 'https://www.beatport.com/release/osa-ep/1778814',
            id: '1778814',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://www.beatport.com/artist/mark-storie/27940',
        }, {
            desc: 'label URLs',
            url: 'https://www.beatport.com/label/20-20-ldn-recordings/51248',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release',
            url: 'https://www.beatport.com/release/osa-ep/1778814',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'e638a042-973b-4822-8478-7470d30064d5',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://www.beatport.com/release/osa-ep/1778',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
