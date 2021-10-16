import type { LoggingSink } from '@lib/logging/sink';

export class StatusBanner implements LoggingSink {
    #banner: HTMLSpanElement;

    constructor() {
        this.#banner = <span
            id='ROpdebee_paste_url_status'
            style={{ display: 'none' }}
        />;
    }

    #setStatusBanner(message: string, exception?: unknown): void {
        if (exception && Object.hasOwnProperty.call(exception, 'message')) {
            this.#banner.textContent = message + ' ' + exception;
        } else {
            this.#banner.textContent = message;
        }
        this.#banner.style.removeProperty('display');
    }

    onInfo(message: string): void {
        this.#setStatusBanner(message);
        this.#banner.style.color = 'black';
    }

    onWarn(message: string): void {
        this.#setStatusBanner(message);
        this.#banner.style.color = 'orange';
    }

    onError(message: string, exception?: unknown): void {
        this.#setStatusBanner(message, exception);
        this.#banner.style.color = 'red';
    }

    onSuccess(message: string): void {
        this.#setStatusBanner(message);
        this.#banner.style.color = 'green';
    }

    get htmlElement(): HTMLSpanElement {
        return this.#banner;
    }
}
