import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { blobToDigest } from '@lib/util/blob';
import { DatPiffProvider } from '@src/mb_enhanced_cover_art_uploads/providers/datpiff';
import { itBehavesLike } from '@test-utils/shared_behaviour';

import { createCoverArt, createFetchedImageFromCoverArt } from '../test-utils/dummy-data';
import { findImagesSpec } from './find_images_spec';
import { urlMatchingSpec } from './url_matching_spec';

jest.mock('@lib/util/blob');

const mockBlobToDigest = blobToDigest as jest.MockedFunction<typeof blobToDigest>;

describe('datpiff provider', () => {
    const provider = new DatPiffProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'mixtape URLs',
            url: 'https://www.datpiff.com/Ni-Pr-Pia-Ni-Ll-2022-mixtape.1017532.html',
            id: '1017532',
        }, {
            desc: 'mixtape URLs with capitals',
            url: 'https://www.datpiff.com/Deno-Blue-Crazy-The-Mixtape.438559.html',
            id: '438559',
        }];

        const unsupportedUrls = [{
            desc: 'browse URLs',
            url: 'https://www.datpiff.com/mixtapes-top',
        }, {
            desc: 'profile URLs',
            url: 'https://www.datpiff.com/profile/Tecg',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'mixtape with front and back cover',
            url: 'https://www.datpiff.com/B-unique-Stay-Sharp-2-mixtape.1018133.html',
            numImages: 2,
            expectedImages: [{
                index: 0,
                urlPart: 'md09671e/B_unique_Stay_Sharp_2-front',
                types: [ArtworkTypeIDs.Front],
            }, {
                index: 1,
                urlPart: 'md09671e/B_unique_Stay_Sharp_2-back',
                types: [ArtworkTypeIDs.Back],
            }],
        }, {
            desc: 'mixtape without back cover',
            url: 'https://www.datpiff.com/Deno-Blue-Crazy-The-Mixtape.438559.html',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'mc561281/CHIPDACHIPCHIPERISH_LIL_FREDDIE_Crazy_The_Mixtap-front',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            // ID is probably long enough to last quite a while before this mixtape is created :)
            url: 'https://www.datpiff.com/Deno-Blue-Crazy-The-Mixtape.1231412412435323.html',
            errorMessage: 'DatPiff release does not exist',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });

    describe('post-processing', () => {
        it('does not filter out legit images', async () => {
            const cover = createCoverArt('https://hw-img.datpiff.com/mc561281/CHIPDACHIPCHIPERISH_LIL_FREDDIE_Crazy_The_Mixtap-front-large.jpg');
            const fetchedImage = createFetchedImageFromCoverArt(cover);
            mockBlobToDigest.mockResolvedValueOnce('abcdefgh');

            const afterFetch = await provider.postprocessImages([fetchedImage]);

            expect(afterFetch).toBeArrayOfSize(1);
            expect(afterFetch[0]).toStrictEqual(fetchedImage);
        });

        it('filters out placeholder images', async () => {
            const cover = createCoverArt('https://hw-img.datpiff.com/m43186c7/Nevsil_Det_Nclnd_Illus_E-front-medium.jpg');
            const fetchedImage = createFetchedImageFromCoverArt(cover);
            mockBlobToDigest.mockResolvedValueOnce('ef406a25c3ffd61150b0658f3fe4863898048b4e54b81289e0e53a0f00ad0ced');

            const afterFetch = await provider.postprocessImages([fetchedImage]);

            expect(afterFetch).toBeEmpty();
        });
    });
});
