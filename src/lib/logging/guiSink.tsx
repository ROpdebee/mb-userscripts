import type { LoggingSink } from './sink';

import css from './guiSink.scss';

export class GuiSink implements LoggingSink {
    readonly rootElement: HTMLElement;
    private persistentMessages: HTMLSpanElement[] = [];
    private transientMessages: HTMLSpanElement[] = [];

    constructor() {
        // Inject our custom CSS
        document.head.append(<style id={'ROpdebee_GUI_Logger'}>
            {css}
        </style>);

        this.rootElement = <div id='ROpdebee_log_container' style={{ display: 'none' }} />;
    }

    private createMessage(className: string, message: string, exception?: unknown): HTMLSpanElement {
        const extraMessage = exception instanceof Error ? `: ${exception.message}` : '';
        const content = message + extraMessage;

        return <span className={`msg ${className}`}>{content}</span>;
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

    onLog(message: string): void {
        this.addTransientMessage(this.createMessage('info', message));
    }

    onInfo = this.onLog.bind(this);

    onSuccess(message: string): void {
        this.addTransientMessage(this.createMessage('success', message));
    }

    onWarn(message: string, exception?: unknown): void {
        this.addPersistentMessage(this.createMessage('warning', message, exception));
    }

    onError(message: string, exception?: unknown): void {
        this.addPersistentMessage(this.createMessage('error', message, exception));
    }

    clearAllLater(): void {
        this.transientMessages = [...this.transientMessages, ...this.persistentMessages];
        this.persistentMessages = [];
    }
}
