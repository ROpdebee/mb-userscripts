import { setupPolly } from '@test-utils/pollyjs';

import { AppleMusicProvider } from '@src/mb_enhanced_cover_art_uploads/providers/apple_music';
import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';

describe('apple music provider', () => {
    setupPolly();
    const provider = new AppleMusicProvider();

    it.each`
        url | desc
        ${'https://itunes.apple.com/gb/album/id993998924'} | ${'without album name'}
        ${'https://itunes.apple.com/us/album/dark-waves-ep/id919575861'} | ${'with album name'}
        ${'https://itunes.apple.com/us/album/flavourite-c%C3%A2l%C3%A2/id1451216499'} | ${'with album name with special characters'}
    `('matches iTunes album links $desc', ({ url }: { url: string }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeTrue();
    });

    it.each`
        url | desc
        ${'https://music.apple.com/gb/album/993998924'} | ${'without album name'}
        ${'https://music.apple.com/us/album/dark-waves-ep/919575861'} | ${'with album name'}
        ${'https://music.apple.com/us/album/flavourite-c%C3%A2l%C3%A2/1451216499'} | ${'with album name with special characters'}
    `('matches Apple Music album links $desc', ({ url }: { url: string }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeTrue();
    });

    it.each`
        url | type | desc
        ${'https://itunes.apple.com/us/artist/s%C3%B4nge/id1193354626'} | ${'artist'} | ${'with name'}
        ${'https://itunes.apple.com/us/artist/id1193354626'} | ${'artist'} | ${'without name'}
    `('does not match iTunes $type links $desc', ({ url }: { url: string }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeFalse();
    });

    it.each`
        url | type | desc
        ${'https://music.apple.com/us/artist/s%C3%B4nge/1193354626'} | ${'artist'} | ${'with name'}
        ${'https://music.apple.com/us/artist/1193354626'} | ${'artist'} | ${'without name'}
        ${'https://music.apple.com/us/curator/the-matt-wilkinson-show/1184566442'} | ${'curator'} | ${''}
        ${'https://music.apple.com/us/grouping/34'} | ${'grouping'} | ${''}
        ${'https://music.apple.com/us/music-video/sejodioto/1586865687'} | ${'music video'} | ${''}
    `('does not match Apple Music $type links $desc', ({ url }: { url: string }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeFalse();
    });

    it('grabs the correct cover for Apple Music links', async () => {
        const coverUrl = await provider.findImages(new URL('https://music.apple.com/us/album/la-167/1586869902'));

        expect(coverUrl).toBeArrayOfSize(1);
        expect(coverUrl[0].url.pathname).toContain('02596b89-0475-9b14-3b51-934d24770ec3/886449572236.jpg');
        expect(coverUrl[0].type).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(coverUrl[0].comment).toBeUndefined();
    });

    it('grabs the image, not the video', async () => {
        const coverUrl = await provider.findImages(new URL('https://music.apple.com/us/album/expensive-pain/1585883836'));

        expect(coverUrl).toBeArrayOfSize(1);
        expect(coverUrl[0].url.pathname).toContain('3a4deeb4-9555-4bef-3836-185a913b0b20/075679769602.jpg');
        expect(coverUrl[0].url.pathname).toEndWith('.jpg');
    });

    it('grabs the correct cover for iTunes links', async () => {
        const coverUrl = await provider.findImages(new URL('https://itunes.apple.com/us/album/flavourite-c%C3%A2l%C3%A2/id1451216499'));

        expect(coverUrl).toBeArrayOfSize(1);
        expect(coverUrl[0].url.pathname).toContain('73bdc8dc-9ab2-ce6e-e581-4bb3d9e559fc/190295474089.jpg');
        expect(coverUrl[0].type).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(coverUrl[0].comment).toBeUndefined();
    });

    it('throws if Apple Music release is not available', async () => {
        // Apple Music doesn't actually return a 404 for releases which are
        // unavailable. It instead returns a 200 and has an alert popup.
        // Regardless, the image property won't exist, so this will still throw.
        await expect(provider.findImages(new URL('https://music.apple.com/gb/album/993998924')))
            .toReject();
    });

    it('throws if iTunes release is not available', async () => {
        await expect(provider.findImages(new URL('https://itunes.apple.com/gb/album/id993998924')))
            .toReject();
    });
});
