import 'fake-indexeddb/auto';

import type { IDBPDatabase, OpenDBCallbacks } from 'idb';
import FDBFactory from 'fake-indexeddb/lib/FDBFactory';
import { openDB } from 'idb';

import { createCache } from '@src/mb_caa_dimensions/InfoCache';

import { dummyDimensions, dummyFileInfo } from './test-utils/mock-data';

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
        delete window.indexedDB;

        const cache = await createCache();

        await cache.putDimensions('test', dummyDimensions);
        await cache.putFileInfo('test', dummyFileInfo);

        await expect(cache.getDimensions('test')).resolves.toBeUndefined();
        await expect(cache.getFileInfo('test')).resolves.toBeUndefined();
    });

    it('uses real cache when IndexedDB is available', async () => {
        const cache = await createCache();

        await cache.putDimensions('test', dummyDimensions);

        await expect(cache.getDimensions('test')).resolves.toBeDefined();
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
        await cache.putDimensions('test', dummyDimensions);

        await expect(cache.getDimensions('test')).resolves.toBeUndefined();
    });
});

describe('indexedDB-backed info cache', () => {
    describe('putting dimensions records', () => {
        it('inserts a timestamp', async () => {
            const cache = await createCache();
            mockDateNow.mockReturnValueOnce(123);

            await cache.putDimensions('test', dummyDimensions);

            await expect(cache.getDimensions('test')).resolves.toHaveProperty('addedDatetime', 123);
        });
    });

    describe('getting dimensions records', () => {
        it('returns no record if none has been added', async () => {
            const cache = await createCache();

            await expect(cache.getDimensions('test')).resolves.toBeUndefined();
        });

        it('returns the previously-added record', async () => {
            const cache = await createCache();
            mockDateNow.mockReturnValueOnce(123);
            await cache.putDimensions('test', dummyDimensions);

            await expect(cache.getDimensions('test')).resolves.toStrictEqual({
                ...dummyDimensions,
                addedDatetime: 123,
            });
        });
    });

    describe('putting file info records', () => {
        it('inserts a timestamp', async () => {
            const cache = await createCache();
            mockDateNow.mockReturnValueOnce(123);

            await cache.putFileInfo('test', dummyFileInfo);

            await expect(cache.getFileInfo('test')).resolves.toHaveProperty('addedDatetime', 123);
        });
    });

    describe('getting file info records', () => {
        it('returns no record if none has been added', async () => {
            const cache = await createCache();

            await expect(cache.getFileInfo('test')).resolves.toBeUndefined();
        });

        it('returns the previously-added record', async () => {
            const cache = await createCache();
            mockDateNow.mockReturnValueOnce(123);
            await cache.putFileInfo('test', dummyFileInfo);

            await expect(cache.getFileInfo('test')).resolves.toStrictEqual({
                ...dummyFileInfo,
                addedDatetime: 123,
            });
        });
    });
});

function oldDBCreateSchema(db: IDBPDatabase): void {
    const store = db.createObjectStore('cacheStore', { keyPath: 'url' });
    store.createIndex('added_datetime', 'added_datetime');
}

function createOtherDB(version = 1, options?: OpenDBCallbacks<unknown>): Promise<IDBPDatabase> {
    return openDB('ROpdebee_CAA_Dimensions_Cache', version, options ?? {
        upgrade: oldDBCreateSchema,
    });
}

