import type { ROpdebee_getDimensionsWhenInView } from '@src/mb_caa_dimensions/exports';
import { logFailure } from '@lib/util/async';

import type { CAAEdit, CAAImage} from './CAAEdit';

type ViewModeType = 'sbs' | 'overlay';

export function fixCaaUrl(url: string): string {
    return url.replace(/^http:/, 'https:');
}

export const getDimensionsWhenInView = ((): ROpdebee_getDimensionsWhenInView => {
    const actualFn = window.ROpdebee_getDimensionsWhenInView;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!actualFn) {
        console.log('Will not be able to get dimensions, script not installed?');
        return () => null;
    }

    return actualFn;
})();

async function checkAlive(url: string): Promise<boolean> {
    try {
        const httpResp = await fetch(url, {method: 'HEAD'});
        return httpResp.status >= 200 && httpResp.status < 400;
    } catch {
        // 404 leads to CORS error. GM_xmlHttpRequest would overcome this, but
        // would lead us to be unable to use @grant none, so we wouldn't be
        // able to access the CAA Dimensions handler.
        return false;
    }
}

export async function selectImage(imageData: CAAImage, use1200 = false): Promise<string | null> {
    // Select 1200px thumb, 500px thumb, or full size based on availability
    let candidates = [
        imageData.thumbnails['500'] || imageData.thumbnails['large'],
        imageData.image];
    if (use1200 && imageData.thumbnails['1200']) {
        candidates.unshift(imageData.thumbnails['1200']);
    }
    candidates = candidates.map((url) => fixCaaUrl(url));

    for (const candidate of candidates) {
        if (await checkAlive(candidate)) {
            return candidate;
        }
    }

    return null;
}

const viewModeTexts = {
    sbs: 'Side-by-side mode',
    overlay: 'Overlay mode',
};

// https://forum.freecodecamp.org/t/how-to-make-js-wait-until-dom-is-updated/122067
async function waitUntilRedrawn(): Promise<void> {
    return new Promise((resolve) => {
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
            resolve();
        }));
    });
}

// Inspired by https://github.com/metabrainz/musicbrainz-server/blob/a632e0a8a5dd88964107a626f500fbb89ba38734/root/static/scripts/common/artworkViewer.js
interface ArtworkCompareWidget extends ArtworkCompareWidgetPrototype {
    currentViewMode: ViewModeType;
    edit: CAAEdit;

    $switchViewMode: JQuery<HTMLElement>;
    $source: JQuery<HTMLElement>;
    $target: JQuery<HTMLElement>;
    $diff: JQuery<HTMLElement>;
    $prev: JQuery<HTMLElement>;
    $next: JQuery<HTMLElement>;
    $useFullSize: JQuery<HTMLElement>;
    $autoComputeDiff: JQuery<HTMLElement>;

    sourceDataProm: Promise<string>;
    targetDataProm: Promise<string>;

    triggerDiffGeneration: (() => void) | null;

    _super(...args: unknown[]): void;
    uiDialog: JQuery<HTMLElement>;
    isOpen: boolean;
    overlay: JQuery<HTMLElement>;
}

interface ArtworkCompareWidgetPrototype extends JQueryUI.Dialog {
    _create(): void;

    options: JQueryUI.DialogOptions;

    switchViewMode(): void;
    setViewMode(): void;
    setSbsView(): void;
    setOverlayView(): void;

    nextImage(): void;
    prevImage(): void;
    setSourceImage(): void;
    setTargetImage(): void;
    setDiff(): Promise<void>;
    setImage(container: JQuery<HTMLElement>, image: CAAImage): Promise<string>;
}

