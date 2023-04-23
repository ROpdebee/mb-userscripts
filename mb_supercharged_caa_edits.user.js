// ==UserScript==
// @name         MB: Supercharged Cover Art Edits
// @version      2022.10.2
// @description  Supercharges reviewing cover art edits. Displays release information on CAA edits. Enables image comparisons on removed and added images.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_supercharged_caa_edits.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_supercharged_caa_edits.user.js
// @match        *://*.musicbrainz.org/*
// @exclude-match *://*.musicbrainz.org/dialog*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://github.com/rsmbl/Resemble.js/raw/v3.2.4/resemble.js
// @require      https://momentjs.com/downloads/moment-with-locales.min.js
// @run-at       document-end
// @grant        none
// ==/UserScript==

let $ = this.$ = this.jQuery = jQuery.noConflict(true);
resemble.outputSettings({
    errorColor: {red: 0, green: 0, blue: 0},
    errorType: 'movementDifferenceIntensity',
    transparency: .25,
});

const ID_RGX = /release\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\/(\d+)\.\w+/;

const DEFAULT_TRIES = 5;

const LOADING_GIF = 'data:image/gif;base64,R0lGODlhEAAQAPMPALu7u5mZmTMzM93d3REREQAAAHd3d1VVVWZmZqqqqoiIiO7u7kRERCIiIgARAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFBwAPACwAAAAAEAAQAEAEcPDJtyg6dUrFetDTIopMoSyFcxxD1krD8AwCkASDIlPaUDQLR6G1Cy0SgqIkE1IQGMrFAKCcGWSBzwPAnAwarcKQ15MpTMJYd1ZyUDXSDGelBY0qIoBh/ZoYGgELCjoxCRRvIQcGD1kzgSAgAACQDxEAIfkEBQcADwAsAAAAAA8AEAAABF3wyfkMkotOJpscRKJJwtI4Q1MAoxQ0RFBw0xEvhGAVRZZJh4JgMAEQW7TWI4EwGFjKR+CAQECjn8DoN0kwDtvBT8FILAKJgfoo1iAGAPNVY9DGJXNMIHN/HJVqIxEAIfkEBQcADwAsAAAAABAADwAABFrwyfmColgiydpaQiY5x9Ith7hURdIl0wBIhpCAjKIIxaAUPQ0hFQsAC7MJALFSFi4SgC4wyHyuCYNWxH3AuhSEotkNGAALAPqqkigG8MWAjAnM4A8594vPUyIAIfkEBQcADwAsAAAAABAAEAAABF3wySkDvdKsddg+APYIWrcg2DIRQAcU6DJICjIsjBEETLEEBYLqYSDdJoCGiHgZwG4LQCCRECEIBAdoF5hdEIWwgBJqDs7DgcKyRHZl3uUwuhm2AbNNW+LV7yd+FxEAIfkEBQcACAAsAAAAABAADgAABEYQyYmMoVgeWQrP3NYhBCgZBdAFRUkdBIAUguVVo1ZsWFcEGB5GMBkEjiCBL2a5ZAi+m2SAURExwKqPiuCafBkvBSCcmiYRACH5BAUHAA4ALAAAAAAQABAAAARs0MnpAKDYrbSWMp0xZIvBKYrXjNmADOhAKBiQDF5gGcICNAyJTwFYTBaDQ0HAkgwSmAUj0OkMrkZM4HBgKK7YTKDRICAo2clAEIheKc9CISjEVTuEQrJASGcSBQcSUFEUDQUXJBgDBW0Zj34RACH5BAUHAA8ALAAAAAAQABAAAARf8Mn5xqBYgrVC4EEmBcOSfAEjSopJMglmcQlgBYjE5NJgZwjCAbO4YBAJjpIjSiAQh5ayyRAIDKvJIbnIagoFRFdkQDQKC0RBsCIUFAWsT7RwG410R8HiiK0WBwJjFBEAIfkEBQcADgAsAQABAA8ADwAABFrQybEWADXJLUHHAMJxIDAgnrOo2+AOibEMh1LN62gIxphzitRoCDAYNcNN6FBLShao4WzwHDQKvVGhoFAwGgtFgQHENhoB7nCwHRAIC0EyUcC8Zw1ha3NIRgAAIfkEBQcADwAsAAAAABAAEAAABGDwyfnWoljaNYYFV+Zx3hCEGEcuypBtMJBISpClAWLfWODymIFiCJwMDMiZBNAAYFqUAaNQ2E0YBIXGURAMCo1AAsFYBBoIScBJEwgSVcmP0li4FwcHz+FpCCQMPCFINxEAIfkEBQcADgAsAAABABAADwAABFzQyemWXYNqaSXY2vVtw3UNmROM4JQowKKlFOsgRI6ASQ8IhSADFAjAMIMAgSYJtByxyQIhcEoaBcSiwegpDgvAwSBJ0AIHBoCQqIAEi/TCIAABGhLG8MbcKBQgEQAh+QQFBwAPACwAAAEAEAAPAAAEXfDJSd+qeK5RB8fDRRWFspyotAAfQBbfNLCVUSSdKDV89gDAwcFBIBgywMRnkWBgcJUDKSZRIKAPQcGwYByAAYTEEJAAJIGbATEQ+B4ExmK9CDhBd8ThdHw/AmUYEQAh+QQFBwAPACwAAAEADwAPAAAEXvBJQIa8+ILSspdHkXxS9wxF4Q3L2aTBeC0sFjhAtuyLIjAMhYc2GBgaSKGuyNoBDp7czFAgeBIKwC6kWCAMxUSAFjtNCAAFGGF5tCQLAaJnWCTqHoREvQuQJAkyGBEAOw=='

