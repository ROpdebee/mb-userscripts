import USERSCRIPT_NAME from 'consts:userscript-name';
import { LOGGER } from '@lib/logging/logger';
import { qs } from '@lib/util/dom';
import type { CoverArtProvider } from '../providers/base';

import css from './main.scss';

export class InputForm {
    #urlInput: HTMLInputElement;
    #buttonContainer: HTMLDivElement;
    #orSpan: HTMLSpanElement;

    constructor(banner: HTMLElement, onUrlFilled: (url: URL) => void) {
        // Inject our custom CSS
        document.head.append(<style id={'ROpdebee_' + USERSCRIPT_NAME}>
            {css}
        </style>);

        // The input element into which URLs will be pasted.
        this.#urlInput = <input
            type='url'
            placeholder='or paste a URL here'
            size={47}
            id='ROpdebee_paste_url'
            onInput={(evt): void => {
                // Early validation.
                if (!evt.currentTarget.value) return;
                // eslint-disable-next-line init-declarations
                let url: URL;
                try {
                    url = new URL(evt.currentTarget.value.trim());
                } catch (err) {
                    LOGGER.error('Invalid URL', err);
                    return;
                }

                onUrlFilled(url);
            }}
        /> as HTMLInputElement;

        // Container element for the URL input and additional information
        const container = <div className='ROpdebee_paste_url_cont'>
            {this.#urlInput}
            <a
                href='https://github.com/ROpdebee/mb-userscripts/blob/main/src/mb_enhanced_cover_art_uploads/docs/supported_providers.md'
                target='_blank'
            >
                Supported providers
            </a>
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

    clearOldInputValue(oldValue: string): void {
        // Clear the old input, but only if it hasn't changed since.
        // Much of the implementation is asynchronous code, so it's entirely
        // possible for another image to be loading at the same time. We don't
        // want to clear that input yet.
        if (this.#urlInput.value == oldValue) {
            this.#urlInput.value = '';
        }
    }

    addImportButton(onClickCallback: () => void, url: string, provider: CoverArtProvider): void {
        const button = <button
            type='button'
            title={url}
            onClick={(evt): void => { evt.preventDefault(); onClickCallback(); }}
        >
            <img src={provider.favicon} alt={provider.name} />
            <span>{'Import from ' + provider.name}</span>
        </button>;

        this.#orSpan.style.display = '';
        this.#buttonContainer.insertAdjacentElement('beforeend', button);
    }
}
