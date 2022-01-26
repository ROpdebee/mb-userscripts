import { DiscogsProvider } from '@src/mb_enhanced_cover_art_uploads/providers/discogs';
import { setupPolly } from '@test-utils/pollyjs';
import { itBehavesLike } from '@test-utils/shared_behaviour';

import { findImagesSpec } from './find_images_spec';
import { urlMatchingSpec } from './url_matching_spec';

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
                urlPart: '/aRe2RbRXu0g4PvRjrPgQKb_YmFWO3Y0CYc098S8Q1go/rs:fit/g:sm/q:90/h:600/w:576/czM6Ly9kaXNjb2dz/LWltYWdlcy9SLTk4/OTI5MTItMTU3OTQ1/NjcwNy0yMzIwLmpw/ZWc.jpeg',
                types: undefined,
            }, {
                index: 1,
                urlPart: '/VKFNcm02R4h4UfP9lF4qVq7KkdR8XGTrSyn2sGUH8xU/rs:fit/g:sm/q:90/h:600/w:598/czM6Ly9kaXNjb2dz/LWltYWdlcy9SLTk4/OTI5MTItMTU3OTQ1/NjcwNy00MDQ4Lmpw/ZWc.jpeg',
                types: undefined,
            }, {
                index: 2,
                urlPart: '/kL5esHGWNIcGaRvR2m-B1sK2OqvKJro8t2zRrsqQzOs/rs:fit/g:sm/q:90/h:600/w:528/czM6Ly9kaXNjb2dz/LWltYWdlcy9SLTk4/OTI5MTItMTQ4ODA2/NzM0MS0yODcyLmpw/ZWc.jpeg',
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
            const maxUrl = await DiscogsProvider.maximiseImage(new URL('https://i.discogs.com/_xL4yC-gjc-awYVWmO4dDmOv-Za3oICJweuYqpnEzwk/rs:fit/g:sm/q:40/h:300/w:300/czM6Ly9kaXNjb2dz/LWltYWdlcy9SLTk4/OTI5MTItMTU3OTQ1/NjcwNy0yMzIwLmpw/ZWc.jpeg'));

            expect(maxUrl.pathname).toBe('/aRe2RbRXu0g4PvRjrPgQKb_YmFWO3Y0CYc098S8Q1go/rs:fit/g:sm/q:90/h:600/w:576/czM6Ly9kaXNjb2dz/LWltYWdlcy9SLTk4/OTI5MTItMTU3OTQ1/NjcwNy0yMzIwLmpw/ZWc.jpeg');
        });
    });

    describe('extracting filename from URL', () => {
        it('extracts the correct filename', async () => {
            const filename = DiscogsProvider.getFilenameFromUrl(new URL('https://i.discogs.com/aRe2RbRXu0g4PvRjrPgQKb_YmFWO3Y0CYc098S8Q1go/rs:fit/g:sm/q:90/h:600/w:576/czM6Ly9kaXNjb2dz/LWltYWdlcy9SLTk4/OTI5MTItMTU3OTQ1/NjcwNy0yMzIwLmpw/ZWc.jpeg'));

            expect(filename).toBe('R-9892912-1579456707-2320.jpeg');
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
