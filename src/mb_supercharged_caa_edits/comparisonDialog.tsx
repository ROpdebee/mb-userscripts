import { logFailure } from '@lib/util/async';
import { createPersistentCheckbox } from '@lib/util/checkboxes';

import { CAAEdit, CAAImage, fixCaaUrl, getDimensionsWhenInView, selectImage } from './CAAEdit';

type ViewModeType = 'sbs' | 'overlay';

class BaseContainer {
    protected readonly titleHeader: HTMLElement;
    public readonly root: HTMLElement;

    protected constructor(title: string, className: string) {
        this.titleHeader = <h3>{title}</h3>;
        this.root = <div className={className} onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)} >
            {this.titleHeader}
        </div>;
    }

    public set title(newTitle: string) {
        this.titleHeader.textContent = newTitle;
    }

    public removeImage(): void {
        // TODO
        1 + 's';
    }

    public setViewMode(viewMode: ViewModeType): void {
        if (viewMode === 'sbs') {
            this.root.classList.remove('ROpdebee_dialogOverlay');
            this.root.classList.add('ROpdebee_dialogSbs');
        } else {
            this.root.classList.add('ROpdebee_dialogOverlay');
            this.root.classList.remove('ROpdebee_dialogSbs');
        }
    }

    protected onMouseEnter(): void {
        // By default, do nothing.
    }

    protected onMouseLeave(): void {
        // By default, do nothing.
    }

    public show(): void {
        this.root.style.display = 'block';
    }

    public hide(): void {
        this.root.style.display = 'none';
    }
}

function convertToDataUrl(img: HTMLImageElement): string {
    const canvas = <canvas /> as HTMLCanvasElement;
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, w, h);

    return canvas.toDataURL();
}

class ImageContainer extends BaseContainer {
    public mouseEnterHandler?: () => void;
    public mouseLeaveHandler?: () => void;

    private displayedImage?: HTMLImageElement;
    private errorSpan?: HTMLSpanElement;
    private typesSpan?: HTMLSpanElement;

    public constructor(title: string) {
        super(title, 'ROpdebee_dialogImage');
    }

    protected override onMouseEnter(): void {
        this.mouseEnterHandler?.();
    }

    protected override onMouseLeave(): void {
        this.mouseLeaveHandler?.();
    }

    private setTypes(types: string[]): void {
        if (!this.typesSpan) {
            this.typesSpan = <span className='ROpdebee_coverTypes' />;
            this.root.append(this.typesSpan);
        }

        this.typesSpan.textContent = `Types: ${types.join(', ')}`;
    }

    private setError(errorMessage: string): void {
        if (this.errorSpan) {
            this.errorSpan.remove();
        }

        this.errorSpan = <span className='error' style={{ display: 'block' }}>{errorMessage}</span>;
        this.root.append(this.errorSpan);
    }

    public setImage(image: CAAImage, useFullSize: boolean): Promise<string> {
        // Remove pre-existing image, if any.
        this.displayedImage?.remove();
        this.errorSpan?.remove();

        this.setTypes(image.types);

        return new Promise((resolve, reject) => {
            // Not setting source yet, source needs to be awaited.
            const img = this.displayedImage = <img
                className='ROpdebee_loading'
                crossOrigin='anonymous'
                onError={(evt): void => {
                    // Make sure we're not handling an error from an image that's no longer displayed.
                    if (evt.target !== this.displayedImage) return;

                    this.setError('Unable to load this image');
                    this.displayedImage.classList.remove('ROpdebee_loading');

                    reject('An image failed to load');
                }}
                onLoad={(evt): void => {
                    // Make sure we're not handling an event from an image that's no longer displayed.
                    if (evt.target !== this.displayedImage) return;
                    this.displayedImage.classList.remove('ROpdebee_loading');
                    resolve(convertToDataUrl(this.displayedImage));
                }}
            /> as HTMLImageElement;
            img.setAttribute('fullSizeURL', fixCaaUrl(image.image));

            // Insert the image before awaiting the source URL, otherwise the dialog
            // won't be of proper size and the UI will be ugly until the URL resolves.
            this.titleHeader.after(img);

            if (useFullSize) {
                img.src = fixCaaUrl(image.image);
            } else {
                selectImage(image, true)
                    .then((srcUrl) => {
                        if (!srcUrl) {
                            img.dispatchEvent(new Event('error'));
                        } else {
                            img.src = srcUrl;
                        }
                    })
                    .catch(() => {
                        img.dispatchEvent(new Event('error'));
                    });
            }

            getDimensionsWhenInView(img);
        });
    }
}

class DiffContainer extends BaseContainer {
    public constructor(title: string) {
        super(title, 'ROpdebee_dialogDiff');
    }
}

// Inspired by https://github.com/metabrainz/musicbrainz-server/blob/a632e0a8a5dd88964107a626f500fbb89ba38734/root/static/scripts/common/artworkViewer.js
const viewModeTexts = {
    sbs: 'Side-by-side mode',
    overlay: 'Overlay mode',
};

interface ArtworkCompareWidget extends ArtworkCompareWidgetPrototype {
    currentViewMode: ViewModeType;
    useFullSize: boolean;
    autoComputeDiff: boolean;

    edit: CAAEdit;

    root: HTMLElement;
    switchViewModeButton: HTMLElement;
    srcContainer: ImageContainer;
    targetContainer: ImageContainer;
    diffContainer: DiffContainer;
    nextButton: HTMLButtonElement;
    prevButton: HTMLButtonElement;

