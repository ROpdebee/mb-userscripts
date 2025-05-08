import { DiscogsProvider } from '@src/mb_enhanced_cover_art_uploads/providers/discogs';
import { setupPolly } from '@test-utils/pollyjs';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('discogs provider', () => {
    const pollyContext = setupPolly();
    const provider = new DiscogsProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'short release URLs',
            url: 'https://www.discogs.com/release/9892912/',
            id: '9892912',
        }, {
            description: 'long release URLs',
            url: 'https://www.discogs.com/release/9892912-Wayne-King-And-His-Orchestra-A-Million-Dreams-Ago-One-Look-At-You',
            id: '9892912',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://www.discogs.com/artist/881122-Wayne-King-And-His-Orchestra',
        }, {
            description: 'release master URLs',
            url: 'https://www.discogs.com/master/1746505',
        }, {
            description: 'label URLs',
            url: 'https://www.discogs.com/label/61808-Victor',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'release',
            url: 'https://www.discogs.com/release/9892912',
            imageCount: 3,
            expectedImages: [{
                index: 0,
                urlPart: '/MPDZnLHLvqDXD9VgXjG6EuxI5mrTCMqjoysNLPs7n9g/rs:fit/g:sm/q:90/h:600/w:576/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk4OTI5/MTItMTU3OTQ1Njcw/Ny0yMzIwLmpwZWc.jpeg',
                types: undefined,
            }, {
                index: 1,
                urlPart: '/YUazmsa2FN7AEVL9uiiQcP7Akm7YzvWbOfBmlcBnp0E/rs:fit/g:sm/q:90/h:600/w:598/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk4OTI5/MTItMTU3OTQ1Njcw/Ny00MDQ4LmpwZWc.jpeg',
                types: undefined,
            }, {
                index: 2,
                urlPart: '/lc-HuQ8YhjbAzL1wbsE0ZYTNm62hhRX-23bpK01moEo/rs:fit/g:sm/q:90/h:600/w:528/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk4OTI5/MTItMTQ4ODA2NzM0/MS0yODcyLmpwZWc.jpeg',
                types: undefined,
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://www.discogs.com/release/999999999',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases, pollyContext });
    });

    describe('maximising image', () => {
        it('finds the image', async () => {
            const maxUrl = await DiscogsProvider.maximiseImage(new URL('https://i.discogs.com/wAcTcCu1v8cmYfw_D_I00DNR_RcxJfBUMb3ls7yG9Wo/rs:fit/g:sm/q:40/h:300/w:300/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk4OTI5/MTItMTU3OTQ1Njcw/Ny0yMzIwLmpwZWc.jpeg'));

            expect(maxUrl.pathname).toBe('/MPDZnLHLvqDXD9VgXjG6EuxI5mrTCMqjoysNLPs7n9g/rs:fit/g:sm/q:90/h:600/w:576/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk4OTI5/MTItMTU3OTQ1Njcw/Ny0yMzIwLmpwZWc.jpeg');
        });
    });

    describe('extracting filename from URL', () => {
        it('extracts the correct filename', () => {
            const filename = DiscogsProvider.getFilenameFromUrl(new URL('https://i.discogs.com/MPDZnLHLvqDXD9VgXjG6EuxI5mrTCMqjoysNLPs7n9g/rs:fit/g:sm/q:90/h:600/w:576/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk4OTI5/MTItMTU3OTQ1Njcw/Ny0yMzIwLmpwZWc.jpeg'));

            expect(filename).toBe('R-9892912-1579456707-2320.jpeg');
        });
    });

    describe('caching API responses', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Needed to spy on private method.
        const requestSpy = jest.spyOn(DiscogsProvider as any, 'actuallyGetReleaseImages');
        const discogsUrl = new URL('https://www.discogs.com/release/9892912');

        beforeEach(() => {
            // Make sure to clear the cache before each test, since it's static
            // individual tests may otherwise influence each other.
            DiscogsProvider['apiResponseCache'].clear();
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
            const deleteSpy = jest.spyOn(DiscogsProvider['apiResponseCache'], 'delete');
            deleteSpy.mockClear();

            const p1 = provider.findImages(discogsUrl);
            const p2 = provider.findImages(discogsUrl);

            await expect(p1).toReject();
            await expect(p2).toReject();

            expect(deleteSpy).toHaveBeenCalledOnce();
        });
    });
});
