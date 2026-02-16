import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { SevenDigitalProvider } from '@src/mb_enhanced_cover_art_uploads/providers/7digital';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { createCoverArt, createFetchedImageFromCoverArt } from '../test-utils/dummy-data';
import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('7digital provider', () => {
    const provider = new SevenDigitalProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'release URLs',
            url: 'https://ca.7digital.com/artist/green-day/release/oh-yeah-10901051',
            id: '10901051',
        }, {
            description: 'release URLs with special characters',
            url: 'https://de.7digital.com/artist/tu-ves-ovnis/release/curva-al-final-del-t%C3%BAnel-14385941',
            id: '14385941',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://de.7digital.com/artist/tu-ves-ovnis',
        }, {
            description: 'feature URLs',
            url: 'https://de.7digital.com/features/VGoltyoAAKgA0eUV/highlights-der-woche',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'release',
            url: 'https://de.7digital.com/artist/mnek/release/language-explicit-8354116',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: '0008354116',
                types: [ArtworkTypeIDs.Front],
                comment: undefined,
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://de.7digital.com/artist/mnek/release/language-elicit-83546',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });

    describe('post-processing', () => {
        it('does not filter out legit images', async () => {
            const cover = createCoverArt('https://artwork-cdn.7static.com/static/img/sleeveart/00/083/541/0008354116_800.jpg');
            const fetchedImage = createFetchedImageFromCoverArt(cover);

            const afterFetch = await provider.postprocessImage(fetchedImage);

            expect(afterFetch).toStrictEqual(fetchedImage);
        });

        it('filters out placeholder images', async () => {
            const cover = createCoverArt('https://artwork-cdn.7static.com/static/img/sleeveart/00/083/541/0008354116_800.jpg');
            const fetchedImage = createFetchedImageFromCoverArt(cover, {
                finalUrl: new URL('https://artwork-cdn.7static.com/static/img/sleeveart/00/000/000/0000000016_800.jpg'),
            });

            const afterFetch = await provider.postprocessImage(fetchedImage);

            expect(afterFetch).toBeNull();
        });
    });
});
