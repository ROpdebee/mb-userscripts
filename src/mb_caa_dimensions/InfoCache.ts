import type { DBSchema, IDBPDatabase, IDBPTransaction, StoreNames } from 'idb';
import { openDB } from 'idb';

import { LOGGER } from '@lib/logging/logger';
import { logFailure } from '@lib/util/async';

import type { Dimensions, FileInfo } from './ImageInfo';

const CACHE_DB_NAME = 'ROpdebee_CAA_Dimensions_Cache';
const CACHE_DIMENSIONS_STORE_NAME = 'dimensionsStore';
const CACHE_FILE_INFO_STORE_NAME = 'fileInfoStore';
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
    [CACHE_DIMENSIONS_STORE_NAME]: {
        key: string;
        value: Dimensions & { addedDatetime: number };
        indexes: {
            [CACHE_ADDED_TIMESTAMP_INDEX]: number;
        };
    };
    [CACHE_FILE_INFO_STORE_NAME]: {
        key: string;
        value: FileInfo & { addedDatetime: number };
        indexes: {
            [CACHE_ADDED_TIMESTAMP_INDEX]: number;
        };
    };
}

/**
 * Image information cache.
 */
export interface InfoCache {
    getDimensions(imageUrl: string): Promise<Dimensions | undefined>;
    putDimensions(imageUrl: string, dimensions: Dimensions): Promise<void>;

    getFileInfo(imageUrl: string): Promise<FileInfo | undefined>;
    putFileInfo(imageUrl: string, fileInfo: FileInfo): Promise<void>;
}

/**
 * Factory to create `InfoCache` instances depending on browser capabilities.
 *
 * @return     {InfoCache}  The image information cache.
 */
export async function createCache(): Promise<InfoCache> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (window.indexedDB !== undefined) {
        try {
            // Need to await this to ensure we catch errors here and fall back
            // on the dummy cache.
            return await IndexedDBInfoCache.create();
        } catch (err) {
            LOGGER.error('Failed to create IndexedDB-backed image information cache, repeated lookups will be slow!', err);
            // fall through and create a dummy cache
        }
    } else {
        LOGGER.warn('Your browser does not seem to support IndexedDB. A persistent image information cache will not be used, which may result in slower lookups. Consider upgrading to a more modern browser version for improved performance.');
    }

    return new NoInfoCache();
}

/**
 * Dummy information cache used when no storage backend is available.
 */
class NoInfoCache implements InfoCache {
    public getDimensions(): Promise<Dimensions | undefined> {
        return Promise.resolve(undefined);
    }

    public putDimensions(): Promise<void> {
        return Promise.resolve();
    }

    public getFileInfo(): Promise<FileInfo | undefined> {
        return Promise.resolve(undefined);
    }

    public putFileInfo(): Promise<void> {
        return Promise.resolve();
    }
}

/**
 * Image information cache backed by an IndexedDB instance.
 */
class IndexedDBInfoCache {
    private readonly db: IDBPDatabase<CacheDBSchema>;

    private constructor(db: IDBPDatabase<CacheDBSchema>) {
        this.db = db;
    }

