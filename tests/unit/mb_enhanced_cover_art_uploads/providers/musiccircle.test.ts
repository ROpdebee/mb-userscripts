import { MusicCircleProvider } from '@src/mb_enhanced_cover_art_uploads/providers/musiccircle';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('musiccircle provider', () => {
    const provider = new MusicCircleProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'product URLs',
            url: 'https://musiccircle.co.in/products/avinash-vyas-amar-devidas-vinyl',
            id: 'avinash-vyas-amar-devidas-vinyl',
        }, {
            description: 'dirty product URLs',
            url: 'https://musiccircle.co.in/products/david-cassidy-some-kind-of-summer-45-rpm?pr_prod_strat=e5_desc&pr_rec_id=f5e32ae0e&pr_rec_pid=9592445239586&pr_ref_pid=9592281432354&pr_seq=uniform',
            id: 'david-cassidy-some-kind-of-summer-45-rpm',
        }];

        const unsupportedUrls = [{
            description: 'collection URLs',
            url: 'https://musiccircle.co.in/collections/jazz-vinyl-pre-owned',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'product',
            url: 'https://musiccircle.co.in/products/mr-acker-bilk-and-his-paramount-jazz-band-summer-set-45-rpm',
            imageCount: 2,
            expectedImages: [{
                index: 0,
                urlPart: '8742aac4-e1a1-40a7-8d3f-bdff4a7e26c5',
            }, {
                index: 1,
                urlPart: '97a7dbc1-0485-41d4-ac50-8c5fc2e7b908',
            }],
        }, {
            description: 'product with many images',
            url: 'https://musiccircle.co.in/products/betty-carter-the-audience-with-betty-carter-cd',
            imageCount: 5,
            expectedImages: [{
                index: 4,
                urlPart: '23c84eb7-3fa1-4fb2-8afc-ef7a46ec3f63',
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://musiccircle.co.in/products/betty-carter-edwewdwedw',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
