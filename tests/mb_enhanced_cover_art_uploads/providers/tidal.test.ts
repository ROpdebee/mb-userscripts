import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { TidalProvider } from '@src/mb_enhanced_cover_art_uploads/providers/tidal';
import { urlMatchingSpec } from './url_matching_spec';
import { itBehavesLike } from '@test-utils/shared_behaviour';

describe('tidal provider', () => {
    const pollyContext = setupPolly();
    const provider = new TidalProvider();

    const supportedUrls = [{
        desc: 'listen.tidal.com album URLs',
        url: 'https://listen.tidal.com/album/151193605',
        id: '151193605',
    }, {
        desc: 'store.tidal.com album URLs with country',
        url: 'https://store.tidal.com/us/album/175441105',
        id: '175441105',
    }, {
        desc: 'store.tidal.com album URLs without country',
        url: 'https://store.tidal.com/album/175441105',
        id: '175441105',
    }, {
        desc: 'tidal.com browse album URLs',
        url: 'https://tidal.com/browse/album/175441105',
        id: '175441105',
    }, {
        desc: 'tidal.com album URLs',
        url: 'https://tidal.com/album/175441105',
        id: '175441105',
    }];

    const unsupportedUrls = [{
        desc: 'tidal.com track URLs',
        url: 'https://tidal.com/browse/track/175441106',
    }, {
        desc: 'tidal.com artist URLs',
        url: 'https://tidal.com/browse/artist/23736224',
    }, {
        desc: 'listen.tidal.com artist URLs',
        url: 'https://listen.tidal.com/artist/10789784',
    }, {
        desc: 'store.tidal.com artist URLs',
        url: 'https://store.tidal.com/nl/artist/23736224',
    }];

    // eslint-disable-next-line jest/require-hook
    itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });

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

    it('extracts static cover if release has video cover', async () => {
        const coverUrl = await provider.findImages(new URL('https://listen.tidal.com/album/171032759'));

        expect(coverUrl).toBeArrayOfSize(1);
        expect(coverUrl[0].url.pathname).toBe('/images/72c1e674/70ca/4442/a530/0f00b0ef354a/origin.jpg');
        expect(coverUrl[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(coverUrl[0].comment).toBeUndefined();
    });

    it('throws if release does not exist', async () => {
        pollyContext.polly.configure({
            recordFailedRequests: true,
        });

        await expect(provider.findImages(new URL('https://listen.tidal.com/album/1')))
            .rejects.toThrowWithMessage(Error, 'HTTP error 404: Not Found');
    });
});
