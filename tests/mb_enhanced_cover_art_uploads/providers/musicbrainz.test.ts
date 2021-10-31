import { mockFetch, setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { itBehavesLike } from '@test-utils/shared_behaviour';
import { urlMatchingSpec } from './url_matching_spec';
import { MusicBrainzProvider } from '@src/mb_enhanced_cover_art_uploads/providers/musicbrainz';
import HttpAdapter from '@pollyjs/adapter-node-http';

// eslint-disable-next-line jest/require-hook
setupPolly({
    adapters: [HttpAdapter],
    recordFailedRequests: true,
});

beforeAll(() => {
    mockFetch('https://musicbrainz.org');
});

describe('musicbrainz provider', () => {
    const provider = new MusicBrainzProvider();

    const supportedUrls = [{
        desc: 'release URLs',
        url: 'https://musicbrainz.org/release/3a179b58-6be9-476a-b36e-63461c93992f',
        id: '3a179b58-6be9-476a-b36e-63461c93992f',
    }, {
        desc: 'release URLs on beta',
        url: 'https://beta.musicbrainz.org/release/3a179b58-6be9-476a-b36e-63461c93992f',
        id: '3a179b58-6be9-476a-b36e-63461c93992f',
    }];

    const unsupportedUrls = [{
        desc: 'artist URLs',
        url: 'https://musicbrainz.org/artist/75336c3d-2833-46cb-8037-b835cd7d646d',
    }, {
        desc: 'release group URLs',
        url: 'https://beta.musicbrainz.org/release-group/84ed9e3e-10d2-4719-856c-69efe4d965bb',
    }];

    // eslint-disable-next-line jest/require-hook
    itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });

    it('grabs covers for release', async () => {
        const covers = await provider.findImages(new URL('https://musicbrainz.org/release/8dd38d9f-eae6-47a7-baa8-eaa467042687'));

        expect(covers).toBeArrayOfSize(9);
        expect(covers[0].url.pathname).toContain('mbid-8dd38d9f-eae6-47a7-baa8-eaa467042687-11059679162');
        expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(covers[0].comment).toBe('');
        expect(covers[8].url.pathname).toContain('mbid-8dd38d9f-eae6-47a7-baa8-eaa467042687-11059689534');
        expect(covers[8].types).toStrictEqual([ArtworkTypeIDs.Obi]);
        expect(covers[8].comment).toBe('');
    });

    it('throws on 404 releases', async () => {
        await expect(provider.findImages(new URL('https://musicbrainz.org/release/8dd38d9f-eae6-47a7-baa8-eaa46687')))
            .rejects.toThrowWithMessage(Error, /HTTP error 404/);
    });
});
