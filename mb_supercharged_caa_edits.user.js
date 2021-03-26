// ==UserScript==
// @name         MB: Supercharged Cover Art Edits
// @version      2021.3.23
// @description  Supercharges reviewing cover art edits. Displays release information on CAA edits. Enables image comparisons on removed and added images.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_supercharged_caa_edits.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_supercharged_caa_edits.user.js
// @match        *://musicbrainz.org/*
// @match        *://*.musicbrainz.org/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://github.com/rsmbl/Resemble.js/raw/v3.2.4/resemble.js
// @run-at       document-end
// ==/UserScript==

let $ = this.$ = this.jQuery = jQuery.noConflict(true);
resemble.outputSettings({
    errorColor: {red: 0, green: 0, blue: 0},
    errorType: 'movementDifferenceIntensity',
    transparency: .25,
})

const ID_RGX = /release\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\/(\d+)\.\w+/;

const DEFAULT_TRIES = 5;

const LOADING_GIF = 'data:image/gif;base64,R0lGODlhEAAQAPMPALu7u5mZmTMzM93d3REREQAAAHd3d1VVVWZmZqqqqoiIiO7u7kRERCIiIgARAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFBwAPACwAAAAAEAAQAEAEcPDJtyg6dUrFetDTIopMoSyFcxxD1krD8AwCkASDIlPaUDQLR6G1Cy0SgqIkE1IQGMrFAKCcGWSBzwPAnAwarcKQ15MpTMJYd1ZyUDXSDGelBY0qIoBh/ZoYGgELCjoxCRRvIQcGD1kzgSAgAACQDxEAIfkEBQcADwAsAAAAAA8AEAAABF3wyfkMkotOJpscRKJJwtI4Q1MAoxQ0RFBw0xEvhGAVRZZJh4JgMAEQW7TWI4EwGFjKR+CAQECjn8DoN0kwDtvBT8FILAKJgfoo1iAGAPNVY9DGJXNMIHN/HJVqIxEAIfkEBQcADwAsAAAAABAADwAABFrwyfmColgiydpaQiY5x9Ith7hURdIl0wBIhpCAjKIIxaAUPQ0hFQsAC7MJALFSFi4SgC4wyHyuCYNWxH3AuhSEotkNGAALAPqqkigG8MWAjAnM4A8594vPUyIAIfkEBQcADwAsAAAAABAAEAAABF3wySkDvdKsddg+APYIWrcg2DIRQAcU6DJICjIsjBEETLEEBYLqYSDdJoCGiHgZwG4LQCCRECEIBAdoF5hdEIWwgBJqDs7DgcKyRHZl3uUwuhm2AbNNW+LV7yd+FxEAIfkEBQcACAAsAAAAABAADgAABEYQyYmMoVgeWQrP3NYhBCgZBdAFRUkdBIAUguVVo1ZsWFcEGB5GMBkEjiCBL2a5ZAi+m2SAURExwKqPiuCafBkvBSCcmiYRACH5BAUHAA4ALAAAAAAQABAAAARs0MnpAKDYrbSWMp0xZIvBKYrXjNmADOhAKBiQDF5gGcICNAyJTwFYTBaDQ0HAkgwSmAUj0OkMrkZM4HBgKK7YTKDRICAo2clAEIheKc9CISjEVTuEQrJASGcSBQcSUFEUDQUXJBgDBW0Zj34RACH5BAUHAA8ALAAAAAAQABAAAARf8Mn5xqBYgrVC4EEmBcOSfAEjSopJMglmcQlgBYjE5NJgZwjCAbO4YBAJjpIjSiAQh5ayyRAIDKvJIbnIagoFRFdkQDQKC0RBsCIUFAWsT7RwG410R8HiiK0WBwJjFBEAIfkEBQcADgAsAQABAA8ADwAABFrQybEWADXJLUHHAMJxIDAgnrOo2+AOibEMh1LN62gIxphzitRoCDAYNcNN6FBLShao4WzwHDQKvVGhoFAwGgtFgQHENhoB7nCwHRAIC0EyUcC8Zw1ha3NIRgAAIfkEBQcADwAsAAAAABAAEAAABGDwyfnWoljaNYYFV+Zx3hCEGEcuypBtMJBISpClAWLfWODymIFiCJwMDMiZBNAAYFqUAaNQ2E0YBIXGURAMCo1AAsFYBBoIScBJEwgSVcmP0li4FwcHz+FpCCQMPCFINxEAIfkEBQcADgAsAAABABAADwAABFzQyemWXYNqaSXY2vVtw3UNmROM4JQowKKlFOsgRI6ASQ8IhSADFAjAMIMAgSYJtByxyQIhcEoaBcSiwegpDgvAwSBJ0AIHBoCQqIAEi/TCIAABGhLG8MbcKBQgEQAh+QQFBwAPACwAAAEAEAAPAAAEXfDJSd+qeK5RB8fDRRWFspyotAAfQBbfNLCVUSSdKDV89gDAwcFBIBgywMRnkWBgcJUDKSZRIKAPQcGwYByAAYTEEJAAJIGbATEQ+B4ExmK9CDhBd8ThdHw/AmUYEQAh+QQFBwAPACwAAAEADwAPAAAEXvBJQIa8+ILSspdHkXxS9wxF4Q3L2aTBeC0sFjhAtuyLIjAMhYc2GBgaSKGuyNoBDp7czFAgeBIKwC6kWCAMxUSAFjtNCAAFGGF5tCQLAaJnWCTqHoREvQuQJAkyGBEAOw=='

