// ==UserScript==
// @name         MB: Display CAA image dimensions
// @version      2021.2.19
// @description  Loads and displays the image dimensions of images in the cover art archive.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_caa_dimensions.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_caa_dimensions.user.js
// @match        *://musicbrainz.org/*
// @match        *://*.musicbrainz.org/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.js
// @run-at       document-end
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

let $ = this.$ = this.jQuery = jQuery.noConflict(true);

const CACHE_DB_NAME = 'ROpdebee_CAA_Dimensions_Cache';
const CACHE_STORE_NAME = 'cacheStore';
const CACHE_DB_VERSION = 1;

const CACHE_TIMESTAMP_NAME = 'ROpdebee_Last_Cache_Prune_Check';
const CACHE_CHECK_INTERVAL = 24 * 60 * 60 * 1000;   // Daily
const CACHE_STALE_TIME = 14 * 24 * 60 * 60 * 1000;  // 2 weeks

function maybePruneCache(db) {
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
            });
            dbReq.onerror = ((evt) => {
                _log(`Failed to open indexedDB: ${evt.target.errorCode}`);
                reject();
            });
        });

        this.dbProm.then(maybePruneCache);
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
                        resolve([res.width, res.height]);
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

    storeInCache(imgUrl, width, height) {
        this.dbProm.then((db) => {
            let obj = {url: imgUrl, width: width, height: height, added_datetime: Date.now()};
            let t = db.transaction(CACHE_STORE_NAME, 'readwrite')
                .objectStore(CACHE_STORE_NAME)
                .put(obj)
            t.onerror = ((evt) => {
                _log(`Failed to store ${imgUrl} into cache: ${evt.target.error}`)
            });
            t.onsuccess = ((evt) => {
                _debug(`${imgUrl} successfully stored in cache.`);
            })
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
                cacheMgr.storeInCache(imgUrl, w, h);
                resolve([w, h]);
            }
        }, 50);

        img.addEventListener('load', () => {
            clearInterval(poll);
            // If loaded but not yet done, fire the callback. Otherwise the interval is cleared
            // and no results are sent to the CB.
            if (!done) {
                let [w, h] = [img.naturalWidth, img.naturalHeight];
                done = true;
                cacheMgr.storeInCache(imgUrl, w, h);
                resolve([w, h]);
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

let loadImageDimensions = (function() {
    // Maps URLs to the promise that loads the image dimensions if it exists.
    let windowCache = new Map();
    function loadImageDimensions(imgUrl) {
        if (windowCache.has(imgUrl)) {
            _debug(`Using pre-existing promise for ${imgUrl}`);
            return windowCache.get(imgUrl);
        }

        _debug(`Creating new promise for ${imgUrl}`);
        let promise = cacheMgr
            // Try loading from cache first
            .loadFromCache(imgUrl)
            // If we couldn't load it from the cache, actually do the loading
            .catch((err) => actuallyLoadImageDimensions(imgUrl));
        windowCache.set(imgUrl, promise);
        return promise;
    }

    return loadImageDimensions;
})();

function displayDimensions(imgElement, dims) {
    imgElement.setAttribute('ROpdebee_lazyDimensions', 'pending...');

    let dimensionStr = `Dimensions: ${dims}`;
    let existing = $(imgElement).parent().find('span#dimensions');
    if (existing.length) {
        existing[0].innerText = dimensionStr;
    } else {
        $(imgElement).after(`<br/><span id="dimensions">${dimensionStr}</span>`);
    }
}

function cbImageInView(imgElement) {
    // Don't load dimensions if it's already loaded/currently being loaded
    if (imgElement.getAttribute('ROpdebee_lazyDimensions')) {
        return;
    }

    // Placeholder while loading, prevent from loading again.
    displayDimensions(imgElement, 'pending...');

    loadImageDimensions(imgElement.getAttribute('fullSizeURL'))
        .then(([w, h]) => displayDimensions(imgElement, `${w}x${h}`))
        .catch((err) => {
            _log(err);
            displayDimensions(imgElement, 'failed :(')
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

$(document).ready(() => {
    // Expose the function for use in other scripts that may load images.
    window.ROpdebee_getDimensionsWhenInView = getDimensionsWhenInView;

    // cover art pages
    $('#content div.artwork-cont').each((i, div) => {
        let imgElement = $(div).find('span.cover-art-image > img')[0];
        // Could be absent if the image isn't available in CAA yet.
        if (!imgElement) {
            return;
        }
        let anchor = $(div).find('p.small > a:last')[0];
        imgElement.setAttribute('fullSizeURL', anchor.href);
        getDimensionsWhenInView(imgElement);
    });

    // edit pages
    $('td.edit-cover-art img').each((i, img) => {
        img.setAttribute('fullSizeURL', img.closest('a.artwork-image').href);
        getDimensionsWhenInView(img);
    });

    // release page
    $('#sidebar .cover-art-image > img').each((i, img) => {
        img.setAttribute('fullSizeURL', img.closest('a.artwork-image').href);
        getDimensionsWhenInView(img);
    });
});
