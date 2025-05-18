import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { getImageDimensions } from '@src/mb_caa_dimensions/dimensions';
import { CONFIG } from '@src/mb_enhanced_cover_art_uploads/config';
import { BandcampProvider } from '@src/mb_enhanced_cover_art_uploads/providers/bandcamp';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

// We need to mock getImageDimensions since jsdom doesn't actually load images.
// See also tests/mb_caa_dimensions/dimensions.test.ts
jest.mock('@src/mb_caa_dimensions/dimensions');
jest.mock('@lib/logging/logger');
const mockGetImageDimensions = jest.mocked(getImageDimensions);
const mockLoggerWarn = jest.mocked(LOGGER.warn);

afterEach(() => {
    mockLoggerWarn.mockReset();
});

describe('bandcamp provider', () => {
    const provider = new BandcampProvider();

    beforeAll(() => {
        mockGetImageDimensions.mockResolvedValue({
            height: 1000,
            width: 1000,
        });
    });

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'track URLs',
            url: 'https://happysadportable.bandcamp.com/track/again-and-again',
            id: 'happysadportable/track/again-and-again',
        }, {
            description: 'album URLs',
            url: 'https://powergameheavy.bandcamp.com/album/the-lockdown-tapes',
            id: 'powergameheavy/album/the-lockdown-tapes',
        }];

        const unsupportedUrls = [{
            description: 'root URLs',
            url: 'https://powergameheavy.bandcamp.com/',
        }, {
            description: 'discography URLs',
            url: 'https://powergameheavy.bandcamp.com/music',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'release',
            url: 'https://powergameheavy.bandcamp.com/album/the-lockdown-tapes',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'a3886966548_',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            description: 'release with track images',
            url: 'https://nyokee.bandcamp.com/album/quarantine-pixel-party',
            imageCount: 8, // Last track image is same as front cover
            expectedImages: [{
                index: 0,
                urlPart: 'a1225644503_',
                types: [ArtworkTypeIDs.Front],
            }, {
                // Sampling one, not going to check all 8 track images.
                // BTW, this is not an off-by-one indexing mistake, Track 3 has no
                // custom cover :)
                index: 4,
                urlPart: 'a3441863429_',
                types: [ArtworkTypeIDs.Track],
                comment: 'Track 5',
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://powergameheavy.bandcamp.com/album/404',
        }, {
            description: 'release that redirects',
            url: 'https://tempelfanwolven.bandcamp.com/album/spell-of-the-driftless-forest',
            errorMessage: /different release/,
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });

        it.each([false, true])('grabs square thumbnails for non-square covers', async (orderSquareFirst) => {
            mockGetImageDimensions.mockResolvedValueOnce({
                // Actual dimensions of that image.
                height: 1714,
                width: 4096,
            });
            jest.spyOn(CONFIG.bandcamp.squareCropFirst, 'get').mockResolvedValueOnce(orderSquareFirst);
            const squareIndex = orderSquareFirst ? 0 : 1;
            const originalIndex = orderSquareFirst ? 1 : 0;

            const coverUrls = await provider.findImages(new URL('https://level2three.bandcamp.com/track/the-bridge'));

            expect(coverUrls).toBeArrayOfSize(2);
            expect(coverUrls[originalIndex]).toMatchCoverArt({
                urlPart: 'a4081865950_10.jpg',
                types: [ArtworkTypeIDs.Front],
                comment: 'Bandcamp full-sized cover',
            });
            expect(coverUrls[squareIndex]).toMatchCoverArt({
                urlPart: 'a4081865950_16.jpg',
                types: [ArtworkTypeIDs.Front],
                comment: 'Bandcamp square crop',
            });
        });

        it('skips grabbing square thumbnails if dimensions cannot be loaded', async () => {
            mockGetImageDimensions.mockRejectedValueOnce(new Error('test'));
            const coverUrls = await provider.findImages(new URL('https://level2three.bandcamp.com/track/the-bridge'));

            expect(coverUrls).toBeArrayOfSize(1);
        });

        it('considers redirect to different album to be unsafe', () => {
            // See https://github.com/ROpdebee/mb-userscripts/issues/79
            const originalUrl = new URL('https://tempelfanwolven.bandcamp.com/album/spell-of-the-driftless-forest');
            const redirectedUrl = new URL('https://tempelfanwolven.bandcamp.com/album/the-coming-war');

            expect(provider['isSafeRedirect'](originalUrl, redirectedUrl))
                .toBeFalse();
        });

        it('grabs no track covers if they will not be used', async () => {
            const spy = jest.spyOn(CONFIG.bandcamp, 'skipTrackImages', 'get');
            spy.mockResolvedValueOnce(true);

            const coverUrls = await provider.findImages(new URL('https://nyokee.bandcamp.com/album/quarantine-pixel-party'));

            expect(coverUrls).toBeArrayOfSize(1);
            expect(coverUrls[0]).toMatchCoverArt({
                urlPart: 'a1225644503_',
                types: [ArtworkTypeIDs.Front],
            });
        });

        it('returns no images if release has no cover', async () => {
            await expect(provider.findImages(new URL('https://indigochill.bandcamp.com/track/eon-indigo-remix')))
                .resolves.toBeEmpty();
        });

        it('deduplicates track images by thumbnail content', async () => {
            await expect(provider.findImages(new URL('https://inhuman1.bandcamp.com/album/course-of-human-destruction')))
                .resolves.toBeArrayOfSize(1);
        });

        it('warns about non-standalone track releases', async () => {
            const results = await provider.findImages(new URL('https://nyokee.bandcamp.com/track/nyokee-sweet-obsession'));

            expect(results).toBeArrayOfSize(1);
            expect(mockLoggerWarn).toHaveBeenCalledWith(expect.stringContaining('part of an album'));
        });
    });
});
