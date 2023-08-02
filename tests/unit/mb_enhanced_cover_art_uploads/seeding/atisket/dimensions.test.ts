import retry from 'retry';

import type { CacheEntry } from '@src/mb_enhanced_cover_art_uploads/seeding/atisket/dimensions';
import { request } from '@lib/util/request';
import { AtisketImage, CACHE_LOCALSTORAGE_KEY, localStorageCache, MAX_CACHED_IMAGES } from '@src/mb_enhanced_cover_art_uploads/seeding/atisket/dimensions';
import { setupPolly } from '@test-utils/pollyjs';

describe('local storage cache', () => {
    const dummyDimensions = {
        width: 100,
        height: 100,
    };
    const dummyNewDimensions = {
        width: 200,
        height: 150,
    };
    const dummyFileInfo = {
        fileType: 'JPEG',
        size: 1234,
    };
    const dummyNewFileInfo = {
        fileType: 'PNG',
        size: 567,
    };

    const lsSetItemSpy = jest.spyOn(window.Storage.prototype, 'setItem');
    const lsGetItemSpy = jest.spyOn(window.Storage.prototype, 'getItem');

    function mockLocalStorage(fakeLocalStorage: Record<string, string | undefined>): void {
        lsGetItemSpy.mockImplementation((key) => {
            return fakeLocalStorage[key] ?? null;
        });
        lsSetItemSpy.mockImplementation((key, value) => {
            fakeLocalStorage[key] = value;
        });
    }

    afterAll(() => {
        lsSetItemSpy.mockRestore();
        lsGetItemSpy.mockRestore();
    });

    function runTests(): void {
        it('returns no dimensions on cache miss', async () => {
            await expect(localStorageCache.getDimensions('https://example.com/notInCache'))
                .resolves.toBeUndefined();
        });

        it('returns no file info on cache miss', async () => {
            await expect(localStorageCache.getFileInfo('https://example.com/notInCache'))
                .resolves.toBeUndefined();
        });

        it('returns dimensions on cache hit', async () => {
            await localStorageCache.putDimensions('https://example.com/notYetInCache', dummyDimensions);

            await expect(localStorageCache.getDimensions('https://example.com/notYetInCache'))
                .resolves.toStrictEqual(dummyDimensions);
        });

        it('returns file info on cache hit', async () => {
            await localStorageCache.putFileInfo('https://example.com/notYetInCache', dummyFileInfo);

            await expect(localStorageCache.getFileInfo('https://example.com/notYetInCache'))
                .resolves.toStrictEqual(dummyFileInfo);
        });

        it('returns no dimensions if only file info is known', async () => {
            await localStorageCache.putFileInfo('https://example.com/notYetInCache', dummyFileInfo);

            await expect(localStorageCache.getDimensions('https://example.com/notYetInCache'))
                .resolves.toBeUndefined();
        });

        it('returns no file info if only dimensions are known', async () => {
            await localStorageCache.putDimensions('https://example.com/notYetInCache', dummyDimensions);

            await expect(localStorageCache.getFileInfo('https://example.com/notYetInCache'))
                .resolves.toBeUndefined();
        });

        it('sets file info when dimensions already in cache', async () => {
            await localStorageCache.putDimensions('https://example.com/notYetInCache', dummyDimensions);
            await localStorageCache.putFileInfo('https://example.com/notYetInCache', dummyFileInfo);

            await expect(localStorageCache.getFileInfo('https://example.com/notYetInCache'))
                .resolves.toStrictEqual(dummyFileInfo);
        });

        it('retains previous dimensions info when setting file info', async () => {
            await localStorageCache.putDimensions('https://example.com/notYetInCache', dummyDimensions);
            await localStorageCache.putFileInfo('https://example.com/notYetInCache', dummyFileInfo);

            await expect(localStorageCache.getDimensions('https://example.com/notYetInCache'))
                .resolves.toStrictEqual(dummyDimensions);
        });

        it('sets dimensions when file info already in cache', async () => {
            await localStorageCache.putFileInfo('https://example.com/notYetInCache', dummyFileInfo);
            await localStorageCache.putDimensions('https://example.com/notYetInCache', dummyDimensions);

            await expect(localStorageCache.getDimensions('https://example.com/notYetInCache'))
                .resolves.toStrictEqual(dummyDimensions);
        });

        it('retains previous file info info when setting dimensions', async () => {
            await localStorageCache.putFileInfo('https://example.com/notYetInCache', dummyFileInfo);
            await localStorageCache.putDimensions('https://example.com/notYetInCache', dummyDimensions);

            await expect(localStorageCache.getFileInfo('https://example.com/notYetInCache'))
                .resolves.toStrictEqual(dummyFileInfo);
        });

        it('overwrites dimensions and keeps file info when entry already in cache', async () => {
            await localStorageCache.putFileInfo('https://example.com/notYetInCache', dummyFileInfo);
            await localStorageCache.putDimensions('https://example.com/notYetInCache', dummyDimensions);
            await localStorageCache.putDimensions('https://example.com/notYetInCache', dummyNewDimensions);

            await expect(localStorageCache.getDimensions('https://example.com/notYetInCache'))
                .resolves.toStrictEqual(dummyNewDimensions);
        });

        it('overwrites file info and keeps dimensions when entry already in cache', async () => {
            await localStorageCache.putFileInfo('https://example.com/notYetInCache', dummyFileInfo);
            await localStorageCache.putDimensions('https://example.com/notYetInCache', dummyDimensions);
            await localStorageCache.putFileInfo('https://example.com/notYetInCache', dummyNewFileInfo);

            await expect(localStorageCache.getFileInfo('https://example.com/notYetInCache'))
                .resolves.toStrictEqual(dummyNewFileInfo);
        });
    }

    describe('with empty cache', () => {
        beforeEach(() => {
            mockLocalStorage({
                [CACHE_LOCALSTORAGE_KEY]: '{}',
            });
        });

        // eslint-disable-next-line jest/require-hook
        runTests();
    });

    describe('with non-existent cache', () => {
        // Simulate first run
        beforeEach(() => {
            mockLocalStorage({});
        });

        // eslint-disable-next-line jest/require-hook
        runTests();
    });

    describe('with broken cache', () => {
        beforeEach(() => {
            mockLocalStorage({
                [CACHE_LOCALSTORAGE_KEY]: '{{{},,,}not json!',
            });
        });

        // eslint-disable-next-line jest/require-hook
        runTests();
    });

    describe('with non-empty cache', () => {
        const store = {
            'https://example.com/1': {
                dimensions: dummyDimensions,
                fileInfo: dummyFileInfo,
                addedDatetime: 123,
            },
            'https://example.com/2': {
                dimensions: dummyDimensions,
                fileInfo: dummyFileInfo,
                addedDatetime: 456,
            },
        };

        beforeEach(() => {
            mockLocalStorage({
                [CACHE_LOCALSTORAGE_KEY]: JSON.stringify(store),
            });
        });

        // eslint-disable-next-line jest/require-hook
        runTests();

        it('retains previous entries when inserting new entry', async () => {
            await localStorageCache.putDimensions('https://example.com/3', dummyNewDimensions);

            await expect(localStorageCache.getDimensions('https://example.com/1'))
                .resolves.toStrictEqual(dummyDimensions);
            await expect(localStorageCache.getDimensions('https://example.com/2'))
                .resolves.toStrictEqual(dummyDimensions);
            await expect(localStorageCache.getFileInfo('https://example.com/1'))
                .resolves.toStrictEqual(dummyFileInfo);
            await expect(localStorageCache.getFileInfo('https://example.com/2'))
                .resolves.toStrictEqual(dummyFileInfo);
        });
    });

    describe('with full cache', () => {
        beforeEach(() => {
            const store: Record<string, CacheEntry> = {};
            let i = MAX_CACHED_IMAGES;
            while (i--) {
                store[`https://example.com/${i}`] = {
                    dimensions: dummyDimensions,
                    fileInfo: dummyFileInfo,
                    addedDatetime: i,
                };
            }

            mockLocalStorage({
                [CACHE_LOCALSTORAGE_KEY]: JSON.stringify(store),
            });
        });

        // eslint-disable-next-line jest/require-hook
        runTests();

        it('removes oldest entry when inserting new entry', async () => {
            await localStorageCache.putDimensions('https://example.com/abc', dummyNewDimensions);

            await expect(localStorageCache.getDimensions('https://example.com/0'))
                .resolves.toBeUndefined();
            await expect(localStorageCache.getFileInfo('https://example.com/0'))
                .resolves.toBeUndefined();
        });

        it('keeps second-oldest entry when inserting new entry', async () => {
            await localStorageCache.putDimensions('https://example.com/abc', dummyNewDimensions);

            await expect(localStorageCache.getDimensions('https://example.com/1'))
                .resolves.toBeDefined();
            await expect(localStorageCache.getFileInfo('https://example.com/1'))
                .resolves.toBeDefined();
        });
    });
});