const STATUSES = {
    1: 'Official',
    2: 'Promotion',
    3: 'Bootleg',
    4: 'Pseudo-Release',
    5: 'Withdrawn',
    6: 'Cancelled',
};

const PACKAGING_TYPES = {
    1: 'Jewel Case',
    2: 'Slim Jewel Case',
    3: 'Digipak',
    4: 'Cardboard/Paper Sleeve',
    5: 'Other',
    6: 'Keep Case',
    7: 'None',
    8: 'Cassette Case',
    9: 'Book',
    10: 'Fatbox',
    11: 'Snap Case',
    12: 'Gatefold Cover',
    13: 'Discbox Slider',
    16: 'Super Jewel Box',
    17: 'Digibook',
    18: 'Plastic Sleeve',
    19: 'Box',
    20: 'Slidepack',
    21: 'SnapPack',
    54: 'Metal Tin',
    55: 'Longbox',
    56: 'Clamshell Case',
};

const NONSQUARE_PACKAGING_TYPES = [
    3, // Digipak
    6, // Keep case
    8, // Cassette
    9, // Book
    10, // Fatbox
    11, // Snap case
    17, // Digibook
    55, // Longbox
];

const NONSQUARE_PACKAGING_COVER_TYPES = [
    'Front',
    'Back',
];

// Non-exhaustive
const LIKELY_DIGITAL_DIMENSIONS = [
    '640x640',  // Spotify, Tidal (?)
    '1400x1400', // Deezer, iTunes (?)
    '3000x3000', // iTunes, Bandcamp (?)
];

const SHADY_REASONS = {
    releaseDate: 'The release date occurs after the end of the voting period for this edit. The cover art may not be accurate at this time.',
    incorrectDimensions: 'This packaging is typically non-square, but this cover art is square. It likely belongs to another release.',
    nonsquareDigital: 'This is a digital media release with non-square cover art. Although this is possible, it is uncommon.',
    digitalDimensions: 'This is a physical release but the added cover art has dimensions typical of digital store fronts. Care should be taken to ensure the cover matches the actual physical release.',
    digitalNonFront: 'This type of artwork is very uncommon on digital releases, and might not belong here.',
    trackOnPhysical: 'Covers of type “track” should not appear on physical releases.',
    linerOnNonVinyl: 'Covers of type “liner” typically appear on Vinyl releases. Although it can appear on other releases, this is uncommon.',
    noTypesSet: 'This cover has no types set. This is not ideal.',
    obiOutsideJapan: 'Covers of type “obi” typically occur on Japanese releases only. JP is not in the release countries.',
    watermark: 'This cover may contain watermarks, and should ideally be superseded by one without watermarks.',
    pseudoRelease: 'Pseudo-releases typically should not have cover art attached.',
    urlInComment: 'The comment appears to contain a URL. This is often unnecessary clutter.',
};

const MB_FORMAT_TRANSLATIONS = {
    '%A': 'dddd',  // Monday, Tuesday, ...
    '%a': 'ddd',   // mon, tue, ...
    '%B': 'MMMM',  // January, February, ...
    '%b': 'MMM',   // Jan, Feb, ...
    '%d': 'DD',    // 2-digit day
    '%e': 'D',     // 1/2-digit day
    '%m': 'MM',    // 2-digit month
    '%Y': 'YYYY',  // 4-digit year
    '%H': 'HH',    // 00-23 hour
    '%M': 'mm',    // 00-59 minutes
    '%c': 'DD/MM/YYYY, hh:mm:ss a',
    '%x': 'DD/MM/YYYY',
    '%X': 'hh:mm:ss a',
};

// MB and moments' locale for German short month names don't match
moment.updateLocale('de', {
    monthsShort: 'Jan_Feb_Mär_Apr_Mai_Jun_Jul_Aug_Sep_Okt_Nov_Dez'.split('_'),
});

const getDimensionsWhenInView = (() => {
    let actualFn = window.ROpdebee_getDimensionsWhenInView;

    if (!actualFn) {
        console.log('Will not be able to get dimensions, script not installed?');
        return () => null;
    }

    return actualFn;
})();

const loadImageDimensions = (() => {
    let actualFn = window.ROpdebee_loadImageDimensions;

    if (!actualFn) {
        // Don't warn here, if we can't find this function, we likely won't have
        // found the other either
        return () => Promise.reject('Script unavailable');
    }

    return actualFn;
})();

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// https://forum.freecodecamp.org/t/how-to-make-js-wait-until-dom-is-updated/122067
async function waitUntilRedrawn() {
    return new Promise(resolve => {
        window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
    });
}

async function fetchWithRetry(url, options, tries = DEFAULT_TRIES) {
    let lastErr;
    let i = 0;
    while (tries-- > 0) {
        try {
            let resp = await fetch(url, options);
            // Only resolve when we get a 200 OK response, everything else is
            // an error
            if (resp.ok) return resp;

            let e = new Error(`Server responded with ${resp.status}: ${resp.statusText}`);
            e.statusCode = resp.status;
            throw e;
        } catch (e) {
            // Network errors or non-200 status codes. Last error will be used
            // in rejection if tries run out.
            lastErr = e;

            let timeout = Math.random();
            // Exponential backoff if statusCode == 429 or 5xx
            if (e.statusCode == 429 || e.statusCode >= 500) {
                timeout += 2 ** i++;
            }
            await sleep(timeout * 1000);
        }
    }
    throw lastErr;
}

