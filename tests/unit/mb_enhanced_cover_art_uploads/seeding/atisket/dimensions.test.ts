import type { CacheStore} from '@src/mb_enhanced_cover_art_uploads/seeding/atisket/dimensions';
import { AtisketImage, CACHE_LOCALSTORAGE_KEY, localStorageCache, MAX_CACHED_IMAGES } from '@src/mb_enhanced_cover_art_uploads/seeding/atisket/dimensions';

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
            const store: CacheStore = {};
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
    it('loads file info for images with extension', async () => {
        const image = new AtisketImage('https://is2-ssl.mzstatic.com/image/thumb/Music/v4/05/f3/b2/05f3b216-755e-6472-e998-f72a3b487dc0/884501818353.jpg/9999x9999-100.jpg');

        await expect(image.getFileInfo()).resolves.toStrictEqual({
            fileType: 'JPG',
        });
    });

    it('loads file info for images without', async () => {
        const image = new AtisketImage('https://i.scdn.co/image/ab67616d0000b273843b6bc2dc1517b7f7f0f424');

        await expect(image.getFileInfo()).resolves.toStrictEqual({
            fileType: undefined,
        });
    });
});
