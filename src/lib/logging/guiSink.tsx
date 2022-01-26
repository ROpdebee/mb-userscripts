import type { LoggingSink } from './sink';

import css from './guiSink.scss';

export class GuiSink implements LoggingSink {
    readonly rootElement: HTMLElement;
    private lastTransientMessage?: HTMLSpanElement;

    constructor() {
        // Inject our custom CSS
        document.head.append(<style id={'ROpdebee_GUI_Logger'}>
            {css}
        </style>);

        this.rootElement = <div id='ROpdebee_log_container' style={{ display: 'none' }} />;
    }

    private createMessage(className: string, message: string, exception?: unknown): HTMLSpanElement {
        let content: string;
        if (exception && exception instanceof Error) {
            content = message + ': ' + exception.message;
        } else {
            content = message;
        }

        return <span className={`msg ${className}`}>{content}</span>;
    }

    private addMessage(el: HTMLSpanElement): void {
        this.rootElement.appendChild(el);
        this.rootElement.style.display = 'block';
    }

    private addPersistentMessage(el: HTMLSpanElement): void {
        this.addMessage(el);
    }

    private addTransientMessage(el: HTMLSpanElement): void {
        // Remove existing transient message to replace it by the new one.
        if (typeof this.lastTransientMessage !== 'undefined') {
            this.lastTransientMessage.remove();
        }

        this.lastTransientMessage = el;
        this.addMessage(el);
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
}
