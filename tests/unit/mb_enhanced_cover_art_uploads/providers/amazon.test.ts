import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { AmazonProvider } from '@src/mb_enhanced_cover_art_uploads/providers/amazon';
import { mockGMgetResourceURL } from '@test-utils/gm-mocks';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import type { ExtractionCase } from './find-images-spec';
import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('amazon provider', () => {
    const provider = new AmazonProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'dirty product URLs',
            url: 'https://www.amazon.com/Pattern-Seeking-Animals/dp/B07RZ2T9F1/ref=tmm_acd_swatch_0?_encoding=UTF8&qid=&sr=',
            id: 'B07RZ2T9F1',
        }, {
            description: 'dirty product URLs without trailing slash',
            url: 'https://www.amazon.com/Chronicles-Narnia-Collectors-Radio-Theatre/dp/1624053661?qsid=145-0543367-7486236',
            id: '1624053661',
        }, {
            description: 'dp URLs',
            url: 'https://www.amazon.com/dp/B07RZ2T9F1',
            id: 'B07RZ2T9F1',
        }, {
            description: 'gp URLs',
            url: 'https://www.amazon.com/gp/product/B07RZ2T9F1',
            id: 'B07RZ2T9F1',
        }];

        const unsupportedUrls = [{
            description: 'search URLs',
            url: 'https://www.amazon.com/s/ref=dp_byline_sr_music_1?ie=UTF8&field-artist=Pattern-Seeking+Animals&search-alias=music',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const expectedPhysical = {
            imageCount: 2,
            expectedImages: [{
                index: 0,
                urlPart: '51f7hRG0IrL',
                types: [ArtworkTypeIDs.Front],
            }, {
                index: 1,
                urlPart: '61YPk7xRUSL',
            }],
        };

        const extractionCases: ExtractionCase[] = [{
            description: 'physical products from the embedded JS on dp URLs',
            url: 'https://www.amazon.com/dp/B0D2JLXK38',
            ...expectedPhysical,
        }, {
            description: 'physical products from the embedded JS on gp URLs',
            url: 'https://www.amazon.com/gp/product/B0D2JLXK38',
            ...expectedPhysical,
        }, {
            description: 'physical audiobooks from the embedded JS',
            url: 'https://www.amazon.com/dp/0563504196',
            imageCount: 2,
            expectedImages: [{
                index: 0,
                urlPart: '91OEsuYoClL',
                types: [ArtworkTypeIDs.Front],
            }, {
                index: 1,
                urlPart: '91NVbKDHCWL',
            }],
        }, {
            description: 'physical audiobooks where Audible version is also available',
            url: 'https://www.amazon.com/gp/product/207055998X',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: '812VSsX9rpL',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            description: 'Audible audiobooks',
            url: 'https://www.amazon.com/dp/B017WJ5PR4',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: '91WJ0q27ddL',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            description: 'Audible audiobooks with dirty URL',
            url: 'https://www.amazon.com/Harry-Potter-%C3%A0-l%C3%89cole-Sorciers/dp/B06Y65ZVWV',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: '91zPf7ACV9L',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'http://amazon.com/gp/product/B01NCKFNXH',
        }, {
            description: 'digital releases on dp URLs',
            url: 'https://www.amazon.com/dp/B07R92TVWN',
            errorMessage: /Amazon Music releases are currently not supported/,
        }, {
            description: 'digital releases on gp URLs',
            url: 'https://www.amazon.com/gp/product/B07R92TVWN',
            errorMessage: /Amazon Music releases are currently not supported/,
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });

        it('returns no covers for product without images', async () => {
            const covers = await provider.findImages(new URL('https://www.amazon.com/dp/B000Q3KSMQ'));

            expect(covers).toBeEmpty();
        });

        const physicalJsonFailCases = [
            ['cannot be extracted', ''],
            ['cannot be parsed', "'colorImages': { 'initial': invalid },"],
            ['is invalid type', "'colorImages': { 'initial': 123 },"],
        ];

        it.each(physicalJsonFailCases)('fails to grab generic images if JSON %s', (_1, content) => {
            const url = new URL('https://www.amazon.com/dp/fake');

            expect(() => provider['findGenericPhysicalImages'](url, content))
                .toThrowWithMessage(Error, 'Failed to extract images from embedded JS on generic physical page');
        });
    });

    it('provides a favicon', async () => {
        mockGMgetResourceURL.mockResolvedValueOnce('testFavicon');

        await expect(provider.favicon).resolves.toBe('testFavicon');
    });
});
