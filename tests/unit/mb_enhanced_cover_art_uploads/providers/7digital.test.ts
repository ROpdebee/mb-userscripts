import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { SevenDigitalProvider } from '@src/mb_enhanced_cover_art_uploads/providers/7digital';

import { itBehavesLike } from '@test-utils/shared_behaviour';

import { createCoverArt, createFetchedImageFromCoverArt } from '../test-utils/dummy-data';
import { urlMatchingSpec } from './url_matching_spec';
import { findImagesSpec } from './find_images_spec';

describe('7digital provider', () => {
    const provider = new SevenDigitalProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'release URLs',
            url: 'https://ca.7digital.com/artist/green-day/release/oh-yeah-10901051',
            id: '10901051',
        }, {
            desc: 'release URLs with special characters',
            url: 'https://de.7digital.com/artist/tu-ves-ovnis/release/curva-al-final-del-t%C3%BAnel-14385941',
            id: '14385941',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://de.7digital.com/artist/tu-ves-ovnis',
        }, {
            desc: 'feature URLs',
            url: 'https://de.7digital.com/features/VGoltyoAAKgA0eUV/highlights-der-woche',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release',
            url: 'https://de.7digital.com/artist/mnek/release/language-explicit-8354116',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '0008354116',
                types: [ArtworkTypeIDs.Front],
                comment: undefined,
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://de.7digital.com/artist/mnek/release/language-elicit-83546',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });

    describe('post-processing', () => {
        it('does not filter out legit images', async () => {
            const cover = createCoverArt('https://artwork-cdn.7static.com/static/img/sleeveart/00/083/541/0008354116_800.jpg');
            const fetchedImage = createFetchedImageFromCoverArt(cover);

            const afterFetch = provider.postprocessImages([fetchedImage]);

            expect(afterFetch).toBeArrayOfSize(1);
            expect(afterFetch[0]).toStrictEqual(fetchedImage);
        });

        it('filters out placeholder images', async () => {
            const cover = createCoverArt('https://artwork-cdn.7static.com/static/img/sleeveart/00/083/541/0008354116_800.jpg');
            const fetchedImage = createFetchedImageFromCoverArt(cover, {
                fetchedUrl: new URL('https://artwork-cdn.7static.com/static/img/sleeveart/00/000/000/0000000016_800.jpg'),
            });

            const afterFetch = provider.postprocessImages([fetchedImage]);

            expect(afterFetch).toBeEmpty();
        });
    });
});
