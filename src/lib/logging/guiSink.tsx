import { insertBetween } from '@lib/util/array';
import { insertStylesheet } from '@lib/util/css';

import type { LoggingSink } from './sink';

import css from './guiSink.scss';

export class GuiSink implements LoggingSink {
    // public so that users of the GUI sink can add the container to the page.
    public readonly rootElement: HTMLElement;
    private persistentMessages: HTMLSpanElement[] = [];
    private transientMessages: HTMLSpanElement[] = [];

    public constructor() {
        // Inject our custom CSS
        insertStylesheet(css, 'ROpdebee_GUI_Logger');

        this.rootElement = <div id='ROpdebee_log_container' style={{ display: 'none' }} />;
    }

    private createMessage(className: string, message: string, exception?: unknown): HTMLSpanElement {
        const extraMessage = exception instanceof Error ? `: ${exception.message}` : '';
        const content = message + extraMessage;
        // Insert word-break hints before all forward slashes so that URLs are
        // more likely to be split in natural places. In case it's still too
        // long, CSS properties will break even further, but without these,
        // the long URLs tend to be put on their own line.
        // Need to use a factory for insertBetween, otherwise the same <wbr>
        // element will be reused and it'll only be placed at the last slash.
        const children = insertBetween(content.split(/(?=\/|\?|&|%)/), () => <wbr />);

        return <span className={`msg ${className}`}>{children}</span>;
    }

    private addMessage(el: HTMLSpanElement): void {
        this.removeTransientMessages();
        this.rootElement.append(el);
        this.rootElement.style.display = 'block';
    }

    private removeTransientMessages(): void {
        this.transientMessages.forEach((el) => {
            el.remove();
        });
        this.transientMessages = [];
    }

    private addPersistentMessage(el: HTMLSpanElement): void {
        this.addMessage(el);
        this.persistentMessages.push(el);
    }

    private addTransientMessage(el: HTMLSpanElement): void {
        this.addMessage(el);
        this.transientMessages.push(el);
    }

    public onLog(message: string): void {
        this.addTransientMessage(this.createMessage('info', message));
    }

    public readonly onInfo = this.onLog.bind(this);

    public onSuccess(message: string): void {
        this.addTransientMessage(this.createMessage('success', message));
    }

    public onWarn(message: string, exception?: unknown): void {
        this.addPersistentMessage(this.createMessage('warning', message, exception));
    }

    public onError(message: string, exception?: unknown): void {
        this.addPersistentMessage(this.createMessage('error', message, exception));
    }

    public clearAllLater(): void {
        this.transientMessages = [...this.transientMessages, ...this.persistentMessages];
        this.persistentMessages = [];
    }
}
