import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { BandcampProvider } from '@src/mb_enhanced_cover_art_uploads/providers/bandcamp';

describe('bandcamp provider', () => {
    const pollyContext = setupPolly();
    const provider = new BandcampProvider();

    it.each`
        url | type
        ${'https://happysadportable.bandcamp.com/track/again-and-again'} | ${'track'}
        ${'https://powergameheavy.bandcamp.com/album/the-lockdown-tapes'} | ${'album'}
    `('matches Bandcamp $type links', ({ url }: { url: string }) => {
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

    it('grabs the correct cover', async () => {
        const coverUrl = await provider.findImages(new URL('https://powergameheavy.bandcamp.com/album/the-lockdown-tapes'));

        expect(coverUrl).toBeArrayOfSize(1);
        expect(coverUrl[0].url.pathname).toContain('a3886966548_');
        expect(coverUrl[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(coverUrl[0].comment).toBeUndefined();
    });

    it('throws if release does not exist', async () => {
        pollyContext.polly.configure({
            recordFailedRequests: true
        });

        await expect(provider.findImages(new URL('https://powergameheavy.bandcamp.com/album/404')))
            .toReject();
    });
});
