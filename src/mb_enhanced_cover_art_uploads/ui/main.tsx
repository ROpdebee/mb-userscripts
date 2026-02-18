import type { ConfigProperty } from '@lib/config';
import type { ProgressEvent } from '@lib/util/request';
import type { ImageInfo } from '@src/mb_caa_dimensions/image-info';
import { LOGGER } from '@lib/logging/logger';
import { filterNonNull } from '@lib/util/array';
import { assertDefined } from '@lib/util/assert';
import { insertStylesheet } from '@lib/util/css';
import { parseDOM, qs, qsa } from '@lib/util/dom';
import { formatFileSize } from '@lib/util/format';

import type { App, ProviderHandle } from '../app';
import type { CoverArtDownloaderHooks } from '../images/download';
import { CONFIG } from '../config';

import css from './main.scss';

const INPUT_PLACEHOLDER_TEXT = 'or paste one or more URLs here';

type ProviderButtonHandle = ProviderHandle & { button: HTMLElement };

class ProgressElement {
    private readonly urlSpan: HTMLSpanElement;
    private readonly progressbar: HTMLElement;
    public readonly rootElement: HTMLElement;

    public constructor(url: URL) {
        this.urlSpan = <span>{url.href}</span>;
        // Need to insert a nbsp, otherwise it'll have a height of 0.
        this.progressbar = (
            <div className="ui-progressbar-value ui-widget-header ui-corner-left" style={{ backgroundColor: '#cce5ff', width: '0%' }}>
                &nbsp;
            </div>
        );

        this.rootElement = (
            <tr style={{ display: 'flex' }}>
                <td className="uploader-preview-column">
                    <div className="content-loading" style={{ width: '120px', height: '120px', position: 'relative' }} />
                </td>
                <td style={{ width: '65%' }}>
                    <div className="row">
                        <label>URL:</label>
                        {this.urlSpan}
                    </div>
                </td>
                <td style={{ flexGrow: 1 }}>
                    <div className="ui-progressbar ui-widget ui-widget-content ui-corner-all" role="progressbar" style={{ width: '100%' }}>
                        {this.progressbar}
                    </div>
                </td>
            </tr>
        );
    }

    public set url(url: URL) {
        this.urlSpan.textContent = url.href;
    }

    public set progress(progressPercentage: number) {
        this.progressbar.style.width = `${progressPercentage * 100}%`;
    }
}

function parseHTMLURLs(htmlText: string): string[] {
    LOGGER.debug(`Extracting URLs from ${htmlText}`);
    const document_ = parseDOM(htmlText, document.location.origin);
    // Get URLs from <img> sources
    let urls = qsa<HTMLImageElement>('img', document_).map((image) => image.src);
    // If there are no <img> elements in the pasted content, try getting URLs from <a> elements.
    if (urls.length === 0) {
        urls = qsa<HTMLAnchorElement>('a', document_).map((anchor) => anchor.href);
    }
    if (urls.length === 0) {
        // If there aren't any <img> or <a> elements whatsoever, assume the user
        // copied a list of plain-text URLs that happened to be on a HTML page
        // and parse it as plain text
        return parsePlainURLs(document_.body.textContent);
    }

    // Deduplicate URLs and retain only http:, https:, or data: URLs,
    // i.e. filter out javascript: etc.
    return [...new Set(urls)]
        .filter((url) => /^(?:https?|data):/.test(url));
}

function parsePlainURLs(text: string): string[] {
    return text.trim().split(/\s+/);
}

function createCheckbox(property: ConfigProperty<boolean>): HTMLElement {
    const propertyId = `ROpdebee_ecau_${property.name}`;
    const checkbox = (
        <input
            type="checkbox"
            id={propertyId}
        />
    ) as HTMLElement as HTMLInputElement;

    // The property getter is async, so we need to do some trickery to get the
    // default value. Event listener should be registered AFTERWARDS so that
    // we don't explicitly store the default value.
    property.get().then((value) => {
        checkbox.checked = value;
        checkbox.addEventListener('change', () => {
            property.set(checkbox.checked)
                // eslint-disable-next-line promise/no-nesting -- Not nested.
                .catch((error: unknown) => {
                    LOGGER.error(`Error when saving checkbox value for ${property.name}: ${error}`);
                });
        });
    }).catch((error: unknown) => {
        LOGGER.error(`Error when initialising value for ${property.name} checkbox: ${error}`);
    });

    return (
        <div>
            {checkbox}
            <label htmlFor={propertyId}>
                {property.description}
            </label>
        </div>
    );
}

