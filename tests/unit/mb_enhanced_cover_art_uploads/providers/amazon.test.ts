import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { AmazonProvider } from '@src/mb_enhanced_cover_art_uploads/providers/amazon';
import { mockGMgetResourceURL } from '@test-utils/gm_mocks';
import { itBehavesLike } from '@test-utils/shared_behaviour';

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
        // This was the expected result for the Amazon Music release, we may need
        // this again in the future.
        /* const expectedDigital = {
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '819w7BrMFgL',
                types: [ArtworkTypeIDs.Front],
            }],
        };*/

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
            desc: 'physical audiobooks where Audible version is also available',
            url: 'https://www.amazon.com/gp/product/207055998X',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '812VSsX9rpL',
            }],
        }, {
            desc: 'Audible audiobooks',
            url: 'https://www.amazon.com/dp/B017WJ5PR4',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '91WJ0q27ddL',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            desc: 'Audible audiobooks with dirty URL',
            url: 'https://www.amazon.com/Harry-Potter-%C3%A0-l%C3%89cole-Sorciers/dp/B06Y65ZVWV',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '91zPf7ACV9L',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'http://amazon.com/gp/product/B01NCKFNXH',
        }, {
            desc: 'digital releases on dp URLs',
            url: 'https://www.amazon.com/dp/B07R92TVWN',
            errorMessage: /Amazon Music releases are currently not supported/,
        }, {
            desc: 'digital releases on gp URLs',
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

        it.each(physicalJsonFailCases)('fails to grab generic images if JSON %s', async (_1, content) => {
            const covers = provider['findGenericPhysicalImages'](new URL('https://www.amazon.com/dp/fake'), content);

            await expect(covers).rejects.toThrowWithMessage(Error, 'Failed to extract images from embedded JS on generic physical page');
        });

        const audiobookJsonFailCases = [
            ['cannot be extracted', ''],
            ['cannot be parsed', "'imageGalleryData' : invalid,"],
            ['is invalid type', "'imageGalleryData' : 123,"],
        ];

        it.each(audiobookJsonFailCases)('fails to grab audiobook images if JSON %s', async (_1, content) => {
            const covers = provider['findPhysicalAudiobookImages'](new URL('https://www.amazon.com/dp/fake'), content);

            await expect(covers).rejects.toThrowWithMessage(Error, 'Failed to extract images from embedded JS on physical audiobook page');
        });
    });

    it('provides a favicon', async () => {
        mockGMgetResourceURL.mockResolvedValueOnce('testFavicon');

        await expect(provider.favicon).resolves.toBe('testFavicon');
    });
});
