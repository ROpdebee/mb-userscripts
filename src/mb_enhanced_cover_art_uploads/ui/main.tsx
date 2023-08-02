import type { ProgressEvent } from '@lib/util/request';
import { LOGGER } from '@lib/logging/logger';
import { filterNonNull } from '@lib/util/array';
import { assertDefined } from '@lib/util/assert';
import { createPersistentCheckbox } from '@lib/util/checkboxes';
import { insertStylesheet } from '@lib/util/css';
import { parseDOM, qs, qsa } from '@lib/util/dom';

import type { App } from '../App';
import type { FetcherHooks } from '../fetch';
import type { CoverArtProvider } from '../providers/base';

import css from './main.scss';

const INPUT_PLACEHOLDER_TEXT = 'or paste one or more URLs here';

class ProgressElement {
    private readonly urlSpan: HTMLSpanElement;
    private readonly progressbar: HTMLElement;
    public readonly rootElement: HTMLElement;

    public constructor(url: URL) {
        this.urlSpan = <span>{url.href}</span>;
        // Need to insert a nbsp, otherwise it'll have a height of 0. For some
        // reason just adding &nbsp; doesn't work (NativeJSX removing it?), but
        // this does.
        this.progressbar = <div className='ui-progressbar-value ui-widget-header ui-corner-left' style={{ backgroundColor: '#cce5ff', width: '0%' }}>
            {'\u00A0'}
        </div>;

        this.rootElement = <tr style={{ display: 'flex' }}>
            <td className='uploader-preview-column'>
                <div className='content-loading' style={{ width: '120px', height: '120px', position: 'relative' }} />
            </td>
            <td style={{ width: '65%' }}>
                <div className='row'>
                    <label>URL:</label>
                    {this.urlSpan}
                </div>
            </td>
            <td style={{ flexGrow: 1 }}>
                <div className='ui-progressbar ui-widget ui-widget-content ui-corner-all' role='progressbar' style={{ width: '100%' }}>
                    {this.progressbar}
                </div>
            </td>
        </tr>;
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
    const doc = parseDOM(htmlText, document.location.origin);
    // Get URLs from <img> sources
    let urls = qsa<HTMLImageElement>('img', doc).map((img) => img.src);
    // If there are no <img> elements in the pasted content, try getting URLs from <a> elements.
    if (urls.length === 0) {
        urls = qsa<HTMLAnchorElement>('a', doc).map((anchor) => anchor.href);
    }
    if (urls.length === 0) {
        // If there aren't any <img> or <a> elements whatsoever, assume the user
        // copied a list of plain-text URLs that happened to be on a HTML page
        // and parse it as plain text
        return parsePlainURLs(doc.textContent ?? '');
    }

    // Deduplicate URLs and retain only http:, https:, or data: URLs,
    // i.e. filter out javascript: etc.
    return [...new Set(urls)]
        .filter((url) => /^(?:https?|data):/.test(url));
}

function parsePlainURLs(text: string): string[] {
    return text.trim().split(/\s+/);
}

export class InputForm implements FetcherHooks {
    private readonly urlInput: HTMLInputElement;
    private readonly buttonContainer: HTMLDivElement;
    private readonly orSpan: HTMLSpanElement;

    private readonly fakeSubmitButton: HTMLButtonElement;
    private readonly realSubmitButton: HTMLButtonElement;

    private readonly progressElements = new Map<number, ProgressElement>();

    public constructor(app: App) {
        // Inject our custom CSS
        insertStylesheet(css);

        // The input element into which URLs will be pasted.
        this.urlInput = <input
            type='url'
            placeholder={INPUT_PLACEHOLDER_TEXT}
            size={47}
            id='ROpdebee_paste_url'
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onPaste={async (evt): Promise<void> => {
                if (!evt.clipboardData) {
                    LOGGER.warn('No clipboard data?');
                    return;
                }

                // Get both HTML and plain text. If the user pastes just plain
                // text, HTML will be empty.
                const htmlText = evt.clipboardData.getData('text/html');
                const plainText = evt.clipboardData.getData('text');

                const urls = htmlText.length > 0 ? parseHTMLURLs(htmlText) : parsePlainURLs(plainText);

                // Don't fill the input element so the user can immediately
                // paste more URLs.
                evt.preventDefault();
                // Set the URL we'll process as the input's placeholder text as
                // an "acknowledgement".
                evt.currentTarget.placeholder = urls.join('\n');

                const inputUrls = filterNonNull(urls.map((inputUrl) => {
                    try {
                        return new URL(inputUrl);
                    } catch (err) {
                        LOGGER.error(`Invalid URL: ${inputUrl}`, err);
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
        /> as HTMLInputElement;

        const [onlyFrontCheckbox, onlyFrontLabel] = createPersistentCheckbox(
            'ROpdebee_paste_front_only',
            'Fetch front image only',
            (evt) => {
                app.onlyFront = (evt.currentTarget as HTMLInputElement | undefined)?.checked ?? false;
            });
        app.onlyFront = onlyFrontCheckbox.checked;

        // Container element for the URL input and additional information
        const container = <div className='ROpdebee_paste_url_cont'>
            {this.urlInput}
            <a
                href='https://github.com/ROpdebee/mb-userscripts/blob/main/src/mb_enhanced_cover_art_uploads/docs/supported_providers.md'
                target='_blank'
            >
                Supported providers
            </a>
            {onlyFrontCheckbox}
            {onlyFrontLabel}
        </div>;

        this.buttonContainer = <div className='ROpdebee_import_url_buttons buttons' /> as HTMLDivElement;

        // If we inline this into the function call below, nativejsx crashes.
        // It might have something to do with the optional chaining on the
        // function calls.
        this.orSpan = <span style={{ display: 'none' }}>or</span>;

        qs('#drop-zone')
            .insertAdjacentElement('afterend', container)
            ?.insertAdjacentElement('afterend', this.orSpan)
            ?.insertAdjacentElement('afterend', this.buttonContainer);

        this.realSubmitButton = qs<HTMLButtonElement>('button#add-cover-art-submit');
        this.fakeSubmitButton = <button type='button' className='submit positive' disabled={true} hidden={true}>
            Enter edit
        </button> as HTMLButtonElement;
        qs('form > .buttons').append(this.fakeSubmitButton);
    }

    public async addImportButton(onClickCallback: () => void, url: string, provider: CoverArtProvider): Promise<void> {
        const favicon = await provider.favicon;
        const button = <button
            type='button'
            title={url}
            onClick={(evt): void => { evt.preventDefault(); onClickCallback(); }}
        >
            <img src={favicon} alt={provider.name} />
            <span>{'Import from ' + provider.name}</span>
        </button>;

        this.orSpan.style.display = '';
        this.buttonContainer.insertAdjacentElement('beforeend', button);
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

    public onFetchStarted(id: number, url: URL): void {
        const progressElement = new ProgressElement(url);
        this.progressElements.set(id, progressElement);
        qs('form#add-cover-art tbody').append(progressElement.rootElement);
    }

    public onFetchFinished(id: number): void {
        const progressElement = this.progressElements.get(id);
        progressElement?.rootElement.remove();
        this.progressElements.delete(id);
    }

    public onFetchProgress(id: number, url: URL, progress: ProgressEvent): void {
        const progressElement = this.progressElements.get(id);
        assertDefined(progressElement);
        progressElement.url = url;
        if (progress.lengthComputable && progress.total > 0) {
            progressElement.progress = progress.loaded / progress.total;
        }
    }
}