// Do some promise-driven caching to ensure we don't try to load the same index
// multiple times for images from the same release.
const caaCache = new Map();
function getAllImages(mbid) {
    if (!caaCache.has(mbid)) {
        // Should be fine with CORS
        // Specifically not using await here since we need to register this
        // promise in the cache in the same event loop cycle to prevent dupes
        let prom = fetchWithRetry(`https://coverartarchive.org/release/${mbid}/`)
            .then(resp => resp.json())
            .then(json => json.images);
        caaCache.set(mbid, prom);
    }

    return caaCache.get(mbid);
}

// Caching for the same reason as above
const pendingRemovalCache = new Map();
function getPendingRemovals(gid) {
    if (!pendingRemovalCache.has(gid)) {
        pendingRemovalCache.set(gid, _getPendingRemovalsInt(gid));
    }

    return pendingRemovalCache.get(gid);
}

async function _getPendingRemovalsInt(gid) {

    async function getPage(pageNo) {
        const url = `${window.location.origin}/search/edits?conditions.0.field=release&conditions.0.operator=%3D&conditions.0.args.0=${gid}&conditions.1.field=type&conditions.1.operator=%3D&conditions.1.args=315&conditions.2.field=status&conditions.2.operator=%3D&conditions.2.args=1&page=${pageNo}`;
        let resp = await fetchWithRetry(url);
        return resp.text();
    }

    function processPage(pageHtml, resultSet) {
        let parser = new DOMParser();
        let dom = parser.parseFromString(pageHtml, 'text/html');
        [...dom.querySelectorAll('table.details.remove-cover-art code')]
            .map(code => code.innerText)
            .map(filename => filename.split('-'))
            .filter(parts => parts.length == 7)
            .map(parts => parts[6].match(/^(\d+)\.\w+/)[1])
            .forEach(id => resultSet.add(parseInt(id)));
        let nextAnchor = dom.querySelector('ul.pagination li:last-child > a');
        if (!nextAnchor) return;
        return nextAnchor.href.match(/page=(\d+)/)[1];
    }

    let curPageNo = 1;
    let results = new Set();
    while (curPageNo) {
        let pageHtml = await getPage(curPageNo);
        curPageNo = processPage(pageHtml, results);
    }

    return results;
}

async function getReleaseDetails(mbid) {
    let resp = await fetchWithRetry(`${window.location.origin}/ws/js/release/${mbid}`);
    return resp.json();
}

function fixCaaUrl(url) {
    return url.replace(/^http:/, 'https:');
}

async function checkAlive(url) {
    let httpResp;
    try {
        httpResp = await fetch(url, {method: 'HEAD'});
    } catch (e) {
        // 404 leads to CORS error. GM_xmlHttpRequest would overcome this, but
        // would lead us to be unable to use @grant none, so we wouldn't be
        // able to access the CAA Dimensions handler.
        return false;
    }
    return httpResp.status >= 200 && httpResp.status < 400;
}

async function selectImage(imageData, use1200) {
    // Select 1200px thumb, 500px thumb, or full size based on availability
    let candidates = [
        imageData.thumbnails['500'] || imageData.thumbnails['large'],
        imageData.image];
    if (use1200 && imageData.thumbnails['1200']) {
        candidates.unshift(imageData.thumbnails['1200']);
    }
    candidates = candidates.map(fixCaaUrl);

    for (let candidate of candidates) {
        if (await checkAlive(candidate)) {
            return candidate;
        }
    }

    return null;
}

