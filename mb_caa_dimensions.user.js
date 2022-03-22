// ==UserScript==
// @name         MB: Display CAA image dimensions
// @version      2022.3.22
// @description  Loads and displays the image dimensions of images in the cover art archive.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_caa_dimensions.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_caa_dimensions.user.js
// @match        *://musicbrainz.org/*
// @match        *://*.musicbrainz.org/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

const DEBUG = false;
function _debug_int(msg) {
    console.debug('[caa_dimensions] ' + msg);
}
let _debug = DEBUG ? _debug_int : ((msg) => {});
function _log(msg) {
    console.log('[caa_dimensions] ' + msg);
}

const CACHE_DB_NAME = 'ROpdebee_CAA_Dimensions_Cache';
const CACHE_STORE_NAME = 'cacheStore';
const CACHE_DB_VERSION = 1;

const CACHE_TIMESTAMP_NAME = 'ROpdebee_Last_Cache_Prune_Check';
const CACHE_CHECK_INTERVAL = 24 * 60 * 60 * 1000;   // Daily
const CACHE_STALE_TIME = 14 * 24 * 60 * 60 * 1000;  // 2 weeks

function async_memoised(fn, keyFn) {
    // Wrap the given asynchronous function into a memoised one
    // keyFn extracts the cache key from the arguments, it is given the arguments
    // as the actual call.

    // Maps the keys to the promise of the first call
    let cache = new Map();

    function wrapper(...args) {
        let key = keyFn(...args);
        if (cache.has(key)) {
            _debug(`Using pre-existing promise for ${key}`);
            return cache.get(key);
        }

        _debug(`Creating new promise for ${key}`);
        let promise = fn(...args);
        cache.set(key, promise);
        return promise;
    }

    return wrapper;
}

// Thanks to https://stackoverflow.com/a/20732091
function humanFileSize(size) {
    let i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

class CacheMgr {
    constructor() {
        // Promise that is resolved when a DB is successfully opened, and
        // rejected when a DB cannot be opened or isn't available.
        this.dbProm = new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                _log('Not using cache, IndexedDB not supported?');
                reject();
            }

            // Try to open a DB, if it fails, just don't use the cache
            let dbReq = window.indexedDB.open(CACHE_DB_NAME, CACHE_DB_VERSION);
            dbReq.onsuccess = ((evt) => {
                _debug('Successfully opened indexed DB');
                resolve(evt.target.result);
            });
            dbReq.onupgradeneeded = ((evt) => {
                _log('Creating indexed DB object store');
                let store = evt.target.result
                    .createObjectStore(CACHE_STORE_NAME, { keyPath: 'url' });
                // Index to quickly remove stale entries.
                store.createIndex('added_datetime', 'added_datetime');
                resolve(evt.target.result);
            });
            dbReq.onerror = ((evt) => {
                _log(`Failed to open indexedDB: ${evt.target.errorCode}`);
                reject();
            });
        });

        this.dbProm.then(this.maybePruneCache.bind(this));
    }

    maybePruneCache(db) {
        const lastCheck = parseInt(window.localStorage.getItem(CACHE_TIMESTAMP_NAME)) || 0;
        const timeElapsed = Date.now() - lastCheck;
        if (lastCheck && timeElapsed < CACHE_CHECK_INTERVAL) {
            _debug(`Last checked at ${new Date(lastCheck)}, not pruning cache`);
            return;
        }

        _log('Pruning stale entries from cache');
        let idx = db
            .transaction(CACHE_STORE_NAME, 'readwrite')
            .objectStore(CACHE_STORE_NAME)
            .index('added_datetime');
        let range = IDBKeyRange.upperBound(Date.now() - CACHE_STALE_TIME);
        idx.openCursor(range).onsuccess = function (evt) {
            let cursor = evt.target.result;
            if (cursor) {
                _debug(`Removing ${cursor.value.url} (added at ${new Date(cursor.value.added_datetime)})`);
                cursor.delete();
                cursor.continue();
            } else {
                // Done
                _debug('Done pruning stale entries');
                window.localStorage.setItem(CACHE_TIMESTAMP_NAME, Date.now());
            }
        }
    }

    loadFromCache(imgUrl) {
        return this.dbProm
            // If the DB was successfully loaded, use it to get the cache.
            .then((db) => new Promise((resolve, reject) => {
                let t = db.transaction(CACHE_STORE_NAME)
                    .objectStore(CACHE_STORE_NAME)
                    .get(imgUrl)
                t.onsuccess = ((evt) => {
                    let res = evt.target.result;
                    if (res) {
                        _debug(`${imgUrl}: Cache hit`);
                        resolve(res);
                    } else {
                        _debug(`${imgUrl}: Cache miss`);
                        reject(null);
                    }
                });
                t.onerror = ((evt) => {
                    _log(`Failed to load ${imgUrl} from cache: ${evt.target.error}`);
                    reject(evt.target.error);
                });
            }));
    }

    storeInCache(imgUrl, width, height, size, format) {
        return this.dbProm.then((db) => {
            let obj = {url: imgUrl, width: width, height: height, size: size, format: format, added_datetime: Date.now()};
            let t = db.transaction(CACHE_STORE_NAME, 'readwrite')
                .objectStore(CACHE_STORE_NAME)
                .put(obj)
            t.onerror = ((evt) => {
                _log(`Failed to store ${imgUrl} into cache: ${evt.target.error}`)
            });
            t.onsuccess = ((evt) => {
                _debug(`${imgUrl} successfully stored in cache.`);
            });

            return obj;
        });
    }
}