function createConfig(): HTMLElement {
    return (
        <details className="ROpdebee_ecau_config">
            <summary>Configure…</summary>
            <div className="ROpdebee_ecau_config_options">
                {createCheckbox(CONFIG.fetchFrontOnly)}
                {createCheckbox(CONFIG.skipTrackImagesProperty)}
                {createCheckbox(CONFIG.prefetchMetadata)}
                <h3>Bandcamp</h3>
                {createCheckbox(CONFIG.bandcamp.skipTrackImagesProperty)}
                {createCheckbox(CONFIG.bandcamp.squareCropFirst)}
                <h3>Soundcloud</h3>
                {createCheckbox(CONFIG.soundcloud.skipTrackImagesProperty)}
                <h3>Tidal</h3>
                {createCheckbox(CONFIG.tidal.checkAllCountries)}
                <h3>VGMdb</h3>
                {createCheckbox(CONFIG.vgmdb.keepEntireComment)}
            </div>
        </details>
    );
}

function providerInfoToString(infos: ImageInfo[]): string {
    if (infos.length === 0) {
        return '0 images';
    }

    const fileTypes = new Set(filterNonNull(infos.map((info) => info.fileType)));
    let maxDimensions = { width: 0, height: 0 };
    for (const currentDimension of infos.map((info) => info.dimensions)) {
        if (currentDimension === undefined) continue;
        if (currentDimension.width * currentDimension.height > maxDimensions.width * maxDimensions.height) {
            maxDimensions = currentDimension;
        }
    }
    const maxSize = Math.max(...filterNonNull(infos.map((info) => info.size)));

    const parts = [
        infos.length === 1 ? '1 image' : `${infos.length} images`,
        [...fileTypes].join('/'),
        `${maxDimensions.width}×${maxDimensions.height}`,
        formatFileSize(maxSize),
    ];

    return parts.join(' · ');
}
export abstract class InputForm implements CoverArtDownloaderHooks {
    private readonly urlInput: HTMLInputElement;
    private readonly buttonContainer: HTMLElement;
    private readonly buttonList: HTMLElement;
    private readonly loadProviderInfoButton: HTMLElement;
    private readonly orSpan: HTMLElement;

    private readonly providers: ProviderButtonHandle[] = [];

    private readonly fakeSubmitButton: HTMLElement;
    protected abstract realSubmitButton: HTMLElement;

    protected abstract formId: string; // ID of the cover art upload form, used in CSS selectors.

    private readonly progressElements = new Map<number, ProgressElement>();

    public constructor(app: App) {
        // Inject our custom CSS
        insertStylesheet(css);

        // The input element into which URLs will be pasted.
        this.urlInput = (
            <input
                type="url"
                placeholder={INPUT_PLACEHOLDER_TEXT}
                size={47}
                id="ROpdebee_paste_url"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onPaste={async (event_): Promise<void> => {
                    // Get both HTML and plain text. If the user pastes just plain
                    // text, HTML will be empty.
                    const htmlText = event_.clipboardData.getData('text/html');
                    const plainText = event_.clipboardData.getData('text');

                    const urls = htmlText.length > 0 ? parseHTMLURLs(htmlText) : parsePlainURLs(plainText);

                    // Don't fill the input element so the user can immediately
                    // paste more URLs.
                    event_.preventDefault();
                    // Set the URL we'll process as the input's placeholder text as
                    // an "acknowledgement".
                    event_.currentTarget.placeholder = urls.join('\n');

                    const inputUrls = filterNonNull(urls.map((inputUrl) => {
                        try {
                            return new URL(inputUrl);
                        } catch (error) {
                            LOGGER.error(`Invalid URL: ${inputUrl}`, error);
                            return null;
                        }
                    }));

                    if (inputUrls.length === 0) {
                        LOGGER.info('No URLs found in input');
                        return;
                    }

                    await app.processURLs(inputUrls);
                    app.clearLogLater();

                    if (this.urlInput.placeholder === urls.join('\n')) {
                        this.urlInput.placeholder = INPUT_PLACEHOLDER_TEXT;
                    }
                }}
            />
        ) as HTMLElement as HTMLInputElement;

        // Container element for the URL input and additional information
        const container = (
            <div className="ROpdebee_paste_url_cont">
                {this.urlInput}
                {createConfig()}
                <a
                    href="https://github.com/ROpdebee/mb-userscripts/blob/main/src/mb_enhanced_cover_art_uploads/docs/supported_providers.md"
                    target="_blank"
                    id="ROpdebee_ecau_providers_link"
                >
                    Supported providers
                </a>
            </div>
        );

        this.buttonList = <div className="buttons" />;
        this.loadProviderInfoButton = (
            <button
                id="load-info"
                onClick={(event_): void => {
                    event_.preventDefault();
                    this.loadCoverArtInfo();
                }}
            >
                Load cover art info…
            </button>
        );

        this.buttonContainer = (
            <div className="ROpdebee_import_url_buttons" style={{ display: 'none' }}>
                {this.buttonList}
                {this.loadProviderInfoButton}
            </div>
        );

        this.orSpan = <span style={{ display: 'none' }}>or</span>;

        qs('#drop-zone')
            .insertAdjacentElement('afterend', container)
            ?.insertAdjacentElement('afterend', this.orSpan)
            ?.insertAdjacentElement('afterend', this.buttonContainer);

        this.fakeSubmitButton = (
            <button type="button" className="submit positive" disabled={true} hidden={true}>
                Enter edit
            </button>
        );
        qs('form > .buttons').append(this.fakeSubmitButton);
    }