    _super(...args: unknown[]): void;
    uiDialog: JQuery<HTMLElement>;
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
    setImages(): void;
    generateDiff(srcPromise: Promise<string>, targetPromise: Promise<string>): void;
}

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

    _create(): void {
        this._super();

        const savedViewMode = localStorage.getItem('ROpdebee_preferredDialogViewMode');
        this.currentViewMode = (savedViewMode === 'sbs' || savedViewMode === 'overlay') ? savedViewMode : 'sbs';

        this.switchViewModeButton = <button type='button' onClick={this.switchViewMode.bind(this)} />;
        this.nextButton = <button type='button' onClick={this.nextImage.bind(this)}>Next</button> as HTMLButtonElement;
        this.prevButton = <button type='button' onClick={this.prevImage.bind(this)}>Prev</button> as HTMLButtonElement;

        const [useFullSizeCbox, useFullSizeLabel] = createPersistentCheckbox('ROpdebee_useFullSize', 'Always use full-size images', () => {
            this.useFullSize = useFullSizeCbox.checked;
            this.setImages();
        });
        useFullSizeLabel.title = 'Full-size images are by default only loaded if no thumbnails exist. Check this box to always load them.';

        const [autoComputeDiffCbox, autoComputeDiffLabel] = createPersistentCheckbox('ROpdebee_autoComputeDiff', 'Automatically compute diff', () => {
            this.autoComputeDiff = autoComputeDiffCbox.checked;
            // Immediately generate the diff if this checkbox was checked.
            if (this.autoComputeDiff) {
                this.generateDiff();
            }
        });

        this.srcContainer = new ImageContainer('Source');
        this.targetContainer = new ImageContainer('Target');
        this.diffContainer = new DiffContainer('Diff');

        const dialogBody = <div style={{ display: 'flex', position: 'relative' }}>
            {this.srcContainer.root}
            {this.targetContainer.root}
            {this.diffContainer.root}
        </div>;

        const buttonRow = <div className='buttons'>
            {this.switchViewModeButton}
            {this.prevButton}
            {this.nextButton}
        </div>;

        const dialogControls = <div className='artwork-dialog-controls'>
            {useFullSizeCbox}
            {useFullSizeLabel}
            {autoComputeDiffCbox}
            {autoComputeDiffLabel}
            {buttonRow}
        </div>;

        this.element.addClass('artwork-dialog');
        this.element.prepend(dialogBody);
        this.uiDialog.append(dialogControls);

        this.setViewMode();
    },

    // @ts-expect-error: Bad override.
    open(edit: CAAEdit): void {
        this.edit = edit;

        this.prevButton.disabled = edit.otherImages.length === 1;
        this.nextButton.disabled = edit.otherImages.length === 1;

        this.setImages();

        this._super();
    },

    close(event): void {
        this._super(event);

        this.srcContainer.removeImage();
        this.targetContainer.removeImage();
        this.diffContainer.removeImage();
    },

    switchViewMode(): void {
        const newViewMode = this.currentViewMode === 'overlay' ? 'sbs' : 'overlay';
        this.currentViewMode = newViewMode;

        this.setViewMode();
    },

    setViewMode(): void {
        const otherViewMode = this.currentViewMode === 'overlay' ? 'sbs' : 'overlay';
        this.switchViewModeButton.textContent = viewModeTexts[otherViewMode];

        this.srcContainer.setViewMode(this.currentViewMode);
        this.targetContainer.setViewMode(this.currentViewMode);
        this.diffContainer.setViewMode(this.currentViewMode);

        if (this.currentViewMode === 'sbs') {
            this.setSbsView();
        } else {
            this.setOverlayView();
        }

        localStorage.setItem('ROpdebee_preferredDialogViewMode', this.currentViewMode);
    },

    setSbsView(): void {
        this.srcContainer.title = 'Source';

        this.srcContainer.title = 'Source';
        this.srcContainer.show();
        this.targetContainer.show();

        // Remove the mouse handlers
        this.srcContainer.mouseEnterHandler = undefined;
        this.targetContainer.mouseLeaveHandler = undefined;
    },

    setOverlayView: function() {
        this.srcContainer.title = 'Source (hover for target)';

        // In overlay mode, hide the target and switch between source and target on hover.
        // Mouse enter needs to be installed on the source, mouse out on the target,
        // since after the mouse enters, source will be hidden and target shown,
        // so the mouse can only go out of the target.
        this.targetContainer.hide();
        this.srcContainer.mouseEnterHandler = (): void => {
            this.srcContainer.hide();
            this.targetContainer.show();
        };
        this.targetContainer.mouseLeaveHandler = (): void => {
            this.srcContainer.show();
            this.targetContainer.hide();
        };
    },

    nextImage(): void {},
    prevImage(): void {},
    setImages(): void {
        const srcPromise = this.srcContainer.setImage(this.edit.currentImage!, this.useFullSize);
        const targetPromise = this.targetContainer.setImage(this.edit.selectedOtherImage, this.useFullSize);

        this.generateDiff(srcPromise, targetPromise);
    },
    generateDiff(): void {},
};

$.widget('ropdebee.artworkCompare', $.ui.dialog, artworkCompareProto);

export const openComparisonDialog = ((): (edit: CAAEdit) => void => {
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
