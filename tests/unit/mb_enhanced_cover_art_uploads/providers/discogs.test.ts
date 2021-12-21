import { DiscogsProvider } from '@src/mb_enhanced_cover_art_uploads/providers/discogs';

import { setupPolly } from '@test-utils/pollyjs';
import { itBehavesLike } from '@test-utils/shared_behaviour';

import { urlMatchingSpec } from './url_matching_spec';
import { findImagesSpec } from './find_images_spec';

describe('discogs provider', () => {
    const pollyContext = setupPolly();
    const provider = new DiscogsProvider();

    describe('url matching', () => {
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
            url: 'https://www.discogs.com/label/61808-Victor',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release',
            url: 'https://www.discogs.com/release/9892912',
            numImages: 3,
            expectedImages: [{
                index: 0,
                urlPart: '/cGX5KW1uJCaiPRzaRY8iE3btV3g=/fit-in/600x624/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-9892912-1579456707-2320.jpeg.jpg',
                types: undefined,
            }, {
                index: 1,
                urlPart: '/GjkwgdSXa6b6KAXHqtt1lrrSebQ=/fit-in/600x601/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-9892912-1579456707-4048.jpeg.jpg',
                types: undefined,
            }, {
                index: 2,
                urlPart: '/hch5Dfg5ZsgGY7DCxWtNWEpRSs8=/fit-in/600x681/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-9892912-1488067341-2872.jpeg.jpg',
                types: undefined,
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://www.discogs.com/release/32342343',
            errorMessage: 'Discogs release does not exist',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases, pollyContext });
    });

    describe('maximising image', () => {
        it('finds the image', async () => {
            const maxUrl = await DiscogsProvider.maximiseImage(new URL('https://img.discogs.com/husmGPLvKp_kDmwLCXA_fc75LcM=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-9892912-1579456707-2320.jpeg.jpg'));

            expect(maxUrl.pathname).toBe('/cGX5KW1uJCaiPRzaRY8iE3btV3g=/fit-in/600x624/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-9892912-1579456707-2320.jpeg.jpg');
        });
    });

    describe('caching API responses', () => {
        const requestSpy = jest.spyOn(DiscogsProvider, 'actuallyGetReleaseImages');
        const discogsUrl = new URL('https://www.discogs.com/release/9892912');

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
