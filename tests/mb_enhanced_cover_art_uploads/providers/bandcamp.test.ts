import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { BandcampProvider } from '@src/mb_enhanced_cover_art_uploads/providers/bandcamp';
import { getImageDimensions } from '@src/mb_enhanced_cover_art_uploads/image_dimensions';

// We need to mock getImageDimensions since jsdom doesn't actually load images.
// See also tests/mb_enhanced_cover_art_uploads/image_dimensions.test.ts
jest.mock('@src/mb_enhanced_cover_art_uploads/image_dimensions');

const mockGetImageDimensions = getImageDimensions as jest.MockedFunction<typeof getImageDimensions>;

describe('bandcamp provider', () => {
    const pollyContext = setupPolly();
    const provider = new BandcampProvider();

    const urlCases = [
        ['track', 'https://happysadportable.bandcamp.com/track/again-and-again', 'happysadportable/track/again-and-again'],
        ['album', 'https://powergameheavy.bandcamp.com/album/the-lockdown-tapes', 'powergameheavy/album/the-lockdown-tapes'],
    ];

    beforeAll(() => {
        mockGetImageDimensions.mockResolvedValue({
            height: 1000,
            width: 1000,
        });
    });

    it.each(urlCases)('matches Bandcamp %s links', (_1, url) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeTrue();
    });

    it.each`
        url | type
        ${'https://powergameheavy.bandcamp.com/'} | ${'root'}
        ${'https://powergameheavy.bandcamp.com/music'} | ${'music'}
    `('does not match Bandcamp $type links', ({ url }: { url: string }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeFalse();
    });

    it.each(urlCases)('extracts Bandcamp %s link IDs', (_1, url, expectedId) => {
        expect(provider.extractId(new URL(url)))
            .toBe(expectedId);
    });

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

        expect(coverUrls).toBeArrayOfSize(9);
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
            .toReject();
    });

    it('throws if the release redirects', async () => {
        await expect(provider.findImages(new URL('https://tempelfanwolven.bandcamp.com/album/spell-of-the-driftless-forest')))
            .rejects.toMatchObject({
                message: expect.stringContaining('different release'),
            });
    });
});
