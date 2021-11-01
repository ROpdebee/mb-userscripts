import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { BandcampProvider } from '@src/mb_enhanced_cover_art_uploads/providers/bandcamp';
import { getImageDimensions } from '@src/mb_enhanced_cover_art_uploads/image_dimensions';

import { itBehavesLike } from '@test-utils/shared_behaviour';

import { urlMatchingSpec } from './url_matching_spec';
import { findImagesSpec } from './find_images_spec';

// We need to mock getImageDimensions since jsdom doesn't actually load images.
// See also tests/mb_enhanced_cover_art_uploads/image_dimensions.test.ts
jest.mock('@src/mb_enhanced_cover_art_uploads/image_dimensions');
const mockGetImageDimensions = getImageDimensions as jest.MockedFunction<typeof getImageDimensions>;

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
            desc: 'track URLs',
            url: 'https://happysadportable.bandcamp.com/track/again-and-again',
            id: 'happysadportable/track/again-and-again',
        }, {
            desc: 'album URLs',
            url: 'https://powergameheavy.bandcamp.com/album/the-lockdown-tapes',
            id: 'powergameheavy/album/the-lockdown-tapes',
        }];

        const unsupportedUrls = [{
            desc: 'root URLs',
            url: 'https://powergameheavy.bandcamp.com/',
        }, {
            desc: 'discography URLs',
            url: 'https://powergameheavy.bandcamp.com/music',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release',
            url: 'https://powergameheavy.bandcamp.com/album/the-lockdown-tapes',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'a3886966548_',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            desc: 'release with track images',
            url: 'https://nyokee.bandcamp.com/album/quarantine-pixel-party',
            numImages: 8,  // Last track image is same as front cover
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
            desc: 'non-existent release',
            url: 'https://powergameheavy.bandcamp.com/album/404',
        }, {
            desc: 'release that redirects',
            url: 'https://tempelfanwolven.bandcamp.com/album/spell-of-the-driftless-forest',
            errorMessage: /different release/,
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });

        it('grabs square thumbnails for non-square covers', async () => {
            mockGetImageDimensions.mockResolvedValueOnce({
                // Actual dimensions of that image.
                height: 1714,
                width: 4096,
            });
            const coverUrls = await provider.findImages(new URL('https://level2three.bandcamp.com/track/the-bridge'));

            expect(coverUrls).toBeArrayOfSize(2);
            expect(coverUrls[0]).toMatchCoverArt({
                urlPart: 'a4081865950_10.jpg',
                types: [ArtworkTypeIDs.Front],
                comment: 'Bandcamp full-sized cover',
            });
            expect(coverUrls[1]).toMatchCoverArt({
                urlPart: 'a4081865950_16.jpg',
                types: [ArtworkTypeIDs.Front],
                comment: 'Bandcamp square crop',
            });
        });

        it('considers redirect to different album to be unsafe', () => {
            // See https://github.com/ROpdebee/mb-userscripts/issues/79
            const originalUrl = new URL('https://tempelfanwolven.bandcamp.com/album/spell-of-the-driftless-forest');
            const redirectedUrl = new URL('https://tempelfanwolven.bandcamp.com/album/the-coming-war');

            expect(provider.isSafeRedirect(originalUrl, redirectedUrl))
                .toBeFalse();
        });

        it('grabs no track covers if they will not be used', async () => {
            const coverUrls = await provider.findImages(new URL('https://nyokee.bandcamp.com/album/quarantine-pixel-party'), true);

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
    });
});
