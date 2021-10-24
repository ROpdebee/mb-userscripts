import type { LoggingSink } from '@lib/logging/sink';

type BannerMessageClass = 'info' | 'warning' | 'error' | 'success';

export class StatusBanner implements LoggingSink {
    #banner: HTMLSpanElement;
    // Current banner message's class name. We need to remember this so we can
    // clear it later on to replace it by another.
    #currentMessageClass: BannerMessageClass = 'info';

    constructor() {
        this.#banner = <span
            id='ROpdebee_paste_url_status'
            // Use info as default, it'll be overwritten on the first message.
            className='info'
            style={{ display: 'none' }}
        />;
    }

    #setStatusBanner(message: string, exception?: unknown): void {
        if (exception && exception instanceof Error) {
            this.#banner.textContent = message + ': ' + exception.message;
        } else {
            this.#banner.textContent = message;
        }
        this.#banner.style.removeProperty('display');
    }

    #setStatusBannerClass(newClass: BannerMessageClass): void {
        // Need to take care to only remove the previous class that indicates
        // the message type. Although we're (at the time of writing) not using
        // any other classes on this element, we may do so in the future.
        this.#banner.classList.replace(this.#currentMessageClass, newClass);
        this.#currentMessageClass = newClass;
    }

    onInfo(message: string): void {
        this.#setStatusBanner(message);
        this.#setStatusBannerClass('info');
    }

    onWarn(message: string, exception?: unknown): void {
        this.#setStatusBanner(message, exception);
        this.#setStatusBannerClass('warning');
    }

    onError(message: string, exception?: unknown): void {
        this.#setStatusBanner(message, exception);
        this.#setStatusBannerClass('error');
    }

    onSuccess(message: string): void {
        this.#setStatusBanner(message);
        this.#setStatusBannerClass('success');
    }

    get htmlElement(): HTMLSpanElement {
        return this.#banner;
    }
}