const cacheMgr = new CacheMgr();

function actuallyLoadImageDimensions(imgUrl) {
    _log(`Getting image dimensions for ${imgUrl}`);
    return new Promise((resolve, reject) => {
        // Create dummy element to contain the image, from which we retrieve the natural width and height.
        var img = document.createElement('img');
        img.src = imgUrl;

        let done = false;
        // Poll continuously until we can retrieve the height/width of the element
        // Ideally, this is before the image is fully loaded.
        var poll = setInterval(function () {
            if (img.naturalWidth) {
                clearInterval(poll);
                let [w, h] = [img.naturalWidth, img.naturalHeight];
                img.src = '';
                done = true;
                resolve([w, h]);
            }
        }, 50);

        img.addEventListener('load', () => {
            clearInterval(poll);
            // If loaded but not yet done, fire the callback. Otherwise the interval is cleared
            // and no results are sent to the CB.
            if (!done) {
                done = true;
                resolve([img.naturalWidth, img.naturalHeight]);
            }
        });

        img.addEventListener('error', (evt) => {
            clearInterval(poll);
            if (!done) {
                done = true;
                reject(evt.target.error);
            }
        });
    });
}

async function _fetchIAMetadata(itemId) {
    let resp = await fetch(`https://archive.org/metadata/${itemId}/files`);
    let metadata = await resp.json();
    return metadata;
}
// Use memoised fetch so that a single page can reuse the same metadata.
// Don't cache metadata across page loads, as it might change.
const fetchIAMetadata = async_memoised(_fetchIAMetadata, (itemId) => itemId);

async function loadImageFileMeta(imgUrl) {
    let urlObj = new URL(imgUrl);
    if (urlObj.hostname !== 'archive.org') {
        return {};
    }

    let [itemId, imagePath] = urlObj.pathname.split('/').slice(2);

    let metadata = await fetchIAMetadata(itemId);
    if (!metadata) {
        _log(`${imgUrl}: Empty metadata. Darked?`);
        return {};
    }

    let imgMeta = metadata.result.find((meta) => meta.name === imagePath);
    if (!imgMeta) {
        _log(`${imgUrl}: Could not find image in metadata.`);
        return {};
    }

    return imgMeta;
}

