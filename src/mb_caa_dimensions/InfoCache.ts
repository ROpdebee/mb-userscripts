import type { DBSchema, IDBPDatabase, IDBPObjectStore, IDBPTransaction } from 'idb';
import { openDB } from 'idb/with-async-ittr';

import { LOGGER } from '@lib/logging/logger';

import type { ImageInfo } from './ImageInfo';

const CACHE_DB_NAME = 'ROpdebee_CAA_Dimensions_Cache';
const CACHE_STORE_NAME = 'cacheStore';
const CACHE_ADDED_TIMESTAMP_INDEX = 'addedDatetimeIdx';
/**
 * Cache DB version.
 *
 * Version history:
 *   1. Original JS version, untyped.
 *   2. Initial TS rewritten version.
 */
const CACHE_DB_VERSION = 2;

const CACHE_TIMESTAMP_NAME = 'ROpdebee_Last_Cache_Prune_Check';

/**
 * Minimum amount of time (in seconds) between two cache cleanup checks.
 */
const CACHE_CHECK_INTERVAL: number = 24 * 60 * 60 * 1000;   // Daily

/**
 * Time until a cache entry is marked as stale and deleted.
 */
const CACHE_STALE_TIME: number = 14 * 24 * 60 * 60 * 1000;  // 2 weeks

interface CacheDBSchema extends DBSchema {
    [CACHE_STORE_NAME]: {
        key: string;
        value: ImageInfo & { addedDatetime: number };
        indexes: {
            [CACHE_ADDED_TIMESTAMP_INDEX]: number;
        };
    };
}

/**
 * Image information cache.
 */
export interface InfoCache {
    get(imageUrl: string): Promise<ImageInfo | undefined>;
    put(imageUrl: string, imageInfo: ImageInfo): Promise<void>;
}

/**
 * Factory to create `InfoCache` instances depending on browser capabilities.
 *
 * @return     {InfoCache}  The image information cache.
 */
export async function createCache(): Promise<InfoCache> {
    if (typeof window.indexedDB !== 'undefined') {
        try {
            // Need to await this to ensure we catch errors here and fall back
            // on the dummy cache.
            return await IndexedDBInfoCache.create();
        } catch (e) {
            LOGGER.error('Failed to create IndexedDB-backed image information cache, repeated lookups will be slow!', e);
            // fall through and create a dummy cache
        }
    } else {
        LOGGER.warn('Your browser does not seem to support IndexedDB. A persistent image information cache will not be used, which may result in slower lookups. Consider upgrading to a more modern browser version for improved performance.');
    }

    return Promise.resolve(new NoInfoCache());
}

/**
 * Dummy information cache used when no storage backend is available.
 */
class NoInfoCache implements InfoCache {
    get(): Promise<ImageInfo | undefined> {
        return Promise.resolve(undefined);
    }

    put(): Promise<void> {
        return Promise.resolve();
    }
}

/**
 * Image information cache backed by an IndexedDB instance.
 */
class IndexedDBInfoCache {
    private readonly db: IDBPDatabase<CacheDBSchema>;

    constructor(db: IDBPDatabase<CacheDBSchema>) {
        this.db = db;
    }

    static async create(): Promise<IndexedDBInfoCache> {
        const db = await openDB(CACHE_DB_NAME, CACHE_DB_VERSION, {
            async upgrade(database: IDBPDatabase<CacheDBSchema>, oldVersion: number, newVersion: number, tx: IDBPTransaction<CacheDBSchema, Array<typeof CACHE_STORE_NAME>, 'versionchange'>): Promise<void> {
                LOGGER.info(`Creating or upgrading IndexedDB cache version ${newVersion}`);
                if (oldVersion < 1) {
                    // Unopened, create the original stores
                    const store = database.createObjectStore(CACHE_STORE_NAME);
                    store.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
                    return;
                }

                while (oldVersion < newVersion) {
                    LOGGER.info(`Upgrading IndexedDB cache from version ${oldVersion} to ${oldVersion + 1}`);
                    const migrator = DbMigrations[oldVersion];
                    await migrator(database, tx);
                    oldVersion++;
                }
            },
        });

        LOGGER.debug('Successfully opened IndexedDB cache');

        await maybePruneDb(db);
        return new IndexedDBInfoCache(db);
    }