// Adapted from https://github.com/metabrainz/musicbrainz-server/blob/a632e0a8a5dd88964107a626f500fbb89ba38734/root/static/scripts/common/artworkViewer.js
$.widget('ropdebee.artworkCompare', $.ui.dialog, {

  options: {
    modal: true,
    resizable: false,
    autoOpen: false,
    width: 'auto',
    show: true,
    closeText: '',
    title: 'Compare images',
  },

  _create: function() {
    this._super();

    this.currentViewMode = localStorage.getItem('ROpdebee_preferredDialogViewMode') || 'sbs';
    this.viewModeTexts = {
        sbs: 'Side-by-side mode',
        overlay: 'Overlay mode',
    };

    this.$switchViewMode = $('<button>')
        .attr('type', 'button')
        .click(this.switchViewMode.bind(this));

    // prev/next
    this.$prev = $('<button>').attr('type', 'button')
        .text('Previous')
        .click(this.prevImage.bind(this));

    this.$next = $('<button>').attr('type', 'button')
        .text('Next')
        .click(this.nextImage.bind(this));

    this.$useFullSize = $('<input>').attr('type', 'checkbox')
        .attr('id', 'ROpdebee_useFullSize');
    let $useFullSizeLabel = $('<label>').attr('for', 'ROpdebee_useFullSize')
        .text('Always use full-size images')
        .attr('title', 'Full-size images are by default only loaded if no thumbnails exist. Check this box to always load them.');

    this.$useFullSize.on('change', () => {
        if (this.isOpen) {
            this.setSourceImage();
            this.setTargetImage();
            this.setDiff();
        }
    });

    this.$autoComputeDiff = $('<input>').attr('type', 'checkbox')
        .attr('id', 'ROpdebee_autoComputeDiff');
    this.$autoComputeDiff.on('change', () => {
        if (this.$autoComputeDiff.prop('checked') && this.triggerDiffGeneration) {
            this.triggerDiffGeneration();
        }
    });
    let $autoComputeDiffLabel = $('<label>').attr('for', 'ROpdebee_autoComputeDiff')
        .text('Automatically compute diff');

    [this.$useFullSize, this.$autoComputeDiff].forEach($el => {
        $el.on('change', () => {
            if ($el.prop('checked')) {
                localStorage.setItem($el.attr('id'), 'delete me to disable');
            } else {
                localStorage.removeItem($el.attr('id'));
            }
        });

        $el.prop('checked', !!localStorage.getItem($el.attr('id')));
    });

    let $buttons = $('<div>').addClass('buttons').append(this.$switchViewMode, this.$prev, this.$next);

    this.uiDialog.append(
        $('<div>').addClass('artwork-dialog-controls').append(this.$useFullSize, $useFullSizeLabel, this.$autoComputeDiff, $autoComputeDiffLabel, $buttons));

    this.element.addClass('artwork-dialog');

    let $imgContainer = $('<div>').css('display', 'flex').css('position', 'relative');
    this.$source = $('<div>').addClass('ROpdebee_dialogImage');
    this.$target = $('<div>').addClass('ROpdebee_dialogImage');
    this.$diff = $('<div>').addClass('ROpdebee_dialogDiff');
    this.element.prepend($imgContainer);
    $imgContainer.append(this.$source, this.$target, this.$diff);

    let labels = ['Source', 'Target', 'Diff'];
    this.element.find('.ROpdebee_dialogImage, .ROpdebee_dialogDiff')
        .each((i, e) => $(e).append($('<h3>').text(labels[i])));

    this.setViewMode();
  },

  open: function(edit) {
    this.edit = edit;

    this.$prev.prop('disabled', edit.otherImages.length === 1);
    this.$next.prop('disabled', edit.otherImages.length === 1);

    this.setSourceImage();
    this.setTargetImage();
    this.setDiff();

    this._super();
  },

  close: function (event) {
    this._super(event);
    this.element.find('img').remove();
  },

  switchViewMode: function(e) {
    let newViewMode = this.currentViewMode === 'overlay' ? 'sbs' : 'overlay';
    this.currentViewMode = newViewMode;

    this.setViewMode();
  },

  setViewMode: function() {
    let otherViewMode = this.currentViewMode === 'overlay' ? 'sbs' : 'overlay';
    this.$switchViewMode.text(this.viewModeTexts[otherViewMode]);
    if (this.currentViewMode === 'sbs') {
        this.setSbsView();
    } else {
        this.setOverlayView();
    }

    localStorage.setItem('ROpdebee_preferredDialogViewMode', this.currentViewMode);
  },

  setSbsView: function() {
    this.uiDialog.find('.ROpdebee_dialogImage, .ROpdebee_dialogDiff')
        .addClass('ROpdebee_dialogSbs')
        .removeClass('ROpdebee_dialogOverlay');

    this.$source.find('h2').text('Source');
    this.$target.show();
    this.$source.show();
    this.$source.unbind('mouseenter mouseleave');
    this.$target.unbind('mouseenter mouseleave');
  },

  setOverlayView: function() {
    this.uiDialog.find('.ROpdebee_dialogImage, .ROpdebee_dialogDiff')
        .removeClass('ROpdebee_dialogSbs')
        .addClass('ROpdebee_dialogOverlay');

    this.$source.find('h3').text('Source (hover for target)');
    this.$target.hide();
    this.$source.mouseenter(() => {
        this.$source.toggle();
        this.$target.toggle();
    });
    this.$target.mouseleave(() => {
        this.$source.toggle();
        this.$target.toggle();
    });
  },

  setImage: function(container, image) {
    // Remove pre-existing image, if any.
    container.find('img').off('load').off('error').remove();
    container.find('span.error').remove();
    let $types = container.find('span.ROpdebee_coverTypes');
    if (!$types.length) {
        $types = $('<span>').addClass('ROpdebee_coverTypes');
        container.append($types);
    }

    $types.text(`Types: ${image.types.join(', ')}`);

    return new Promise(async (resolve, reject) => {
        let $img = $('<img>')
            .addClass('ROpdebee_loading')
            .attr('fullSizeURL', fixCaaUrl(image.image))
            .attr('crossorigin', 'anonymous');

        $img.on('error', (e) => {
            let errorText = 'Unable to load this image.';
            let $errorMsg = $('<span>').addClass('error')
                .css('display', 'block').text(errorText);
            container.append($errorMsg);
            $img.removeClass('ROpdebee_loading');
            $img.off('error');
            reject('An image failed to load');
        });

        $img.on('load', (e) => {
            $img.removeClass('ROpdebee_loading');

            let canvas = document.createElement('canvas');
            const w = $img[0].naturalWidth;
            const h = $img[0].naturalHeight;
            canvas.width = w;
            canvas.height = h;
            let ctx = canvas.getContext('2d');
            ctx.drawImage($img[0], 0, 0, w, h);
            resolve(canvas.toDataURL());
        });

        // Insert the image before awaiting the source URL, otherwise the dialog
        // won't be of proper size and the UI will be ugly until the URL resolves.
        container.find('h3').after($img);
        if (this.$useFullSize.prop('checked')) {
            $img.attr('src', fixCaaUrl(image.image));
        } else {
            let srcUrl = await selectImage(image, true);
            if (!srcUrl) $img.trigger('error');
            else $img.attr('src', srcUrl);
        }
        getDimensionsWhenInView($img[0]);
    });
  },

  setSourceImage: function() {
    this.sourceDataProm = this.setImage(this.$source, this.edit.currentImage);
  },

  setTargetImage: function() {
    this.targetDataProm = this.setImage(this.$target, this.edit.otherImages[this.edit.selectedIdx]);
  },

  setDiff: async function() {
    const $diff = this.$diff;
    $diff.find('span.error, span#ROpdebee_click_for_diff').remove();
    $diff.off('click');
    // We could maybe reuse the previous image here, but if the promises resolve
    // after images are changed, it might overwrite the diff. Therefore, we actually
    // remove the old image and insert a new one, so that when the old promise
    // resolves late, it won't change anything on screen.
    $diff.find('img').remove();

    let $similarity = $diff.find('span.ROpdebee_similarity');
    if (!$similarity.length) {
        $similarity = $('<span>').addClass('ROpdebee_similarity');
        $diff.append($similarity);
    } else {
        $similarity.text('');
    }

    let $img = $('<img>');
    $diff.find('h3').after($img);

    function setError(msg) {
        let $error = $('<span>').addClass('error')
            .css('display', 'block').text(msg);
        $diff.append($error);
    }

    let waitToGenerateDiff = new Promise(resolve => this.triggerDiffGeneration = (() => {
        this.triggerDiffGeneration = null; // Don't trigger twice
        $img.addClass('ROpdebee_loading');
        $diff.off('click');
        $diff.find('span#ROpdebee_click_for_diff').remove();
        resolve();
    }));

    if (this.$autoComputeDiff.prop('checked')) {
        this.triggerDiffGeneration();
    } else {
        let $info = $('<span>')
            .attr('id', 'ROpdebee_click_for_diff')
            .text('Click to generate diff');
        $diff.append($info);
        $diff.click((e) => {
            e.preventDefault();
            this.triggerDiffGeneration();
        });
    }

    // Do the promises for the data before awaiting the user click, otherwise
    // when an image fails to load, there might not be a handler on the promise
    // yet, leading to an unnecessary error in the console.
    let srcData, targetData;
    try {
        [srcData, targetData] = await Promise.all([this.sourceDataProm, this.targetDataProm]);
    } catch (e) {
        setError(`Cannot generate diff: ${e}`);
        return;
    }

    await waitToGenerateDiff;
    // Wait until the loading GIF is drawn and text is removed.
    // If we don't do this, chances are that the diffing will start before these
    // are actually shown on screen and locks up the browser so that it cannot
    // draw these until it's too late.
    // FIXME: The diffing really should defer once in a while to allow the browser
    // to handle other events, but that requires reimplementing the library
    // (either to defer directly or for it to work in a web worker).
    await waitUntilRedrawn();

    let diff = resemble(srcData)
        .compareTo(targetData)
        .scaleToSameSize()
        .ignoreAntialiasing()
        .onComplete((data) => {
            $img.removeClass('ROpdebee_loading');
            if (data.error) {
                setError(`Encountered an error: ${data.error}`);
                return;
            }
            $img.attr('src', data.getImageDataUrl());
            $similarity
                .text(`Images are ${100 - data.misMatchPercentage}% similar`);
        });
  },

  prevImage: function () {
    this.edit.prevImage();
    this.setTargetImage();
    this.setDiff();
  },

  nextImage: function () {
    this.edit.nextImage();
    this.setTargetImage();
    this.setDiff();
  },

});

