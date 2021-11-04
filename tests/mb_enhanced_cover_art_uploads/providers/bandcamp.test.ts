import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { BandcampProvider } from '@src/mb_enhanced_cover_art_uploads/providers/bandcamp';
import { getImageDimensions } from '@src/mb_enhanced_cover_art_uploads/image_dimensions';
import { itBehavesLike } from '@test-utils/shared_behaviour';
import { urlMatchingSpec } from './url_matching_spec';

// We need to mock getImageDimensions since jsdom doesn't actually load images.
// See also tests/mb_enhanced_cover_art_uploads/image_dimensions.test.ts
jest.mock('@src/mb_enhanced_cover_art_uploads/image_dimensions');

const mockGetImageDimensions = getImageDimensions as jest.MockedFunction<typeof getImageDimensions>;

describe('bandcamp provider', () => {
    const pollyContext = setupPolly();
    const provider = new BandcampProvider();

    beforeAll(() => {
        mockGetImageDimensions.mockResolvedValue({
            height: 1000,
            width: 1000,
        });
    });

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

    it('considers redirect to different album to be unsafe', () => {
        // See https://github.com/ROpdebee/mb-userscripts/issues/79
        expect(provider.isSafeRedirect(new URL('https://tempelfanwolven.bandcamp.com/album/spell-of-the-driftless-forest'), new URL('https://tempelfanwolven.bandcamp.com/album/the-coming-war')))
            .toBeFalse();
    });

    it('grabs the correct cover', async () => {
        const coverUrl = await provider.findImages(new URL('https://powergameheavy.bandcamp.com/album/the-lockdown-tapes'));

        expect(coverUrl).toBeArrayOfSize(1);
        expect(coverUrl[0].url.pathname).toContain('a3886966548_');
        expect(coverUrl[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(coverUrl[0].comment).toBeUndefined();
    });

    it('grabs track covers', async () => {
        const coverUrls = await provider.findImages(new URL('https://nyokee.bandcamp.com/album/quarantine-pixel-party'));

        expect(coverUrls).toBeArrayOfSize(8); // Last track image is same as front cover
        expect(coverUrls[0].url.pathname).toContain('a1225644503_');
        expect(coverUrls[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(coverUrls[0].comment).toBeUndefined();

        // Sampling one, not going to check all 8 track images.
        // BTW, this is not an off-by-one indexing mistake, Track 3 has no
        // custom cover :)
        expect(coverUrls[4].url.pathname).toContain('a3441863429_');
        expect(coverUrls[4].types).toStrictEqual([ArtworkTypeIDs.Track]);
        expect(coverUrls[4].comment).toBe('Track 5');
    });

    it('grabs no track covers if they will not be used', async () => {
        const coverUrls = await provider.findImages(new URL('https://nyokee.bandcamp.com/album/quarantine-pixel-party'), true);

        expect(coverUrls).toBeArrayOfSize(1);
        expect(coverUrls[0].url.pathname).toContain('a1225644503_');
        expect(coverUrls[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(coverUrls[0].comment).toBeUndefined();
    });

    it('grabs square thumbnails for non-square covers', async () => {
        mockGetImageDimensions.mockResolvedValueOnce({
            // Actual dimensions of that image.
            height: 1714,
            width: 4096,
        });
        const coverUrls = await provider.findImages(new URL('https://level2three.bandcamp.com/track/the-bridge'));

        expect(coverUrls).toBeArrayOfSize(2);
        expect(coverUrls[0].url.pathname).toEndWith('a4081865950_10.jpg');
        expect(coverUrls[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(coverUrls[0].comment).toBe('Bandcamp full-sized cover');
        expect(coverUrls[1].url.pathname).toEndWith('a4081865950_16.jpg');
        expect(coverUrls[1].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(coverUrls[1].comment).toBe('Bandcamp square crop');
    });

    it('throws if release does not exist', async () => {
        pollyContext.polly.configure({
            recordFailedRequests: true
        });

        await expect(provider.findImages(new URL('https://powergameheavy.bandcamp.com/album/404')))
            .rejects.toThrowWithMessage(Error, 'HTTP error 404: Not Found');
    });

    it('throws if the release redirects', async () => {
        await expect(provider.findImages(new URL('https://tempelfanwolven.bandcamp.com/album/spell-of-the-driftless-forest')))
            .rejects.toThrowWithMessage(Error, /different release/);
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