    async get(imageUrl: string): Promise<ImageInfo | undefined> {
        try {
            const cachedResult = await this.db.get(CACHE_STORE_NAME, imageUrl);
            if (typeof cachedResult !== 'undefined') {
                LOGGER.debug(`${imageUrl}: Cache hit`);
            } else {
                LOGGER.debug(`${imageUrl}: Cache miss`);
            }

            return cachedResult;
        } catch (e) /* istanbul ignore next: Difficult to cover */ {
            LOGGER.error(`Failed to load ${imageUrl} from cache: ${e}`);
            throw e;
        }
    }

    async put(imageUrl: string, imageInfo: ImageInfo): Promise<void> {
        try {
            await this.db.put(CACHE_STORE_NAME, {
                ...imageInfo,
                addedDatetime: Date.now(),
            }, imageUrl);
            LOGGER.debug(`Successfully stored ${imageUrl} in cache`);
        } catch (e) /* istanbul ignore next: Difficult to cover */ {
            LOGGER.error(`Failed to store ${imageUrl} in cache`, e);
        }
    }
}

async function maybePruneDb(db: IDBPDatabase<CacheDBSchema>): Promise<void> {
    const lastPruneTimestamp = parseInt(localStorage.getItem(CACHE_TIMESTAMP_NAME) ?? '0');
    const timeSinceLastPrune = Date.now() - lastPruneTimestamp;
    if (timeSinceLastPrune < CACHE_CHECK_INTERVAL) {
        LOGGER.debug(`Cache was last pruned at ${new Date(lastPruneTimestamp)}, pruning is unnecessary`);
        return;
    }

    LOGGER.info('Pruning stale entries from cache');
    const pruneRange = IDBKeyRange.upperBound(Date.now() - CACHE_STALE_TIME);
    for await (const cursor of db.transaction(CACHE_STORE_NAME, 'readwrite').store.index(CACHE_ADDED_TIMESTAMP_INDEX).iterate(pruneRange)) {
        LOGGER.debug(`Removing ${cursor.key} (added at ${new Date(cursor.value.addedDatetime)})`);
        await cursor.delete();
    }

    LOGGER.debug('Done pruning stale entries');
    localStorage.setItem(CACHE_TIMESTAMP_NAME, Date.now().toString());
}


//// Legacy stuff

interface CacheDBSchemaV1 extends DBSchema {
    [CACHE_STORE_NAME]: {
        key: string;
        value: {
            url: string;
            width: number;
            height: number;
            size: number;
            format: string;
            added_datetime: number;
        };
    };
}

type Migrator = (db: IDBPDatabase<CacheDBSchema>, tx: IDBPTransaction<CacheDBSchema, Array<typeof CACHE_STORE_NAME>, 'versionchange'>) => Promise<void>;
/**
 * Map of database migrations, indexed by current version.
 */
const DbMigrations: Record<number, Migrator> = {

    // JS version to TS version
    1: async function(db, tx) {
        // Retrieve all existing values, drop and recreate the store, and reinsert all.
        // We can't update the values in-place since v1 uses a keypath and expects
        // the URL in the values, whereas v2 does not support that.
        const oldRecords = await (tx.objectStore(CACHE_STORE_NAME) as unknown as IDBPObjectStore<CacheDBSchemaV1>).getAll();
        db.deleteObjectStore(CACHE_STORE_NAME);

        const newStore = db.createObjectStore(CACHE_STORE_NAME);
        await Promise.all(oldRecords.map((rec) => tx.objectStore(CACHE_STORE_NAME).put({
            dimensions: {
                width: rec.width,
                height: rec.height,
            },
            size: rec.size,
            fileType: rec.format,
            addedDatetime: rec.added_datetime,
        }, rec.url)));

        // Create the new index
        newStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
    },
};