    public async addImportButton(handle: ProviderHandle): Promise<void> {
        const { provider, url } = handle;
        const favicon = await provider.favicon;
        const button = (
            <button
                type="button"
                title={url}
                onClick={(event_): void => {
                    event_.preventDefault();
                    handle.onClick();
                }}
            >
                <img src={favicon} alt={provider.name} />
                <span className="provider-title">{'Import from ' + provider.name}</span>
                <span className="provider-metadata hidden content-loading"></span>
            </button>
        );

        const buttonHandle = { ...handle, button };
        this.providers.push(buttonHandle);

        this.orSpan.style.display = '';
        this.buttonContainer.style.display = '';
        this.buttonList.insertAdjacentElement('beforeend', button);

        if (await CONFIG.prefetchMetadata.get()) {
            this.loadCoverArtInfoForProvider(buttonHandle);
            this.loadProviderInfoButton.style.display = 'none';
        }
    }

    private loadCoverArtInfo(): void {
        this.loadProviderInfoButton.style.display = 'none';
        for (const handle of this.providers) {
            this.loadCoverArtInfoForProvider(handle);
        }
    }

    private loadCoverArtInfoForProvider(handle: ProviderButtonHandle): void {
        const metadataSpan = handle.button.querySelector('.provider-metadata')!;
        handle.getInfo()
            .then((info) => {
                metadataSpan.textContent = providerInfoToString(info);
                metadataSpan.classList.remove('content-loading');
                // Log something so that the log window doesn't seem "stuck" on "getting image dimensions"
                LOGGER.info(`Successfully retrieved image info for ${handle.provider.name}`);
            }).catch((error: unknown) => {
                LOGGER.error(`Could not retrieve information for ${handle.url}`, error);
                metadataSpan.textContent = 'Error :(';
                metadataSpan.classList.remove('content-loading');
            });

        metadataSpan.classList.remove('hidden');
    }

    // MB has its own submission disabling logic which we don't want to interfere
    // with. Instead of setting the `disabled` property on the real button, we
    // instead hide it and replace it with a fake one while we are blocking
    // submissions. When we unblock, we remove our fake button and reveal the
    // real one again. Therefore, when the real one is still disabled, we can't
    // enable it on accident.
    public disableSubmissions(): void {
        this.realSubmitButton.hidden = true;
        this.fakeSubmitButton.hidden = false;
    }

    public enableSubmissions(): void {
        this.realSubmitButton.hidden = false;
        this.fakeSubmitButton.hidden = true;
    }

    public onDownloadStarted(id: number, url: URL): void {
        const progressElement = new ProgressElement(url);
        this.progressElements.set(id, progressElement);
        qs(`form#${this.formId} tbody`).append(progressElement.rootElement);
    }

    public onDownloadFinished(id: number): void {
        const progressElement = this.progressElements.get(id);
        progressElement?.rootElement.remove();
        this.progressElements.delete(id);
    }

    public onDownloadProgress(id: number, url: URL, progress: ProgressEvent): void {
        const progressElement = this.progressElements.get(id);
        assertDefined(progressElement);
        progressElement.url = url;
        if (progress.lengthComputable && progress.total > 0) {
            progressElement.progress = progress.loaded / progress.total;
        }
    }
}

export class ReleaseInputForm extends InputForm {
    protected override readonly realSubmitButton: HTMLButtonElement;
    protected override readonly formId = 'add-cover-art';

    public constructor(app: App) {
        super(app);
        this.realSubmitButton = qs<HTMLButtonElement>('button#add-cover-art-submit');
    }
}

export class EventInputForm extends InputForm {
    protected override readonly realSubmitButton: HTMLButtonElement;
    protected override readonly formId = 'add-event-art';

    public constructor(app: App) {
        super(app);
        this.realSubmitButton = qs<HTMLButtonElement>('button#add-event-art-submit');
    }
}
