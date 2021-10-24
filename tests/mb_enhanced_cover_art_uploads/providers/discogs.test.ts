import { setupPolly } from '@test-utils/pollyjs';

import type { CoverArt } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { DiscogsProvider } from '@src/mb_enhanced_cover_art_uploads/providers/discogs';
import { itBehavesLike } from '@test-utils/shared_behaviour';
import { urlMatchingSpec } from './url_matching_spec';

describe('discogs provider', () => {
    const pollyContext = setupPolly();
    const provider = new DiscogsProvider();
    const discogsUrl = new URL('https://www.discogs.com/release/9892912');

    const supportedUrls = [{
        desc: 'short release URLs',
        url: 'https://www.discogs.com/release/9892912/',
        id: '9892912',
    }, {
        desc: 'long release URLs',
        url: 'https://www.discogs.com/release/9892912-Wayne-King-And-His-Orchestra-A-Million-Dreams-Ago-One-Look-At-You',
        id: '9892912',
    }];

    const unsupportedUrls = [{
        desc: 'artist URLs',
        url: 'https://www.discogs.com/artist/881122-Wayne-King-And-His-Orchestra',
    }, {
        desc: 'release master URLs',
        url: 'https://www.discogs.com/master/1746505',
    }, {
        desc: 'label URLs',
        url: 'https://www.discogs.com/label/61808-Victor'
    }];

    // eslint-disable-next-line jest/require-hook
    itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });

    describe('finding release images', () => {
        it('finds all images in 600x600', async () => {
            const covers = await provider.findImages(discogsUrl);

            expect(covers).toBeArrayOfSize(3);
            expect(covers[0].url.pathname).toBe('/cGX5KW1uJCaiPRzaRY8iE3btV3g=/fit-in/600x624/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-9892912-1579456707-2320.jpeg.jpg');
            expect(covers[1].url.pathname).toBe('/GjkwgdSXa6b6KAXHqtt1lrrSebQ=/fit-in/600x601/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-9892912-1579456707-4048.jpeg.jpg');
            expect(covers[2].url.pathname).toBe('/hch5Dfg5ZsgGY7DCxWtNWEpRSs8=/fit-in/600x681/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-9892912-1488067341-2872.jpeg.jpg');
            expect(covers).toSatisfyAll((cover: CoverArt) => typeof cover.types === 'undefined');
            expect(covers).toSatisfyAll((cover: CoverArt) => typeof cover.comment === 'undefined');
        });

        it('throws on non-existent release', async () => {
            pollyContext.polly.configure({
                recordFailedRequests: true,
            });

            await expect(provider.findImages(new URL('https://www.discogs.com/release/32342343')))
                .rejects.toThrowWithMessage(Error, 'Discogs release does not exist');
        });
    });

    describe('maximising image', () => {
        it('finds the image', async () => {
            const maxUrl = await DiscogsProvider.maximiseImage(new URL('https://img.discogs.com/husmGPLvKp_kDmwLCXA_fc75LcM=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-9892912-1579456707-2320.jpeg.jpg'));

            expect(maxUrl.pathname).toBe('/cGX5KW1uJCaiPRzaRY8iE3btV3g=/fit-in/600x624/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-9892912-1579456707-2320.jpeg.jpg');
        });
    });

    describe('caching API responses', () => {
        const requestSpy = jest.spyOn(DiscogsProvider, 'actuallyGetReleaseImages');

        beforeEach(() => {
            // Make sure to clear the cache before each test, since it's static
            // individual tests may otherwise influence each other.
            DiscogsProvider.apiResponseCache.clear();
            requestSpy.mockClear();
        });

        it('reuses the cache entry for subsequent requests', async () => {
            await provider.findImages(discogsUrl);
            await provider.findImages(discogsUrl);

            expect(requestSpy).toHaveBeenCalledOnce();
        });

        it('reuses the cache entry while maximising images', async () => {
            const images = await provider.findImages(discogsUrl);
            await Promise.all(images.map((image) => DiscogsProvider.maximiseImage(image.url)));

            expect(requestSpy).toHaveBeenCalledOnce();
        });

        it('clears the cache entry on failure', async () => {
            requestSpy.mockRejectedValueOnce(new Error('404'));

            await expect(provider.findImages(discogsUrl))
                .toReject();
            await expect(provider.findImages(discogsUrl))
                .toResolve();
            expect(requestSpy).toHaveBeenCalledTimes(2);
        });

        it('does not clear cache entry twice', async () => {
            // This is quite difficult to test, since we can't control the
            // ordering in which promises will be resolved.
            requestSpy.mockRejectedValueOnce(new Error('404'));
            const deleteSpy = jest.spyOn(DiscogsProvider.apiResponseCache, 'delete');
            deleteSpy.mockClear();

            const p1 = provider.findImages(discogsUrl);
            const p2 = provider.findImages(discogsUrl);

            await expect(p1).toReject();
            await expect(p2).toReject();

            expect(deleteSpy).toHaveBeenCalledOnce();
        });
    });
});
