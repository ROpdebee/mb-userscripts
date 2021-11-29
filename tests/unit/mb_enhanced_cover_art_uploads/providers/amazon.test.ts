import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { AmazonProvider } from '@src/mb_enhanced_cover_art_uploads/providers/amazon';

import { itBehavesLike } from '@test-utils/shared_behaviour';
import { mockGMgetResourceURL } from '@test-utils/gm_mocks';

import type { ExtractionCase } from './find_images_spec';
import { findImagesSpec } from './find_images_spec';
import { urlMatchingSpec } from './url_matching_spec';

describe('amazon provider', () => {
    const provider = new AmazonProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'dirty product URLs',
            url: 'https://www.amazon.com/Pattern-Seeking-Animals/dp/B07RZ2T9F1/ref=tmm_acd_swatch_0?_encoding=UTF8&qid=&sr=',
            id: 'B07RZ2T9F1',
        }, {
            desc: 'dirty product URLs without trailing slash',
            url: 'https://www.amazon.com/Chronicles-Narnia-Collectors-Radio-Theatre/dp/1624053661?qsid=145-0543367-7486236',
            id: '1624053661',
        }, {
            desc: 'dp URLs',
            url: 'https://www.amazon.com/dp/B07RZ2T9F1',
            id: 'B07RZ2T9F1',
        }, {
            desc: 'gp URLs',
            url: 'https://www.amazon.com/gp/product/B07RZ2T9F1',
            id: 'B07RZ2T9F1',
        }];

        const unsupportedUrls = [{
            desc: 'search URLs',
            url: 'https://www.amazon.com/s/ref=dp_byline_sr_music_1?ie=UTF8&field-artist=Pattern-Seeking+Animals&search-alias=music',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const expectedPhysical = {
            numImages: 5,
            expectedImages: [{
                index: 0,
                urlPart: '81bqssuW6LL',
                types: [ArtworkTypeIDs.Front],
            }, {
                index: 1,
                urlPart: '61jZYB6BJYL',
                types: [ArtworkTypeIDs.Back],
            }, {
                index: 2,
                urlPart: '71TLgC33KgL',
            }, {
                index: 3,
                urlPart: '81JCfIAZ71L',
            }, {
                index: 4,
                urlPart: '816dglIIJHL',
            }],
        };
        const expectedDigital = {
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '819w7BrMFgL',
                types: [ArtworkTypeIDs.Front],
            }],
        };

        const extractionCases: ExtractionCase[] = [{
            desc: 'physical products from the embedded JS on dp URLs',
            url: 'https://www.amazon.com/dp/B07QWNQT8X',
            ...expectedPhysical,
        }, {
            desc: 'physical products from the embedded JS on gp URLs',
            url: 'https://www.amazon.com/gp/product/B07QWNQT8X',
            ...expectedPhysical,
        }, {
            desc: 'physical audiobooks from the embedded JS',
            url: 'https://www.amazon.com/dp/0563504196',
            numImages: 2,
            expectedImages: [{
                index: 0,
                urlPart: '91OEsuYoClL',
            }, {
                index: 1,
                urlPart: '91NVbKDHCWL',
            }],
        }, {
            desc: 'digital releases on dp URLs',
            url: 'https://www.amazon.com/dp/B07R92TVWN',
            ...expectedDigital,
        }, {
            desc: 'digital releases on gp URLs',
            url: 'https://www.amazon.com/gp/product/B07R92TVWN',
            ...expectedDigital,
        }, {
            desc: 'Audible audiobooks',
            url: 'https://www.amazon.com/dp/B017WJ5PR4',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '51g7fkELjaL',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'http://amazon.com/gp/product/B01NCKFNXH',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });

        it('returns no covers for product without images', async () => {
            const covers = await provider.findImages(new URL('https://www.amazon.com/dp/B000Q3KSMQ'));

            expect(covers).toBeEmpty();
        });

        const extractionThumbnailFallbackCases = [
            ['dp URLs', 'https://www.amazon.com/dp/B07QWNQT8X'],
            ['gp URLs', 'https://www.amazon.com/gp/product/B07QWNQT8X'],
        ];

        it.each(extractionThumbnailFallbackCases)('falls back to thumbnail grabbing for physical products on %s', async (_1, url) => {
            // Mock the failed attempt of extracting images from embedded JS to
            // trigger the thumbnail fallback
            jest.spyOn(provider, 'extractFromEmbeddedJS')
                .mockReturnValueOnce(undefined);

            const covers = await provider.findImages(new URL(url));

            expect(covers).toBeArrayOfSize(4);
            expect(covers[0]).toMatchCoverArt({
                urlPart: '51nM1ikLWPL',
                types: [ArtworkTypeIDs.Front],
            });
            expect(covers[1]).toMatchCoverArt({
                urlPart: '41RQivjYeeL',
                types: [ArtworkTypeIDs.Back],
            });
            expect(covers[2]).toMatchCoverArt({
                urlPart: '31-n8wloCcL',
            });
            expect(covers[3]).toMatchCoverArt({
                urlPart: /41MN(?:%2B|\+)eLL(?:%2B|\+)JL/,
            });
        });

        const physicalJsonFailCases = [
            ['cannot be extracted', ''],
            ['cannot be parsed', "'colorImages': { 'initial': invalid },"],
            ['is invalid type', "'colorImages': { 'initial': 123 },"],
        ];

        it.each(physicalJsonFailCases)('will fall back to thumbnail grabbing if JSON %s', (_1, content) => {
            const covers = provider.extractFromEmbeddedJS(content);

            expect(covers).toBeUndefined();
        });

        const audiobookJsonFailCases = [
            ['cannot be extracted', ''],
            ['cannot be parsed', "'imageGalleryData' : invalid,"],
            ['is invalid type', "'imageGalleryData' : 123,"],
        ];

        it.each(audiobookJsonFailCases)('fails to grab audiobook images if JSON %s', (_1, content) => {
            const covers = provider.extractFromEmbeddedJSGallery(content);

            expect(covers).toBeUndefined();
        });
    });

    it('provides a favicon', async () => {
        mockGMgetResourceURL.mockResolvedValueOnce('testFavicon');

        await expect(provider.favicon).resolves.toBe('testFavicon');
    });
});