// Adapted from https://github.com/metabrainz/musicbrainz-server/blob/a632e0a8a5dd88964107a626f500fbb89ba38734/root/static/scripts/common/artworkViewer.js
const artworkCompareProto: ArtworkCompareWidgetPrototype & ThisType<ArtworkCompareWidget & JQueryUI.WidgetCommonProperties> = {
    options: {
        modal: true,
        resizable: false,
        autoOpen: false,
        width: 'auto',
        show: true,
        closeText: '',
        title: 'Compare images',
    },

    _create() {
        this._super();

        const savedViewMode = localStorage.getItem('ROpdebee_preferredDialogViewMode');
        this.currentViewMode = (savedViewMode === 'sbs' || savedViewMode === 'overlay') ? savedViewMode : 'sbs';

        this.$switchViewMode = $('<button>')
            .attr('type', 'button')
            .on('click', this.switchViewMode.bind(this));

        // prev/next
        this.$prev = $('<button>').attr('type', 'button')
            .text('Previous')
            .on('click', this.prevImage.bind(this));

        this.$next = $('<button>').attr('type', 'button')
            .text('Next')
            .on('click', this.nextImage.bind(this));

        this.$useFullSize = $('<input>').attr('type', 'checkbox')
            .attr('id', 'ROpdebee_useFullSize');
        const $useFullSizeLabel = $('<label>').attr('for', 'ROpdebee_useFullSize')
            .text('Always use full-size images')
            .attr('title', 'Full-size images are by default only loaded if no thumbnails exist. Check this box to always load them.');

        this.$useFullSize.on('change', () => {
            if (this.isOpen) {
                this.setSourceImage();
                this.setTargetImage();
                logFailure(this.setDiff());
            }
        });

        this.$autoComputeDiff = $('<input>').attr('type', 'checkbox')
            .attr('id', 'ROpdebee_autoComputeDiff');
        this.$autoComputeDiff.on('change', () => {
            if (this.$autoComputeDiff.prop('checked') && this.triggerDiffGeneration) {
                this.triggerDiffGeneration();
            }
        });
        const $autoComputeDiffLabel = $('<label>').attr('for', 'ROpdebee_autoComputeDiff')
            .text('Automatically compute diff');

        [this.$useFullSize, this.$autoComputeDiff].forEach(($el) => {
            $el.on('change', () => {
                if ($el.prop('checked')) {
                    localStorage.setItem($el.attr('id')!, 'delete me to disable');
                } else {
                    localStorage.removeItem($el.attr('id')!);
                }
            });

            $el.prop('checked', !!localStorage.getItem($el.attr('id')!));
        });

        const $buttons = $('<div>')
            .addClass('buttons')
            .append(this.$switchViewMode, this.$prev, this.$next);

        this.uiDialog.append(
            $('<div>')
                .addClass('artwork-dialog-controls')
                .append(this.$useFullSize, $useFullSizeLabel, this.$autoComputeDiff, $autoComputeDiffLabel, $buttons));

        this.element.addClass('artwork-dialog');

        const $imgContainer = $('<div>')
            .css('display', 'flex')
            .css('position', 'relative');
        this.$source = $('<div>').addClass('ROpdebee_dialogImage');
        this.$target = $('<div>').addClass('ROpdebee_dialogImage');
        this.$diff = $('<div>').addClass('ROpdebee_dialogDiff');
        this.element.prepend($imgContainer);
        $imgContainer.append(this.$source, this.$target, this.$diff);

        const labels = ['Source', 'Target', 'Diff'];
        // eslint-disable-next-line sonarjs/no-duplicate-string -- TODO.
        this.element.find('.ROpdebee_dialogImage, .ROpdebee_dialogDiff')
            .each((i, e) => void $(e).append($('<h3>').text(labels[i])));

        this.setViewMode();
    },

    // @ts-expect-error: Bad override.
    open(edit: CAAEdit) {
        this.edit = edit;

        this.$prev.prop('disabled', edit.otherImages.length === 1);
        this.$next.prop('disabled', edit.otherImages.length === 1);

        this.setSourceImage();
        this.setTargetImage();
        logFailure(this.setDiff());

        this._super();
    },

    close(event) {
        this._super(event);
        this.element.find('img').remove();
    },

    switchViewMode() {
        const newViewMode = this.currentViewMode === 'overlay' ? 'sbs' : 'overlay';
        this.currentViewMode = newViewMode;

        this.setViewMode();
    },

    setViewMode() {
        const otherViewMode = this.currentViewMode === 'overlay' ? 'sbs' : 'overlay';
        this.$switchViewMode.text(viewModeTexts[otherViewMode]);
        if (this.currentViewMode === 'sbs') {
            this.setSbsView();
        } else {
            this.setOverlayView();
        }

        localStorage.setItem('ROpdebee_preferredDialogViewMode', this.currentViewMode);
    },

    setSbsView() {
        this.uiDialog.find('.ROpdebee_dialogImage, .ROpdebee_dialogDiff')
            .addClass('ROpdebee_dialogSbs')
            .removeClass('ROpdebee_dialogOverlay');

        this.$source.find('h2').text('Source');
        this.$target.show();
        this.$source.show();
        this.$source.off('mouseenter mouseleave');
        this.$target.off('mouseenter mouseleave');
    },

    setOverlayView() {
        this.uiDialog.find('.ROpdebee_dialogImage, .ROpdebee_dialogDiff')
            .removeClass('ROpdebee_dialogSbs')
            .addClass('ROpdebee_dialogOverlay');

        this.$source.find('h3').text('Source (hover for target)');
        this.$target.hide();
        this.$source.on('mouseenter', () => {
            this.$source.toggle();
            this.$target.toggle();
        });
        this.$target.on('mouseleave', () => {
            this.$source.toggle();
            this.$target.toggle();
        });
    },

    setImage(container, image) {
        // Remove pre-existing image, if any.
        container.find('img')
            .off('load')
            .off('error')
            .remove();
        container.find('span.error').remove();
        let $types = container.find('span.ROpdebee_coverTypes');
        if ($types.length === 0) {
            $types = $('<span>').addClass('ROpdebee_coverTypes');
            container.append($types);
        }

        $types.text(`Types: ${image.types.join(', ')}`);

        return new Promise((resolve, reject) => {
            const $img = $<HTMLImageElement>('<img>')
                .addClass('ROpdebee_loading')
                .attr('fullSizeURL', fixCaaUrl(image.image))
                .attr('crossorigin', 'anonymous');

            $img.on('error', () => {
                const errorText = 'Unable to load this image.';
                const $errorMsg = $('<span>')
                    .addClass('error')
                    .css('display', 'block')
                    .text(errorText);
                container.append($errorMsg);
                $img.removeClass('ROpdebee_loading');
                $img.off('error');
                reject('An image failed to load');
            });

            $img.on('load', () => {
                $img.removeClass('ROpdebee_loading');

                const canvas = document.createElement('canvas');
                const w = $img[0].naturalWidth;
                const h = $img[0].naturalHeight;
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage($img[0], 0, 0, w, h);
                resolve(canvas.toDataURL());
            });

            // Insert the image before awaiting the source URL, otherwise the dialog
            // won't be of proper size and the UI will be ugly until the URL resolves.
            container.find('h3').after($img);
            if (this.$useFullSize.prop('checked')) {
                $img.attr('src', fixCaaUrl(image.image));
            } else {
                selectImage(image, true)
                    .then((srcUrl) => {
                        if (!srcUrl) $img.trigger('error');
                        else $img.attr('src', srcUrl);
                    })
                    .catch(() => {
                        $img.trigger('error');
                    });
            }

            getDimensionsWhenInView($img[0]);
        });
    },

    setSourceImage() {
        this.sourceDataProm = this.setImage(this.$source, this.edit.currentImage!);
    },

    setTargetImage() {
        this.targetDataProm = this.setImage(this.$target, this.edit.selectedOtherImage);
    },

    async setDiff() {
        const $diff = this.$diff;
        $diff.find('span.error, span#ROpdebee_click_for_diff').remove();
        $diff.off('click');
        // We could maybe reuse the previous image here, but if the promises resolve
        // after images are changed, it might overwrite the diff. Therefore, we actually
        // remove the old image and insert a new one, so that when the old promise
        // resolves late, it won't change anything on screen.
        $diff.find('img').remove();

        let $similarity = $diff.find('span.ROpdebee_similarity');
        if ($similarity.length === 0) {
            $similarity = $('<span>').addClass('ROpdebee_similarity');
            $diff.append($similarity);
        } else {
            $similarity.text('');
        }

        const $img = $('<img>');
        $diff.find('h3').after($img);

        function setError(msg: string): void {
            const $error = $('<span>')
                .addClass('error')
                .css('display', 'block')
                .text(msg);
            $diff.append($error);
        }

        const waitToGenerateDiff = new Promise<void>((resolve) => this.triggerDiffGeneration = ((): void => {
            this.triggerDiffGeneration = null; // Don't trigger twice
            $img.addClass('ROpdebee_loading');
            $diff.off('click');
            $diff.find('span#ROpdebee_click_for_diff').remove();
            resolve();
        }));

        if (this.$autoComputeDiff.prop('checked')) {
            this.triggerDiffGeneration!();
        } else {
            const $info = $('<span>')
                .attr('id', 'ROpdebee_click_for_diff')
                .text('Click to generate diff');
            $diff.append($info);
            $diff.on('click', (e) => {
                e.preventDefault();
                this.triggerDiffGeneration?.();
            });
        }

        // Do the promises for the data before awaiting the user click, otherwise
        // when an image fails to load, there might not be a handler on the promise
        // yet, leading to an unnecessary error in the console.
        let srcData: string, targetData: string;
        try {
            [srcData, targetData] = await Promise.all([this.sourceDataProm, this.targetDataProm]);
        } catch (err) {
            setError(`Cannot generate diff: ${err}`);
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

        resemble(srcData)
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
        logFailure(this.setDiff());
    },

    nextImage: function () {
        this.edit.nextImage();
        this.setTargetImage();
        logFailure(this.setDiff());
    },

};

$.widget('ropdebee.artworkCompare', $.ui.dialog, artworkCompareProto);

type openComparisonDialogT = (edit: CAAEdit) => void;

export const openComparisonDialog = ((): openComparisonDialogT => {
    let $activeDialog = $();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const viewer = $('<div>').appendTo('body')
        // @ts-expect-error: Incomplete types
        .artworkCompare() as JQuery<HTMLElement>;

    function open(edit: CAAEdit): void {
        // @ts-expect-error: Incomplete types
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        $activeDialog = viewer.artworkCompare('open', edit) as JQuery<HTMLElement>;
    }

    $('body')
        .on('click', '.ui-widget-overlay', (e) => {
            const dialog = $activeDialog.data('ropdebee-artworkCompare') as ArtworkCompareWidget | undefined;
            if (dialog?.overlay[0] === e.currentTarget) {
                // Prevent propagating to MB's jQuery UI, it crashes otherwise.
                e.preventDefault();
                // @ts-expect-error: Bad types?
                dialog!.close!();
            }
        })
        // Prevent MB's own dialog controls from trying to close a non-existent
        // dialog when clicking on the artwork.
        .on('click', '.artwork-dialog img', (e) => {
            e.stopImmediatePropagation();
        })
        .on('keydown', (e) => {
            if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
            const op = e.key === 'ArrowLeft' ? 'prevImage' : 'nextImage';
            // @ts-expect-error: Incomplete types
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if ($activeDialog.artworkCompare('isOpen')) {
                // @ts-expect-error: Incomplete types
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                $activeDialog.artworkCompare(op);
            }
        });

    return open;
})();
