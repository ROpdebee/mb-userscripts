// ==UserScript==
// @name         MB: Display CAA image dimensions
// @version      2021.2.11
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
                let [w, h] = [img.naturalWidth, img.naturalHeight];
                done = true;
                resolve([w, h]);
            }
        });

        img.addEventListener('error', () => {
            clearInterval(poll);
            if (!done) {
                done = true;
                reject();
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
        let promise = actuallyLoadImageDimensions(imgUrl);
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
        .catch(() => displayDimensions(imgElement, 'failed :('));
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