const openComparisonDialog = (() => {
    let $activeDialog = $();

    let viewer = $('<div>').appendTo('body')
        .artworkCompare();

    function open(edit) {
        $activeDialog = viewer.artworkCompare('open', edit);
    }

    $('body')
        .on('click', '.ui-widget-overlay', (e) => {
            let dialog = $activeDialog.data('ropdebee-artworkCompare');
            if (dialog && dialog.overlay && dialog.overlay[0] === e.currentTarget) {
                // Prevent propagating to MB's jQuery UI, it crashes otherwise.
                e.preventDefault();
                dialog.close();
            }
        })
        // Prevent MB's own dialog controls from trying to close a non-existent
        // dialog when clicking on the artwork.
        .on('click', '.artwork-dialog img', (e) => e.stopImmediatePropagation())
        .on('keydown', (e) => {
            if (![37, 39].includes(e.keyCode)) return;
            let op = e.keyCode === 37 ? 'prevImage' : 'nextImage';
            if ($activeDialog.artworkCompare('isOpen')) {
                $activeDialog.artworkCompare(op);
            }
        });

    return open;
})();

function stringifyDate(date) {
    let year = date.year ? date.year.toString().padStart(4, '0') : '????';
    let month = date.month ? date.month.toString().padStart(2, '0') : '??';
    let day = date.day ? date.day.toString().padStart(2, '0') : '??';
    return [year, month, day].join('-')
        .replace(/(?:-\?{2}){1,2}$/, ''); // Remove -?? or -??-?? suffix.
        // If neither year, month, or day is set, will return '????'
}

function translateMBDateFormatToMoments(dateFormat) {
    return Object.entries(MB_FORMAT_TRANSLATIONS).reduce((format, [mbToken, momentsToken]) => {
        return format.replace(mbToken, momentsToken);
    }, dateFormat);
}

function processReleaseEvents(events) {
    let dateToCountries = events
        .map(evt =>[(evt.country || {}).primary_code, stringifyDate(evt.date || {})])
        .reduce((acc, evt) => {
            if (!acc.has(evt[1])) {
                acc.set(evt[1], []);
            }
            if (evt[0]) {
                acc.get(evt[1]).push(evt[0]);
            }
            return acc;
        }, new Map());
    let arr = [...dateToCountries.entries()];
    arr.sort((a, b) => {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
    });

    return arr;
}

