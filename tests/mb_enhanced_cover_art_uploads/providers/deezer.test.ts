import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { DeezerProvider } from '@src/mb_enhanced_cover_art_uploads/providers/deezer';
import { itBehavesLike } from '@test-utils/shared_behaviour';
import { urlMatchingSpec } from './url_matching_spec';

describe('deezer provider', () => {
    const pollyContext = setupPolly();
    const provider = new DeezerProvider();

    const supportedUrls = [{
        desc: 'clean album URLs',
        url: 'https://www.deezer.com/album/260364202',
        id: '260364202',
    }, {
        desc: 'dirty album URLs',
        url: 'https://www.deezer.com/en/album/215928292?deferredFl=1',
        id: '215928292',
    }, {
        desc: 'album URLs with language',
        url: 'https://www.deezer.com/en/album/215928292',
        id: '215928292',
    }];

    const unsupportedUrls = [{
        desc: 'artist URLs',
        url: 'https://www.deezer.com/en/artist/4023815',
    }, {
        desc: 'track URLs',
        url: 'https://www.deezer.com/en/track/1500277672',
    }];

    // eslint-disable-next-line jest/require-hook
    itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });

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
            .rejects.toThrowWithMessage(Error, 'HTTP error 404: Not Found');
    });

    it('filters out placeholder images', async () => {
        // For https://www.deezer.com/de/album/673547
        const fetchResults = [[{}, {
            digest: '2a16c47b2769e6f8414c3f8e39333b46f9b61a766e1dfccc2b814767d3b662cb',
        }]];
        // @ts-expect-error: Lazy
        const afterFetch = await provider.postprocessImages(fetchResults);

        expect(afterFetch).toBeEmpty();
    });

    it('does not filter out legit images', async () => {
        // For https://www.deezer.com/de/album/673547
        const fetchResults = [[{}, {
            digest: '98c6c1d20d9ec8e4b9950f08f58a1da0bc9c3dd9ec6998688b0b1f966799868b',
        }]];
        // @ts-expect-error: Lazy
        const afterFetch = await provider.postprocessImages(fetchResults);

        expect(afterFetch).not.toBeEmpty();
    });
});