function actuallyLoadImageInfo(imgUrl) {
    const loaders = [actuallyLoadImageDimensions, loadImageFileMeta];
    return Promise.allSettled(loaders.map((fn) => fn(imgUrl)))
        .then((results) => {
            let [dimFailed, metaFailed] = results.map((res) => res.status !== 'fulfilled');
            let [dimResult, metaResult] = results;

            if (dimFailed && metaFailed) {
                throw new Error(`${imgUrl}: ${dimResult.reason}, ${metaResult.reason}`);
            }

            let w, h, size;
            if (!dimFailed) {
                [w, h] = dimResult.value;
            } else {
                _log(`${imgUrl}: Failed to load dimensions: ${dimResult.reason}`);
                [w, h] = [0, 0];
            }

            if (!metaFailed) {
                size = parseInt(metaResult.value.size);
                format = metaResult.value.format;
            } else {
                _log(`${imgUrl}: Failed to load metadata: ${metaResult.reason}`);
                size = 0;
                format = '';
            }

            if (dimFailed || metaFailed) {
                // Don't store in cache if either of the two failed, but still
                // return a result
                return {url: imgUrl, width: w, height: h, size: size, format: format};
            }

            return cacheMgr.storeInCache(imgUrl, w, h, size, format);
        });
}

function _loadImageInfo(imgUrl) {
    let urlObj = new URL(imgUrl);
    if (urlObj.hostname === 'coverartarchive.org' && !urlObj.pathname.startsWith('/release-group/')) {
        // Bypass the redirect and go to IA directly. No use hitting CAA with
        // requests, and it's likely we'll get 429s when there are too many
        // images on the page.
        let [mbid, imgPath] = urlObj.pathname.split('/').slice(2);
        imgUrl = `https://archive.org/download/mbid-${mbid}/mbid-${mbid}-${imgPath}`;
    }

    return cacheMgr
        // Try loading from cache first
        .loadFromCache(imgUrl)
        // If we couldn't load it from the cache, actually do the loading
        .catch((err) => actuallyLoadImageInfo(imgUrl));
}
const loadImageInfo = async_memoised(
        _loadImageInfo,
        (url, ...args) => url);

// For compatibility with older scripts. Deprecated.
function loadImageDimensions(imgUrl) {
    return loadImageInfo(imgUrl).then((res) => [res.width, res.height]);
}

function displayInfo(imgElement, infoStr) {
    imgElement.setAttribute('ROpdebee_lazyDimensions', infoStr);

    let dimensionStr;
    if (imgElement.closest('div.thumb-position') || imgElement.classList.contains('uploader-preview-image')) {
        // Shorter for thumbnails
        dimensionStr = infoStr;
    } else {
        dimensionStr = `Dimensions: ${infoStr}`;
    }
    let existing = imgElement.parentNode.querySelector('span.ROpdebee_dimensions');
    if (!existing) {
        existing = document.createElement('span');
        existing.classList.add('ROpdebee_dimensions');
        imgElement.insertAdjacentElement('afterend', existing);
    }
    existing.textContent = dimensionStr;
}

function createInfoString(result) {
    let dimStr, sizeStr;
    if (!result.width || !result.height) {
        dimStr = 'failed :(';
    } else {
        dimStr = `${result.width}x${result.height}`;
    }

    if (!result.size) {
        sizeStr = '??? KB';
    } else {
        sizeStr = humanFileSize(result.size);
    }

    if (result.format) {
        sizeStr += `, ${result.format}`;
    }

    return `${dimStr} (${sizeStr})`;
}

function cbImageInView(imgElement) {
    // Don't load dimensions if it's already loaded/currently being loaded
    if (imgElement.getAttribute('ROpdebee_lazyDimensions')) {
        return;
    }

    // If there's no full size URL, don't attempt to load dimensions
    if (!imgElement.getAttribute('fullSizeURL')) {
        _log('No fullSizeURL on image, not loading');
        return;
    }

    // Placeholder while loading, prevent from loading again.
    displayInfo(imgElement, 'pending…');

    loadImageInfo(imgElement.getAttribute('fullSizeURL'))
        .then((res) => displayInfo(imgElement, createInfoString(res)))
        .catch((err) => {
            _log(err);
            displayInfo(imgElement, 'failed :(')
        });
}