class CAAEdit {
    constructor($edit, releaseDetails, otherImages, currentImage) {
        this.$edit = $edit;
        this.releaseDetails = releaseDetails;
        this.otherImages = otherImages;
        this._selectedIdx = 0;
        this.currentImage = currentImage;
        this.setTypes();
        this.insertReleaseInfo();
        this.insertComparisonImages();
        this.insertWarnings();
        this.warningMsgs = new Set();
        this.performSanityChecks();
    }

    setTypes() {
        let trs = this.$edit.find('table.details > tbody > tr');
        let typesRow = trs.toArray().find(tr => $(tr).children('th').text() === 'Types:');
        if (!typesRow) {
            this.insertRow('Types:', '<span data-name="artwork-type">(none)</span>');
        } else {
            let td = typesRow.querySelector('td');
            let existingTypes = td.textContent;
            let newSpans = existingTypes.split(', ')
                .map((type) => {
                    const span = document.createElement('span');
                    span.setAttribute('data-name', 'artwork-type');
                    span.textContent = type;
                    return span;
                });
            if (newSpans.length) {
                td.innerHTML = '';
                td.insertAdjacentElement('beforeend', newSpans[0]);
                newSpans.slice(1).map((span) => {
                    td.insertAdjacentText('beforeend', ', ');
                    td.insertAdjacentElement('beforeend', span);
                });
            }
        }
    }

    insertWarnings() {
        let $tr = $('<tr><th>Warnings:</th><td colspan="2"><ul></ul></td></tr>');
        $tr.hide();
        this.$edit
            .find('.edit-details tr, .details tr')
            .last()
            .after($tr);
        this.$warningsUl = $tr.find('ul');
    }

    insertRow(header, rowText) {
        this.$edit
            .find('.edit-details tr, .details tr')
            .first()
            .after(`<tr><th>${header}</th><td>${rowText}</td></tr>`);
    }

    insertReleaseInfo() {
        let packaging = PACKAGING_TYPES[this.releaseDetails.packagingID] || '??';
        let status = STATUSES[this.releaseDetails.statusID] || '??';
        let format = this.releaseDetails.combined_format_name || '[missing media]';
        let events = processReleaseEvents(this.releaseDetails.events || []);
        let barcode = this.releaseDetails.barcode;
        if (barcode == '') barcode = '[none]';
        else if (!barcode) barcode = '??';

        let catnos = new Set((this.releaseDetails.labels || [])
            .map(lbl => lbl.catalogNumber)
            .filter(catno => catno));
        let labels = new Set((this.releaseDetails.labels || [])
            .filter(lbl => lbl.label)
            .map(lbl => [lbl.label.gid, lbl.label.name]));

        let detailsStr = [['Status', status], ['Packaging', packaging], ['Format', format]]
            .map(([title, value]) => `${title}: <span data-name="${title}">${value}</span>`)
            .join('; ');
        let eventsStr = events.reduce((acc, evt) => {
            let countries = (evt[1].length <= 3 && evt[1].length > 0)
                ? evt[1].join(', ')
                : `${evt[1].length} countries`;
            acc.push(`<span data-name="release-date">${evt[0]}</span> (${countries})`);
            return acc;
        }, []).join('; ');
        let labelsStr = [...labels]
            .map(lbl => `<a href="/label/${lbl[0]}">${lbl[1]}</a>`)
            .join(', ');
        let identifiersStr = `Cat#: ${[...catnos].join(', ') || '??'}; Barcode: <span data-name="Barcode">${barcode}</span>`;

        // Opposite order in which it appears, since it always inserts in the
        // second row.
        this.insertRow('Identifiers:', identifiersStr);
        this.insertRow('Labels:', labelsStr);
        this.insertRow('Release events:', eventsStr);
        this.insertRow('Release details:', detailsStr);
    }

    insertComparisonImages() {
        let $td = this.$edit.find('td.ROpdebee_comparisonImage');
        if (this.otherImages.length === 0) {
            let $span = $('<span>').text('No other images found!');
            $td.append($span);
            $td.removeClass('ROpdebee_loading');
            return;
        }

        this.$a = $('<a>')
            .addClass('artwork-image');
        this.$compare = $('<button>')
            .attr('type', 'button')
            .text('Compare')
            .css('float', 'right')
            .click(openComparisonDialog.bind(null, this));
        this.$types = $('<span>').css('display', 'block');

        if (this.otherImages.length > 1) {
            this.$next = $('<button>')
                .attr('type', 'button')
                .text('Next')
                .click(this.nextImage.bind(this));
            this.$prev = $('<button>')
                .attr('type', 'button')
                .text('Previous')
                .click(this.prevImage.bind(this));

            $td.append(this.$a, this.$types, this.$prev, this.$next, this.$compare);
        } else {
            $td.append(this.$a, this.$types, this.$compare);
        }

        $td.removeClass('ROpdebee_loading');

        this.setImage();
    }

    set selectedIdx(newIdx) {
        if (newIdx < 0) newIdx = this.otherImages.length + newIdx;
        newIdx %= this.otherImages.length;
        this._selectedIdx = newIdx;
    }

    get selectedIdx() {
        return this._selectedIdx;
    }

    nextImage() {
        this.selectedIdx += 1;
        this.setImage();
    }

    prevImage() {
        this.selectedIdx -= 1;
        this.setImage();
    }