    public static async create(): Promise<IndexedDBInfoCache> {
        return new Promise((resolve, reject) => {
            let wasBlocked = false;

            const dbPromise = openDB(CACHE_DB_NAME, CACHE_DB_VERSION, {
                async upgrade(database: IDBPDatabase<CacheDBSchema>, oldVersion: number, newVersion: number, tx: IDBPTransaction<CacheDBSchema, Array<StoreNames<CacheDBSchema>>, 'versionchange'>): Promise<void> {
                    LOGGER.info(`Creating or upgrading IndexedDB cache version ${newVersion}`);
                    if (oldVersion < 1) {
                        // Unopened, create the original stores
                        const dimensionsStore = database.createObjectStore(CACHE_DIMENSIONS_STORE_NAME);
                        dimensionsStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
                        const fileInfoStore = database.createObjectStore(CACHE_FILE_INFO_STORE_NAME);
                        fileInfoStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
                        return;
                    }

                    while (oldVersion < newVersion) {
                        LOGGER.info(`Upgrading IndexedDB cache from version ${oldVersion} to ${oldVersion + 1}`);
                        const migrator = DbMigrations[oldVersion];
                        await migrator(database, tx);
                        oldVersion++;
                    }
                },

                /* Upgrade mechanism
                 * =================
                 *
                 * When carrying out schema changes, the database needs to be locked. The browser takes care of this.
                 * However, when earlier versions of the DB are still open, the request which is supposed to carry out
                 * the schema change is blocked, and the blocked handler on the new DB will be called. Simultaneously,
                 * the blocking handler will be called on the old DB. This can happen when two tabs are open that use the DB,
                 * which is likely to happen for this script.
                 *
                 * Typically, DBs are set up in a way that the old instance will close itself to allow the schema change
                 * to occur. Scenario:
                 *  1. Tab 1 has open connection to DB v1.
                 *  2. User updates script to new DB v2.
                 *  3. Tab 2 tries to open DB v2. `blocked` is called in tab 2, `blocking` is called in tab 1.
                 *
                 * Ideally:
                 *  4. Tab 1's `blocking` closes connection to DB v1 and any further modification attempts will fail.
                 *  5. Tab 2 is unblocked, its `upgrade` will be called and it can perform the schema change.
                 *
                 * However, older versions of this script **do not** have a `blocking` listener and will not close the DB.
                 * This may prevent the new DB from opening indefinitely. Although we made an update to the old script to
                 * close the DB when it's blocking, it is not guaranteed that this update has been applied for everyone.
                 * Therefore, in the new script versions, when we notice that the request to perform a schema change is
                 * blocked, we fail the creation of the cache and fall back on no cache immediately without waiting to
                 * be unblocked. Whenever we get unblocked, we'll still perform the schema change, but the tab will
                 * continue without cache regardless.
                 *
                 * For newer versions of scripts, which do have a `blocking` listener, it seems that the `blocked` handler
                 * isn't called as long as the `blocking` handlers of the old DB instances immediately close the DB.
                 * Tested only on Firefox though.
                 */
                blocked() {
                    // Some other tab is preventing us from carrying out the required schema change.
                    // Fail and continue without cache.

                    // When unblocked, this may still perform the upgrade.
                    // However, it shouldn't attempt to resolve an already-rejected
                    // promise, so make sure it doesn't.
                    wasBlocked = true;
                    reject(new Error('Required schema change on cache DB is blocked by an older version of the script. Please close or reload any other tab on which this script is running'));
                },

                blocking() {
                    // We're preventing a new version of the script from carrying out a schema change.
                    // Close this DB instance to allow the other tab to perform the schema change.

                    // This will only be called after the DB was created successfully,
                    // so this variable will have been initialised.
                    LOGGER.warn('Closing DB for schema change in other tab');
                    logFailure(dbPromise.then((db) => {
                        db.close();
                    }), 'Failed to close database');
                },
            });

            // When database opened successfully, return it if we didn't already
            // reject before.
            dbPromise.then(async (db) => {
                LOGGER.debug('Successfully opened IndexedDB cache');

                await maybePruneDb(db);

                if (!wasBlocked) {
                    resolve(new IndexedDBInfoCache(db));
                }
            }).catch(reject);
        });
    }

    private async get<StoreName extends StoreNames<CacheDBSchema>>(storeName: StoreName, imageUrl: string): Promise<CacheDBSchema[StoreName]['value'] | undefined> {
        try {
            const cachedResult = await this.db.get(storeName, imageUrl);
            if (cachedResult !== undefined) {
                LOGGER.debug(`${imageUrl}: Cache hit`);
            } else {
                LOGGER.debug(`${imageUrl}: Cache miss`);
            }

            return cachedResult;
        } catch (err) /* istanbul ignore next: Difficult to cover */ {
            LOGGER.error(`Failed to load ${imageUrl} from cache`, err);
            throw err;
        }
    }

