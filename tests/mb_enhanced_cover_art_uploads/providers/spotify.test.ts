import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { SpotifyProvider } from '@src/mb_enhanced_cover_art_uploads/providers/spotify';

describe('spotify provider', () => {
    const pollyContext = setupPolly();
    const provider = new SpotifyProvider();

    it.each`
        url | desc
        ${'https://open.spotify.com/album/3hVr04Z3d9HgUCYOjXQHQL'} | ${'with clean URL'}
        ${'https://open.spotify.com/album/5Lj94YpHLkmjM7JZ8wuURl?si=oXJ7iNcXTqSkcIk8jYBqFQ&dl_branch=1'} | ${'with dirty URL'}
    `('matches Spotify album links $desc', ({ url }: { url: string }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeTrue();
    });

    it.each`
        url | type
        ${'https://open.spotify.com/track/49tMnLt1iXNT6QBOsepFyg?si=61de9abff5f94f51'} | ${'track'}
        ${'https://open.spotify.com/artist/5Igpc9iLZ3YGtKeYfSrrOE?si=a31abf58e12948fd'} | ${'artist'}
        ${'https://open.spotify.com/playlist/2yNg6AGxM4liENyBAE8Wyr'} | ${'playlist'}
    `('does not match Spotify $type links', ({ url }: { url: string }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeFalse();
    });

    it('grabs the correct cover', async () => {
        const coverUrl = await provider.findImages(new URL('https://open.spotify.com/album/5Lj94YpHLkmjM7JZ8wuURl'));

        expect(coverUrl).toBeArrayOfSize(1);
        expect(coverUrl[0].url.pathname).toEndWith('image/ab67616d0000b273bebe715d1d624070951a795a');
        expect(coverUrl[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(coverUrl[0].comment).toBeUndefined();
    });

    it('throws if Spotify release does not exist', async () => {
        // Similarly to Apple Music, Spotify doesn't always return a 404.
        // Depends on the headers in this case maybe?
        pollyContext.polly.configure({
            recordFailedRequests: true
        });

        await expect(provider.findImages(new URL('https://open.spotify.com/album/IDoNotExist')))
            .toReject();
    });
});