    async setImage() {
        let selectedImg = this.otherImages[this.selectedIdx];
        let fullSizeUrl = fixCaaUrl(selectedImg.image);

        this.$a.attr('href', fullSizeUrl);

        // Remove previous element, if any
        // We remove and add rather than just modify in place, because modifying
        // in place doesn't trigger the intersection observer
        this.$edit.find('.ROpdebee_comparisonImage img, .ROpdebee_comparisonImage span.error').remove();

        let $img = $('<img>')
            .attr('fullSizeURL', fullSizeUrl)
            .addClass('ROpdebee_loading');
        $img.on('load', $img.removeClass.bind($img, 'ROpdebee_loading'));
        $img.on('error', () => {
            let errorText = 'Unable to load this image.';
            let $errorMsg = $('<span>').addClass('error')
                .css('display', 'block').text(errorText);
            this.$a.prepend($errorMsg);
            $img.off('error');
            $img.removeClass('ROpdebee_loading');
        });
        this.$a.prepend($img);
        this.$types.text(`Types: ${selectedImg.types.join(', ')}`);

        let imgUrl = await selectImage(selectedImg);
        if (!imgUrl) {
            $img.trigger('error');
        } else {
            $img.attr('src', imgUrl);
        }

        getDimensionsWhenInView($img[0]);
    }

    get closeDate() {
        let $expire;
        if (this.$edit.is('#content')) {
            // Edit-specific page
            $expire = this.$edit.next('#sidebar').find('.edit-expiration');
        } else {
            $expire = this.$edit.find('div.edit-description td.edit-expiration');
        }
        let $tooltip = $expire.find('span.tooltip');
        if (!$tooltip.length) {
            // "About to expire"
            return moment();
        }

        let dateStr = $tooltip.attr('title');
        return moment(
            dateStr,
            translateMBDateFormatToMoments(window.__MB__.$c.user.preferences.datetime_format),
            window.__MB__.$c.stash.current_language || 'en');
    }

    get formats() {
        return this.releaseDetails.mediums
            .map(medium => medium.format ? medium.format.name : 'unknown');
    }

    get isDigitalMedia() {
        return this.formats.every(format => format === 'Digital Media');
    }

    get isPhysical() {
        return !this.formats.includes('Digital Media') && !this.formats.includes('unknown');
    }

    get isVinyl() {
        return this.formats.some(format => format.includes('Vinyl'));
    }

    get isUnknownMedium() {
        return this.formats.length === 1 && this.formats[0] === 'unknown';
    }

    get shouldBeNonSquare() {
        return NONSQUARE_PACKAGING_TYPES.includes(this.releaseDetails.packagingID)
            && this.types.some(type => NONSQUARE_PACKAGING_COVER_TYPES.includes(type));
    }

    get types() {
        return this.$edit.find('span[data-name="artwork-type"]').toArray().map(span => span.innerText);
    }

    markShady($els, reason) {
        if (!$els.length) return;

        $els.addClass('ROpdebee_shady');
        $els.each((i, el) => {
            let prevTitle = el.getAttribute('title') || '';
            el.setAttribute('title', [prevTitle, reason].join(' ').trim());
        });

        if (!this.warningMsgs.has(reason)) {
            this.$warningsUl.append(`<li>${reason}</li>`);
            this.$warningsUl.closest('tr').show();
            this.warningMsgs.add(reason);
        }
    }

    // Sanity checks
    performSanityChecks() {
        this.checkReleaseDate();
        this.checkPseudoReleaseCover();
        this.checkTypes();
        this.checkUrlInComment();
        this.checkDimensions();
    }

    checkReleaseDate() {
        if (!this.closeDate.isValid()) {
            this.markShady(
                this.$edit.find('span[data-name="release-date"]'),
                'Cannot determine the closing date of this edit, the release event check will not work. Please report this issue.');
            return;
        }
        let dates = new Set((this.releaseDetails.events || [])
            .map(evt => [evt.date, new Date(evt.date.year, evt.date.month ? evt.date.month - 1 : null, evt.date.day)]));
        let closeDate = this.closeDate;

        let tooLateDates = [...dates]
            .filter(d => d[1] > closeDate)
            .map(d => stringifyDate(d[0]));

        let shadyDates = this.$edit.find('span[data-name="release-date"]')
            .filter((i, el) => tooLateDates.includes(el.innerText));
        this.markShady(shadyDates, SHADY_REASONS.releaseDate);
    }

    checkPseudoReleaseCover() {
        if (this.releaseDetails.statusID === 4) {
            this.markShady(this.$edit.find('span[data-name="Status"]'), SHADY_REASONS.pseudoRelease);
        }
    }

    checkTypes() {
        this.$edit.find('span[data-name="artwork-type"]')
            .each((i, el) => this._checkType($(el)));
    }

    _checkType($typeEl) {
        let type = $typeEl.text();

        // Watermark types
        if (type === 'Watermark') {
            this.markShady($typeEl, SHADY_REASONS.watermark);
        }

        // Unexpected type on digital media
        if (!['Front', 'Track', '-', '(none)'].includes(type) && this.isDigitalMedia) {
            this.markShady($typeEl, SHADY_REASONS.digitalNonFront);
        }

        // No types set
        if (type === '-' || type === '(none)') {
            this.markShady($typeEl, SHADY_REASONS.noTypesSet);
        }

        // Track on physical release
        if (type === 'Track' && this.isPhysical) {
            this.markShady($typeEl, SHADY_REASONS.trackOnPhysical);
        }

        // Liner on non-Vinyl release
        if (type === 'Liner' && !this.isVinyl) {
            this.markShady($typeEl, SHADY_REASONS.linerOnNonVinyl);
        }

        // Obi on non-JP release
        if (type === 'Obi'
            && (this.releaseDetails.events || []).every(evt => !evt.country || evt.country.primary_code !== 'JP')) {
            this.markShady($typeEl, SHADY_REASONS.obiOutsideJapan);
        }
    }

