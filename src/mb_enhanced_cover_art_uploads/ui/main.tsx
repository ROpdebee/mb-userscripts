import USERSCRIPT_NAME from 'consts:userscript-name';
import { LOGGER } from '@lib/logging/logger';
import { qs } from '@lib/util/dom';
import type { CoverArtProvider } from '../providers/base';
import type { App } from '../App';

import css from './main.scss';
import { createPersistentCheckbox } from '@lib/util/checkboxes';

export class InputForm {
    #urlInput: HTMLInputElement;
    #buttonContainer: HTMLDivElement;
    #orSpan: HTMLSpanElement;

    constructor(banner: HTMLElement, app: App) {
        // Inject our custom CSS
        document.head.append(<style id={'ROpdebee_' + USERSCRIPT_NAME}>
            {css}
        </style>);

        // The input element into which URLs will be pasted.
        this.#urlInput = <input
            type='url'
            placeholder='or paste one or more URLs here'
            size={47}
            id='ROpdebee_paste_url'
            onInput={async (evt): Promise<void> => {
                // Early validation.
                if (!evt.currentTarget.value) return;
                const oldValue = evt.currentTarget.value;

                for (const inputUrl of oldValue.trim().split(/\s+/)) {
                    let url: URL;
                    // Only use the try block to parse the URL, since we don't
                    // want to suppress errors in the image fetching.
                    try {
                        url = new URL(inputUrl);
                    } catch (err) {
                        LOGGER.error(`Invalid URL: ${inputUrl}`, err);
                        continue;
                    }

                    await app.processURL(url);
                }

                if (this.#urlInput.value === oldValue) {
                    this.#urlInput.value = '';
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
            {this.#urlInput}
            <a
                href='https://github.com/ROpdebee/mb-userscripts/blob/main/src/mb_enhanced_cover_art_uploads/docs/supported_providers.md'
                target='_blank'
            >
                Supported providers
            </a>
            {onlyFrontCheckbox}
            {onlyFrontLabel}
            {banner}
        </div>;

        this.#buttonContainer = <div className='ROpdebee_import_url_buttons buttons'/> as HTMLDivElement;

        // If we inline this into the function call below, nativejsx crashes.
        // It might have something to do with the optional chaining on the
        // function calls.
        this.#orSpan = <span style={{ display: 'none' }}>or</span>;

        qs('#drop-zone')
            .insertAdjacentElement('afterend', container)
            ?.insertAdjacentElement('afterend', this.#orSpan)
            ?.insertAdjacentElement('afterend', this.#buttonContainer);
    }

    async addImportButton(onClickCallback: () => void, url: string, provider: CoverArtProvider): Promise<void> {
        const favicon = await provider.favicon;
        const button = <button
            type='button'
            title={url}
            onClick={(evt): void => { evt.preventDefault(); onClickCallback(); }}
        >
            <img src={favicon} alt={provider.name} />
            <span>{'Import from ' + provider.name}</span>
        </button>;

        this.#orSpan.style.display = '';
        this.#buttonContainer.insertAdjacentElement('beforeend', button);
    }
}