    private async put<StoreName extends StoreNames<CacheDBSchema>>(storeName: StoreName, imageUrl: string, value: Omit<CacheDBSchema[StoreName]['value'], 'addedDatetime'>): Promise<void> {
        try {
            await this.db.put(storeName, {
                ...value,
                addedDatetime: Date.now(),
            }, imageUrl);
            LOGGER.debug(`Successfully stored ${imageUrl} in cache`);
        } catch (err) /* istanbul ignore next: Difficult to cover */ {
            LOGGER.error(`Failed to store ${imageUrl} in cache`, err);
        }
    }

    public async getDimensions(imageUrl: string): Promise<Dimensions | undefined> {
        return this.get(CACHE_DIMENSIONS_STORE_NAME, imageUrl);
    }

    public async putDimensions(imageUrl: string, dimensions: Dimensions): Promise<void> {
        return this.put(CACHE_DIMENSIONS_STORE_NAME, imageUrl, dimensions);
    }

    public async getFileInfo(imageUrl: string): Promise<FileInfo | undefined> {
        return this.get(CACHE_FILE_INFO_STORE_NAME, imageUrl);
    }

    public async putFileInfo(imageUrl: string, fileInfo: FileInfo): Promise<void> {
        return this.put(CACHE_FILE_INFO_STORE_NAME, imageUrl, fileInfo);
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

    async function iterateAndPrune(storeName: StoreNames<CacheDBSchema>): Promise<void> {
        let cursor = await db.transaction(storeName, 'readwrite').store.index(CACHE_ADDED_TIMESTAMP_INDEX).openCursor(pruneRange);
        while (cursor !== null) {
            LOGGER.debug(`Removing ${cursor.key} (added at ${new Date(cursor.value.addedDatetime)})`);
            await cursor.delete();
            cursor = await cursor.continue();
        }
    }

    await iterateAndPrune(CACHE_DIMENSIONS_STORE_NAME);
    await iterateAndPrune(CACHE_FILE_INFO_STORE_NAME);

    LOGGER.debug('Done pruning stale entries');
    localStorage.setItem(CACHE_TIMESTAMP_NAME, Date.now().toString());
}


//// Legacy stuff

interface CacheDBSchemaV1 extends DBSchema {
    'cacheStore': {
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

type Migrator = (db: IDBPDatabase<CacheDBSchema>, tx: IDBPTransaction<CacheDBSchema, Array<StoreNames<CacheDBSchema>>, 'versionchange'>) => Promise<void>;
/**
 * Map of database migrations, indexed by current version.
 */
const DbMigrations: Record<number, Migrator> = {

    // JS version to TS version
    1: async function(db, tx) {
        // Retrieve all existing values, drop and recreate the store, and reinsert all.
        // We can't update the values in-place since v1 uses a keypath and expects
        // the URL in the values, whereas v2 does not support that.
        const txV1 = tx as unknown as IDBPTransaction<CacheDBSchemaV1, ['cacheStore'], 'versionchange'>;
        const dbV1 = db as unknown as IDBPDatabase<CacheDBSchemaV1>;
        const oldRecords = await (txV1.objectStore('cacheStore')).getAll();
        dbV1.deleteObjectStore('cacheStore');

        // Create new stores and indices
        const newDimensionsStore = db.createObjectStore(CACHE_DIMENSIONS_STORE_NAME);
        const newFileInfoStore = db.createObjectStore(CACHE_FILE_INFO_STORE_NAME);
        newDimensionsStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
        newFileInfoStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');

        // Transfer the old records
        await Promise.all(oldRecords.map(async (rec) => {
            await tx.objectStore(CACHE_DIMENSIONS_STORE_NAME).put({
                width: rec.width,
                height: rec.height,
                addedDatetime: rec.added_datetime,
            }, rec.url);
            await tx.objectStore(CACHE_FILE_INFO_STORE_NAME).put({
                size: rec.size,
                fileType: rec.format,
                addedDatetime: rec.added_datetime,
            }, rec.url);
        }));
    },
};