    checkUrlInComment() {
        let trs = this.$edit.find('table.details > tbody > tr');
        let commentRow = trs.toArray().find(tr => $(tr).children('th').text() === 'Comment:');
        let $commentEl = $(commentRow).find('td');
        if ($commentEl.text().includes('://')) {
            this.markShady($commentEl, SHADY_REASONS.urlInComment);
        }
    }

    async checkDimensions() {
        let dimensions;
        try {
            dimensions = await loadImageDimensions(fixCaaUrl(this.currentImage.image));
        } catch(e) {
            return;
        }

        let aspectRatio = dimensions[0] / dimensions[1];
        let isSquare = Math.abs(1 - aspectRatio) < .05;

        if (isSquare && this.shouldBeNonSquare) {
            this.markShady(this.$edit.find('span[data-name="Packaging"]'), SHADY_REASONS.incorrectDimensions);
        }

        if (!isSquare && this.isDigitalMedia) {
            this.markShady(this.$edit.find('span[data-name="Format"]'), SHADY_REASONS.nonsquareDigital);
        }

        let dimStr = `${dimensions[0]}x${dimensions[1]}`;
        if (LIKELY_DIGITAL_DIMENSIONS.includes(dimStr) && !this.isDigitalMedia && !this.isUnknownMedium) {
            this.markShady(this.$edit.find('span.ROpdebee_dimensions, span[data-name="Format"]').first(), SHADY_REASONS.digitalDimensions);
        }
    }
}

function typeMatchScore(t1, t2) {
    let allTypes = new Set();
    t1.forEach(t => allTypes.add(t));
    t2.forEach(t => allTypes.add(t));

    let sharedTypes = t1.filter(t => t2.includes(t));

    return sharedTypes.length / (allTypes.size || 1);
}

function sortRetainedByTypeMatch(imgs, targetTypes) {
    return imgs
        .map(img => [img, typeMatchScore(img.types, targetTypes)])
        .sort((a, b) => b[1] - a[1])
        .map(([img, score]) => img);
}

function insertPlaceholder($edit) {
    let $td = $('<td>')
        .addClass('ROpdebee_comparisonImage edit-cover-art ROpdebee_loading');
    $edit.find('td.edit-cover-art').after($td);
}

let discoveredEdits = new Set();
async function processEdit(edit) {
    let $edit = $(edit);
    let editId;
    try {
        editId = $edit.find('input[name$="edit_id"]').val();
        // Already processed/in progress
        if (discoveredEdits.has(editId)) return;
        discoveredEdits.add(editId);
    } catch (e) {
        console.error('This edit does not have an edit ID? ' + e);
        return;
    }

    insertPlaceholder($edit);

    let [mbid, imageId] = $edit.find('a.artwork-image, a.artwork-pdf').attr('href').match(ID_RGX).slice(1);
    imageId = parseInt(imageId);
    let releaseDetails = await getReleaseDetails(mbid);
    let gid = releaseDetails.id;
    let allImages = await getAllImages(mbid).catch(() => []);
    let retainedImages = allImages.filter(img => img.id !== imageId);
    if ($edit.find('.remove-cover-art').length) {
        let pendingRemovals = await getPendingRemovals(gid).catch(() => []);
        retainedImages = allImages.filter(img => !pendingRemovals.has(img.id) && img.id !== imageId);
    }
    let currImage = allImages.find(img => img.id == imageId);
    let currTypes = currImage ? currImage.types : [];

    // Most likely matches first
    retainedImages = sortRetainedByTypeMatch(retainedImages, currTypes);

    let editInst = new CAAEdit($edit, releaseDetails, retainedImages, currImage);
}

let processEditWhenInView = (function() {
    let options = {
        root: document
    }
    let observer = new IntersectionObserver((entries, observer) => {
        entries
            .filter(e => e.intersectionRatio > 0)
            .forEach(e => processEdit(e.target));
    }, options);
    return (elmt) => observer.observe(elmt);
})();

function setupStyle() {
    // Custom CSS rules
    let style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'ROpdebee_CAA_Edits_Supercharged';
    document.head.appendChild(style);
    // Make sure the replacement image aligns properly with the source
    style.sheet.insertRule('td.edit-cover-art { vertical-align: top; }');
    // Loading placeholder
    style.sheet.insertRule(`.ROpdebee_loading {
        background: transparent url(${LOADING_GIF}) center center no-repeat;
        min-width: 250px;
        min-height: 250px;
    }`);
    // Comparison dialog
    style.sheet.insertRule(`.ROpdebee_dialogDiff, .ROpdebee_dialogSbs {
        float: left;
    }`);
    style.sheet.insertRule(`.ROpdebee_dialogSbs > img, .ROpdebee_dialogOverlay > img {
        margin: 5px;
        object-fit: contain;
        display: block;
    }`);
    style.sheet.insertRule(`.ROpdebee_dialogSbs > img {
        width: 25vw;
        height: 25vw;
    }`);
    style.sheet.insertRule(`.ROpdebee_dialogOverlay > img {
        width: 33vw;
        height: 33vw;
    }`);
    style.sheet.insertRule(`.ROpdebee_shady {
        color: red;
        font-weight: bold;
        border-bottom: 1px dotted;
    }`);

}

function main() {
    setupStyle();

    $('.open.remove-cover-art, .open.add-cover-art').parent().each((i, e) => processEditWhenInView(e));
}

main();