const STATUSES = {
    1: 'Official',
    2: 'Promotion',
    3: 'Bootleg',
    4: 'Pseudo-Release',
}

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
}

getDimensionsWhenInView = (() => {
    actualFn = window.ROpdebee_getDimensionsWhenInView;

    if (!actualFn) {
        console.log('Will not be able to get dimensions, script not installed?');
        return () => null;
    }

    return actualFn;
})();

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    let resp = await fetchWithRetry(`${window.location.origin}/ws/js/entity/${mbid}`);
    return resp.json();
}

function fixCaaUrl(url) {
    // Remove the http: protocol and just use // to inherit the protocol
    return url.replace(/^http:/, '');
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

    this.currentViewMode = 'sbs';
    this.viewModeTexts = {
        sbs: 'Side-by-side mode',
        overlay: 'Overlay mode',
    };
    this.useFullSizeImages = false;

    this.$switchViewMode = $('<button>')
        .attr('type', 'button')
        .text(this.viewModeTexts['overlay'])
        .click(this.switchViewMode.bind(this));

    // prev/next
    this.$prev = $('<button>').attr('type', 'button')
        .text('Previous')
        .click(this.prevImage.bind(this));

    this.$next = $('<button>').attr('type', 'button')
        .text('Next')
        .click(this.nextImage.bind(this));

    this.$useFullSize = $('<input>').attr('type', 'checkbox')
        .attr('id', 'ROpdebee_useFullSize')
        .attr('checked', false);
    let $useFullSizeLabel = $('<label>').attr('for', 'ROpdebee_useFullSize')
        .text('Use full-size images');

    this.$useFullSize.on('change', () => {
        this.useFullSize = this.$useFullSize.prop('checked');
        if (this.isOpen) {
            this.setSourceImage();
            this.setTargetImage();
            this.setDiff();
        }
    });

    let $buttons = $('<div>').addClass('buttons').append(this.$switchViewMode, this.$prev, this.$next);

    this.uiDialog.append(
        $('<div>').addClass('artwork-dialog-controls').append(this.$useFullSize, $useFullSizeLabel, $buttons));

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

    this.setSbsView();
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
    this.$switchViewMode.text(this.viewModeTexts[this.currentViewMode]);
    this.currentViewMode = newViewMode;

    if (newViewMode === 'sbs') {
        this.setSbsView();
    } else {
        this.setOverlayView();
    }
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

    return new Promise((resolve, reject) => {
        let $img = $('<img>')
            .addClass('ROpdebee_loading')
            .attr('fullSizeURL', fixCaaUrl(image.image))
            .attr('crossorigin', 'anonymous');

        $img.on('error', (e) => {
            // Retry with a 500 thumb
            if (!this.useFullSize && e.currentTarget.src.endsWith(fixCaaUrl(image.thumbnails['1200']))) {
                e.currentTarget.src = fixCaaUrl(image.thumbnails['500']);
            } else {
                $img.remove();
                let errorText = 'Unable to load this image.';
                if (!this.useFullSize) {
                    errorText += ' Maybe try with full-size images?';
                }
                let $errorMsg = $('<span>').addClass('error').text(errorText);
                container.prepend($errorMsg)
                $img.off('error');
                reject('An image failed to load');
            }
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

        // First try with a 1200px thumb, we'll retry with 500px if it fails
        $img.attr('src', fixCaaUrl(this.useFullSize ? image.image : image.thumbnails['1200']));
        container.find('h3').after($img);
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
    $diff.find('span.error').remove();
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

    let $img = $('<img>').addClass('ROpdebee_loading');
    $diff.find('h3').after($img);

    function setError(msg) {
        let $error = $('<span>').addClass('error').text(msg);
        $diff.append($error);
    }

    let srcData, targetData;
    try {
        [srcData, targetData] = await Promise.all([this.sourceDataProm, this.targetDataProm]);
    } catch (e) {
        setError(`Cannot generate diff: ${e}`);
        return;
    }

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

openComparisonDialog = (() => {
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
        // Prevent MB's own dialog controls from trying to close a non-existant
        // dialog when clicking on the artwork.
        .on('click', '.artwork-dialog img', (e) => e.preventDefault())
        .on('keydown', (e) => {
            if (![37, 39].includes(e.keyCode)) return;
            let op = e.keyCode === 37 ? 'prevImage' : 'nextImage';
            if ($activeDialog.artworkCompare('isOpen')) {
                $activeDialog.artworkCompare(op);
            }
        });

    return open;
})();

class CAAEdit {
    constructor($edit, releaseDetails, otherImages, currentImage) {
        this.$edit = $edit;
        this.releaseDetails = releaseDetails;
        this.otherImages = otherImages;
        this._selectedIdx = 0;
        this.currentImage = currentImage;
        this.insertReleaseInfo();
        this.insertComparisonImages();
    }

    insertReleaseInfo() {
        let packaging = PACKAGING_TYPES[this.releaseDetails.packagingID] || 'unknown';
        let status = STATUSES[this.releaseDetails.statusID] || 'unknown';

        let detailsStr = `Status: ${status}, Packaging: ${packaging}, Format: ${this.releaseDetails.combined_format_name}`;

        this.$edit
            .find('.edit-details tr, .details tr')
            .first()
            .after(`<tr><th>Release details:</th><td>${detailsStr}</td></tr>`);
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
        this.$types = $('<span>');

        if (this.otherImages.length > 1) {
            this.$next = $('<button>')
                .attr('type', 'button')
                .text('Next')
                .click(this.nextImage.bind(this));
            this.$prev = $('<button>')
                .attr('type', 'button')
                .text('Previous')
                .click(this.prevImage.bind(this));

            $td.append(this.$a, this.$prev, this.$next, this.$compare, this.$types);
        } else {
            $td.append(this.$a, this.$compare, this.$types);
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

    setImage() {
        let selectedImg = this.otherImages[this.selectedIdx];
        let thumbUrl = fixCaaUrl(selectedImg.thumbnails.large);
        let fullSizeUrl = fixCaaUrl(selectedImg.image);

        this.$a.attr('href', fullSizeUrl);

        // Remove previous element, if any
        // We remove and add rather than just modify in place, because modifying
        // in place doesn't trigger the intersection observer
        this.$edit.find('.ROpdebee_comparisonImage img').remove();

        let $img = $('<img>')
            .attr('fullSizeURL', fullSizeUrl)
            .attr('src', thumbUrl)
            .addClass('ROpdebee_loading');
        $img.on('load', $img.removeClass.bind($img, 'ROpdebee_loading'));
        this.$a.prepend($img);
        this.$types.text(`Types: ${selectedImg.types.join(', ')}`);

        getDimensionsWhenInView($img[0]);
    }

    openComparisonDialog() {
        alert('Would open');
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

    let [mbid, imageId] = $edit.find('a.artwork-image').attr('href').match(ID_RGX).slice(1);
    let releaseDetails = await getReleaseDetails(mbid);
    let gid = releaseDetails.id;
    let allImages = await getAllImages(mbid);
    let pendingRemovals = await getPendingRemovals(gid);
    let retainedImages = allImages.filter(img => !pendingRemovals.has(img.id) || img.id === imageId);
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
    /*style.sheet.insertRule(`.ROpdebee_dialogImage.ROpdebee_dialogOverlay:nth-of-type(2) {
        position: absolute;
    }`);*/

}

function main() {
    setupStyle();

    $('.open.remove-cover-art').parent().each((i, e) => processEditWhenInView(e));
}

main();
