import { RockipediaProvider } from '@src/mb_enhanced_cover_art_uploads/providers/rockipedia';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('rockipedia provider', () => {
    const provider = new RockipediaProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'release URLs',
            url: 'https://www.rockipedia.no/utgivelser/jaktprat_-_super_ss_rally_gt_fastback_ha-36860/',
            id: '36860',
        }, {
            desc: 'release URLs with special characters',
            url: 'https://www.rockipedia.no/utgivelser/good_man_good_girl__(radio_edit)-25786/',
            id: '25786',
        }];

        const unsupportedUrls = [{
            desc: 'label URLs',
            url: 'https://www.rockipedia.no/plateselskap/cbs-1251/',
        }, {
            desc: 'artist URLs',
            url: 'https://www.rockipedia.no/artister/oystein_sunde-63460/',
        }, {
            desc: 'release overview URL',
            url: 'https://www.rockipedia.no/utgivelser/',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release with one image',
            url: 'https://www.rockipedia.no/utgivelser/dette_forandrer_alt-4580/',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '?image=3224_original.jpg',
            }],
        }, {
            desc: 'releases with multiple images',
            url: 'https://www.rockipedia.no/utgivelser/jaktprat_-_super_ss_rally_gt_fastback_ha-36860/',
            numImages: 4,
            expectedImages: [{
                index: 0,
                urlPart: '?image=43782_original.jpg',
            }, {
                index: 1,
                urlPart: '?image=43783_original.jpg',
            }, {
                index: 2,
                urlPart: '?image=43784_original.jpg',
            }, {
                index: 3,
                urlPart: '?image=43785_original.jpg',
            }],
        }, {
            desc: 'releases with no images',
            url: 'https://www.rockipedia.no/utgivelser/hei_verden_-_sorte_tyr-36295/',
            numImages: 0,
            expectedImages: [],
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases: [] });
    });
});
