import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { DeezerProvider } from '@src/mb_enhanced_cover_art_uploads/providers/deezer';

describe('deezer provider', () => {
    const pollyContext = setupPolly();
    const provider = new DeezerProvider();

    it.each`
        url | desc
        ${'https://www.deezer.com/album/260364202'} | ${'with clean URL'}
        ${'https://www.deezer.com/en/album/215928292?deferredFl=1'} | ${'with dirty URL'}
        ${'https://www.deezer.com/en/album/215928292'} | ${'with language'}
    `('matches album links $desc', ({ url }: { url: string }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeTrue();
    });

    it.each`
        url | type
        ${'https://www.deezer.com/en/artist/4023815'} | ${'artist'}
        ${'https://www.deezer.com/en/track/1500277672'} | ${'track'}
    `('does not match $type links', ({ url }: { url: string }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeFalse();
    });

    it('grabs the correct cover', async () => {
        const coverUrl = await provider.findImages(new URL('https://www.deezer.com/en/album/260364202'));

        expect(coverUrl).toBeArrayOfSize(1);
        expect(coverUrl[0].url.pathname).toContain('4097bb08bad497561ef60ec53162351e');
        expect(coverUrl[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(coverUrl[0].comment).toBeUndefined();
    });

    it('throws if release does not exist', async () => {
        pollyContext.polly.configure({
            recordFailedRequests: true
        });

        await expect(provider.findImages(new URL('https://www.deezer.com/en/album/1')))
            .toReject();
    });
});
