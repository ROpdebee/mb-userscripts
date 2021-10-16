import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { TidalProvider } from '@src/mb_enhanced_cover_art_uploads/providers/tidal';
import { HTTPResponseError } from '@lib/util/xhr';

describe('tidal provider', () => {
    const pollyContext = setupPolly();
    const provider = new TidalProvider();

    it.each`
        url | domain | desc
        ${'https://listen.tidal.com/album/151193605'} | ${'listen.tidal.com'} | ${''}
        ${'https://store.tidal.com/us/album/175441105'} | ${'store.tidal.com'} | ${'with country'}
        ${'https://store.tidal.com/album/175441105'} | ${'store.tidal.com'} | ${'without country'}
        ${'https://tidal.com/browse/album/175441105'} | ${'tidal.com'} | ${'with browse'}
        ${'https://tidal.com/album/175441105'} | ${'tidal.com'} | ${'without browse'}
    `('matches $domain links $desc', ({ url }: { url: string }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeTrue();
    });

    it.each`
        url | domain | type
        ${'https://tidal.com/browse/track/175441106'} | ${'tidal.com'} | ${'track'}
        ${'https://tidal.com/browse/artist/23736224'} | ${'tidal.com'} | ${'music'}
        ${'https://listen.tidal.com/artist/10789784'} | ${'listen.tidal.com'} | ${'artist'}
        ${'https://listen.tidal.com/artist/10789784'} | ${'listen.tidal.com'} | ${'artist'}
        ${'https://store.tidal.com/nl/artist/23736224'} | ${'store.tidal.com'} | ${'artist'}
    `('does not match $domain $type links', ({ url }: { url: string }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeFalse();
    });

    it.each`
        url | domain
        ${'https://listen.tidal.com/album/175441105'} | ${'listen.tidal.com'}
        ${'https://store.tidal.com/album/175441105'} | ${'store.tidal.com'}
        ${'https://tidal.com/album/175441105'} | ${'tidal.com'}
    `('grabs the correct image on $domain', async ({ url }: { url: string }) => {
        const coverUrl = await provider.findImages(new URL(url));

        expect(coverUrl).toBeArrayOfSize(1);
        expect(coverUrl[0].url.pathname).toBe('/images/c61b75cd/0159/4b63/9f25/27b3d6cedd63/origin.jpg');
        expect(coverUrl[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(coverUrl[0].comment).toBeUndefined();
    });

    it('throws if release does not exist', async () => {
        pollyContext.polly.configure({
            recordFailedRequests: true,
        });

        await expect(provider.findImages(new URL('https://listen.tidal.com/album/1')))
            .rejects.toBeInstanceOf(HTTPResponseError);
    });
});
