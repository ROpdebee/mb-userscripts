import 'fake-indexeddb/auto';

import type { IDBPDatabase } from 'idb';
import FDBFactory from 'fake-indexeddb/lib/FDBFactory';
import { openDB } from 'idb';

import { createCache } from '@src/mb_caa_dimensions/InfoCache';


const dummyImageInfo = {
    dimensions: {
        width: 100,
        height: 100,
    },
    size: 100,
    fileType: 'PNG',
};

const mockDateNow = jest.spyOn(Date, 'now');

beforeEach(() => {
    mockDateNow.mockReturnValue(0);
});

afterEach(() => {
    window.indexedDB = new FDBFactory();
    mockDateNow.mockReset();
});

describe('creating InfoCache instances', () => {
    it('uses dummy cache when IndexedDB is not available', async () => {
        // Make sure the fake IDB is undefined
        // @ts-expect-error: Mocking
        delete window['indexedDB'];

        const cache = await createCache();

        await cache.put('test', dummyImageInfo);

        await expect(cache.get('test')).resolves.toBeUndefined();
    });

    it('uses real cache when IndexedDB is available', async () => {
        const cache = await createCache();

        await cache.put('test', dummyImageInfo);

        await expect(cache.get('test')).resolves.toBeDefined();
    });

    it('falls back on fake cache if newer IDB version is defined', async () => {
        // Here, we're testing what would happen if a user decides to downgrade
        // the script version when we've defined a newer version of the cache
        // schema in the up-to-date script.
        const newerDB = await openDB('ROpdebee_CAA_Dimensions_Cache', 3, {
            upgrade(db) {
                db.createObjectStore('testStore');
            },
        });
        newerDB.close();

        const cache = await createCache();
        await cache.put('test', dummyImageInfo);

        await expect(cache.get('test')).resolves.toBeUndefined();
    });
});

describe('indexedDB-backed info cache', () => {
    describe('putting records', () => {
        it('inserts a timestamp', async () => {
            const cache = await createCache();
            mockDateNow.mockReturnValueOnce(123);

            await cache.put('test', dummyImageInfo);

            await expect(cache.get('test')).resolves.toHaveProperty('addedDatetime', 123);
        });
    });

    describe('getting records', () => {
        it('returns no record if none has been added', async () => {
            const cache = await createCache();

            await expect(cache.get('test')).resolves.toBeUndefined();
        });

        it('returns the previously-added record', async () => {
            const cache = await createCache();
            mockDateNow.mockReturnValueOnce(123);
            await cache.put('test', dummyImageInfo);

            await expect(cache.get('test')).resolves.toStrictEqual({
                ...dummyImageInfo,
                addedDatetime: 123,
            });
        });
    });
});

describe('database migrations', () => {
    describe('1 to 2', () => {
        beforeEach(async () => {
            const oldDB = await openDB('ROpdebee_CAA_Dimensions_Cache', 1, {
                upgrade(db) {
                    const store = db.createObjectStore('cacheStore', { keyPath: 'url' });
                    store.createIndex('added_datetime', 'added_datetime');
                },
            });

            await Promise.all([
                oldDB.put('cacheStore', {
                    url: 'test',
                    width: 100,
                    height: 100,
                    size: 100,
                    format: 'PNG',
                    added_datetime: 123,
                }),
                oldDB.put('cacheStore', {
                    url: 'test2',
                    width: 100,
                    height: 100,
                    size: 100,
                    format: 'PNG',
                    added_datetime: 456,
                }),
            ]);

            oldDB.close();
        });

        it('should retain all old entries', async () => {
            const cache = await createCache();

            await expect(cache.get('test')).resolves.toStrictEqual({
                ...dummyImageInfo,
                addedDatetime: 123,
            });
            await expect(cache.get('test2')).resolves.toStrictEqual({
                ...dummyImageInfo,
                addedDatetime: 456,
            });
        });

        it('should contain a usable index', async () => {
            const cache = await createCache();
            // @ts-expect-error: X-raying private things
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const db: IDBPDatabase = cache['db'];

            await expect(db.getFromIndex('cacheStore', 'addedDatetimeIdx', IDBKeyRange.upperBound(200))).resolves.toStrictEqual({
                ...dummyImageInfo,
                addedDatetime: 123,
            });
        });
    });
});

describe('pruning cache', () => {
    const CACHE_CHECK_INTERVAL: number = 24 * 60 * 60 * 1000;   // Daily
    const CACHE_STALE_TIME: number = 14 * 24 * 60 * 60 * 1000;  // 2 weeks

    beforeEach(async () => {
        const cache = await createCache();

        mockDateNow.mockReturnValueOnce(123);
        await cache.put('test', dummyImageInfo);
        mockDateNow.mockReturnValueOnce(456);
        await cache.put('test2', dummyImageInfo);

        // @ts-expect-error: X-raying private things
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const db: IDBDatabase = cache['db'];
        db.close();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('prunes cache if no cache prune was done before', async () => {
        mockDateNow.mockReturnValue(1000 + CACHE_STALE_TIME);
        const cache = await createCache();

        await expect(cache.get('test')).resolves.toBeUndefined();
        await expect(cache.get('test2')).resolves.toBeUndefined();
    });

    it('does not prune cache if last check was recent', async () => {
        localStorage.setItem('ROpdebee_Last_Cache_Prune_Check', '300');
        mockDateNow.mockReturnValue(500);
        const cache = await createCache();

        await expect(cache.get('test')).resolves.toBeDefined();
        await expect(cache.get('test2')).resolves.toBeDefined();
    });

    it('prunes cache if last check was not recent', async () => {
        localStorage.setItem('ROpdebee_Last_Cache_Prune_Check', '300');
        mockDateNow.mockReturnValue(500 + CACHE_STALE_TIME);
        const cache = await createCache();

        await expect(cache.get('test')).resolves.toBeUndefined();
        await expect(cache.get('test2')).resolves.toBeUndefined();
    });

    it('only prunes stale entries', async () => {
        // Value below should be enough to prune the first entry but keep the second.
        mockDateNow.mockReturnValue(250 + CACHE_STALE_TIME);
        const cache = await createCache();

        await expect(cache.get('test')).resolves.toBeUndefined();
        await expect(cache.get('test2')).resolves.toBeDefined();
    });

    it('remembers last prune time', async () => {
        mockDateNow.mockReturnValue(250 + CACHE_STALE_TIME);
        const cache = await createCache();

        await expect(cache.get('test')).resolves.toBeUndefined();
        await expect(cache.get('test2')).resolves.toBeDefined();

        mockDateNow.mockReturnValue(1000 + CACHE_STALE_TIME);
        const cache2 = await createCache();

        await expect(cache2.get('test')).resolves.toBeUndefined();
        await expect(cache2.get('test2')).resolves.toBeDefined();
    });
});