describe('a-tisket images', () => {
    const pollyContext = setupPolly();

    it('loads file info for Apple Music images', async () => {
        const image = new AtisketImage('https://is2-ssl.mzstatic.com/image/thumb/Music/v4/05/f3/b2/05f3b216-755e-6472-e998-f72a3b487dc0/884501818353.jpg/9999x9999-100.jpg');

        await expect(image.getFileInfo()).resolves.toStrictEqual({
            size: 1_826_850,
            fileType: 'JPEG',
        });
    });

    it('loads file info for Apple Music PNG images', async () => {
        const image = new AtisketImage('https://a1.mzstatic.com/us/r1000/063/Music126/v4/48/4f/49/484f49a5-fb52-37b3-f3c6-244e20f74b7c/5052075509815.png');

        await expect(image.getFileInfo()).resolves.toStrictEqual({
            size: 23_803_429,  // I'm glad we're just getting headers, this is huge!
            fileType: 'PNG',
        });
    });

    it('loads file info for Spotify images', async () => {
        const image = new AtisketImage('https://i.scdn.co/image/ab67616d0000b273843b6bc2dc1517b7f7f0f424');

        await expect(image.getFileInfo()).resolves.toStrictEqual({
            fileType: 'JPEG',
            size: 102_281,
        });
    });

    it('loads file info for Deezer images', async () => {
        const image = new AtisketImage('https://e-cdns-images.dzcdn.net/images/cover/2d8c720d7fee9506e40c5f16760c3640/1200x0-000000-100-0-0.jpg');

        await expect(image.getFileInfo()).resolves.toStrictEqual({
            fileType: 'JPEG',
            size: 365_960,
        });
    });

    describe('retrying', () => {
        // We won't mock out the p-retry module, since replicating its behaviour
        // will be tricky. Instead, we'll mock out the function that creates the
        // underlying timeouts, so retries are done immediately and the tests don't
        // time out.
        const timeoutsSpy = jest.spyOn(retry, 'timeouts');
        const requestSpy = jest.spyOn(request, 'head');

        beforeEach(() => {
            timeoutsSpy.mockReturnValue([0, 0, 0, 0, 0]);
            requestSpy.mockClear();
        });

        it('retries on 429 errors', async () => {
            pollyContext.polly.server
                .any()
                .intercept((_req, res) => {
                    res.sendStatus(429);
                });
            const image = new AtisketImage('https://example.com/test');

            await expect(image.getFileInfo()).resolves.toBeUndefined();
            expect(requestSpy).toHaveBeenCalledTimes(6); // First try + 5 retries
        });

        it('does not retry on 404 errors', async () => {
            pollyContext.polly.server
                .any()
                .intercept((_req, res) => {
                    res.sendStatus(404);
                });
            const image = new AtisketImage('https://example.com/test');

            await expect(image.getFileInfo()).resolves.toBeUndefined();
            expect(requestSpy).toHaveBeenCalledTimes(1);
        });

        it('retries on 503 errors', async () => {
            pollyContext.polly.server
                .any()
                .intercept((_req, res) => {
                    res.sendStatus(503);
                });
            const image = new AtisketImage('https://example.com/test');

            await expect(image.getFileInfo()).resolves.toBeUndefined();
            expect(requestSpy).toHaveBeenCalledTimes(6);
        });
    });
});