describe('database migrations', () => {
    describe('blocked upgrades', () => {
        it('falls back on no cache if blocked by an open DB that will not close', async () => {
            const oldDB = await createOtherDB();
            const cache = await createCache();

            await cache.putDimensions('test', dummyDimensions);
            await cache.putFileInfo('test', dummyFileInfo);

            await expect(cache.getDimensions('test')).resolves.toBeUndefined();
            await expect(cache.getFileInfo('test')).resolves.toBeUndefined();

            // I think jest will complain if a promise is settled twice, so this
            // should be enough to verify that it doesn't resolve after rejecting.
            // We do need to take care to close the blocking DB instance though,
            // otherwise the tests leak resources.
            oldDB.close();
        });

        it('closes the DB when blocking an upgrade', async () => {
            const upgradeMock = jest.fn();
            await createCache();
            await createOtherDB(99_999, {
                upgrade: upgradeMock,
            });

            expect(upgradeMock).toHaveBeenCalledOnce();
        });

        it('allows no further use of the DB after closing when blocking an upgrade', async () => {
            const cache = await createCache();
            await createOtherDB(99_999, {
                upgrade: jest.fn(),
            });

            await expect(cache.getDimensions('test')).toReject();
        });
    });

    describe('1 to 2', () => {
        beforeEach(async () => {
            const oldDB = await createOtherDB();

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

            await expect(cache.getDimensions('test')).resolves.toStrictEqual({
                ...dummyDimensions,
                addedDatetime: 123,
            });
            await expect(cache.getDimensions('test2')).resolves.toStrictEqual({
                ...dummyDimensions,
                addedDatetime: 456,
            });
            await expect(cache.getFileInfo('test')).resolves.toStrictEqual({
                ...dummyFileInfo,
                addedDatetime: 123,
            });
            await expect(cache.getFileInfo('test2')).resolves.toStrictEqual({
                ...dummyFileInfo,
                addedDatetime: 456,
            });
        });

        it('should contain a usable index', async () => {
            const cache = await createCache();
            // @ts-expect-error: X-raying private things
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const db: IDBPDatabase = cache['db'];

            await expect(db.getFromIndex('dimensionsStore', 'addedDatetimeIdx', IDBKeyRange.upperBound(200))).resolves.toStrictEqual({
                ...dummyDimensions,
                addedDatetime: 123,
            });
            await expect(db.getFromIndex('fileInfoStore', 'addedDatetimeIdx', IDBKeyRange.upperBound(200))).resolves.toStrictEqual({
                ...dummyFileInfo,
                addedDatetime: 123,
            });
        });
    });
});

describe('pruning cache', () => {
    const CACHE_STALE_TIME: number = 14 * 24 * 60 * 60 * 1000;  // 2 weeks

    beforeEach(async () => {
        const cache = await createCache();

        mockDateNow.mockReturnValueOnce(123);
        await cache.putDimensions('test', dummyDimensions);
        mockDateNow.mockReturnValueOnce(123);
        await cache.putFileInfo('test', dummyFileInfo);
        mockDateNow.mockReturnValueOnce(456);
        await cache.putDimensions('test2', dummyDimensions);
        mockDateNow.mockReturnValueOnce(456);
        await cache.putFileInfo('test2', dummyFileInfo);

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

        await expect(cache.getDimensions('test')).resolves.toBeUndefined();
        await expect(cache.getDimensions('test2')).resolves.toBeUndefined();
        await expect(cache.getFileInfo('test')).resolves.toBeUndefined();
        await expect(cache.getFileInfo('test2')).resolves.toBeUndefined();
    });

    it('does not prune cache if last check was recent', async () => {
        localStorage.setItem('ROpdebee_Last_Cache_Prune_Check', '300');
        mockDateNow.mockReturnValue(500);
        const cache = await createCache();

        await expect(cache.getDimensions('test')).resolves.toBeDefined();
        await expect(cache.getDimensions('test2')).resolves.toBeDefined();
        await expect(cache.getFileInfo('test')).resolves.toBeDefined();
        await expect(cache.getFileInfo('test2')).resolves.toBeDefined();
    });

    it('prunes cache if last check was not recent', async () => {
        localStorage.setItem('ROpdebee_Last_Cache_Prune_Check', '300');
        mockDateNow.mockReturnValue(500 + CACHE_STALE_TIME);
        const cache = await createCache();

        await expect(cache.getDimensions('test')).resolves.toBeUndefined();
        await expect(cache.getDimensions('test2')).resolves.toBeUndefined();
        await expect(cache.getFileInfo('test')).resolves.toBeUndefined();
        await expect(cache.getFileInfo('test2')).resolves.toBeUndefined();
    });

    it('only prunes stale entries', async () => {
        // Value below should be enough to prune the first entry but keep the second.
        mockDateNow.mockReturnValue(250 + CACHE_STALE_TIME);
        const cache = await createCache();

        await expect(cache.getDimensions('test')).resolves.toBeUndefined();
        await expect(cache.getDimensions('test2')).resolves.toBeDefined();
        await expect(cache.getFileInfo('test')).resolves.toBeUndefined();
        await expect(cache.getFileInfo('test2')).resolves.toBeDefined();
    });

    it('remembers last prune time', async () => {
        mockDateNow.mockReturnValue(250 + CACHE_STALE_TIME);
        const cache = await createCache();

        // Should have pruned the entry for 'test', but not for 'test2'
        await expect(cache.getDimensions('test')).resolves.toBeUndefined();
        await expect(cache.getDimensions('test2')).resolves.toBeDefined();

        mockDateNow.mockReturnValue(1000 + CACHE_STALE_TIME);
        // If another pruning run occurs, this should also prune the entry for
        // 'test2'. However, the last prune was recent, so it shouldn't run again.
        const cache2 = await createCache();

        await expect(cache2.getDimensions('test2')).resolves.toBeDefined();
    });
});