let getDimensionsWhenInView = (function() {
    let options = {
        root: document
    }
    let observer = new IntersectionObserver((entries, observer) => {
        entries
            .filter(e => e.intersectionRatio > 0)
            .forEach(e => cbImageInView(e.target));
    }, options);
    return (elmt) => observer.observe(elmt);
})();

// Expose the function for use in other scripts that may load images.
window.ROpdebee_getDimensionsWhenInView = getDimensionsWhenInView;
window.ROpdebee_loadImageDimensions = loadImageDimensions;
window.ROpdebee_loadImageInfo = loadImageInfo;

function setupStyle() {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'ROpdebee_CAA_Dimensions';
    document.head.appendChild(style);
    // Thumbnails in add/reorder cover art pages
    style.sheet.insertRule(`div.thumb-position {
        height: auto;
        display: flex;
        flex-direction: column;
    }`);
    style.sheet.insertRule(`.image-position {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }`);
    // Put the reorder buttons at the bottom
    style.sheet.insertRule(`div.thumb-position > div:last-of-type::before {
        margin-bottom: auto;
    }`);
    style.sheet.insertRule(`div.thumb-position > div:last-of-type {
        margin-top: auto;
        padding-top: 5px;
    }`);
    // Center the thumbnail img
    style.sheet.insertRule(`div.thumb-position img {
        display: block;
        margin: auto;
    }`);

    style.sheet.insertRule(`span.ROpdebee_dimensions {
        display: block;
    }`);
    style.sheet.insertRule(`div.thumb-position span.ROpdebee_dimensions {
        text-align: center;
        font-size: smaller;
        padding: 0.5em 0;
    }`);

    style.sheet.insertRule(`img.uploader-preview-column > span.ROpdebee_dimensions {
        display: inline;
    }`);
}

function listenForNewCoverArtThumbs() {
    // On add cover art pages
    // Continuously check for images and display their dimensions.
    // TODO: Wouldn't this be much more efficient if we were to use a mutation
    // observer? Now it's just rechecking the same images over and over.
    setInterval(() => {
        document.querySelectorAll('img.uploader-preview-image').forEach((img) => {
            if (img.getAttribute('ROpdebee_lazyDimensions')) return;
            // Too early to get dimensions, src hasn't been set yet
            if (!img.naturalWidth) return;
            // Don't display on PDF images
            if (img.src.endsWith('/static/images/icons/pdf-icon.png')) return;

            // No need to load these through the network here.
            displayInfo(img, `${img.naturalWidth}x${img.naturalHeight}`);
        });
    }, 500);
}

window.addEventListener('load', () => {

    setupStyle();

    // cover art pages
    document.querySelectorAll('#content div.artwork-cont').forEach((div) => {
        const imgElement = div.querySelector('span.cover-art-image > img');
        // Could be absent if the image isn't available in CAA yet.
        if (!imgElement) {
            return;
        }
        const anchor = div.querySelector('p.small > a:last-of-type');
        if (!anchor) return;
        imgElement.setAttribute('fullSizeURL', anchor.href);
        getDimensionsWhenInView(imgElement);
    });

    // edit pages + release page + add/remove/edit/reorder cover art pages
    document.querySelectorAll(
        '.edit-cover-art img, p.artwork img, #sidebar .cover-art-image > img, div.thumb-position > a.artwork-image img'
    ).forEach((img) => {
        const anchor = img.closest('a.artwork-image');
        if (!anchor) return;
        img.setAttribute('fullSizeURL', anchor.href);
        getDimensionsWhenInView(img);
    });

    // add cover art pages, listen for new images
    if (document.querySelector('#add-cover-art')) {
        listenForNewCoverArtThumbs();
    }
});
