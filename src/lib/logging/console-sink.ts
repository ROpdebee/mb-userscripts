import type { LoggingSink } from './sink';

export class ConsoleSink implements LoggingSink {
    protected readonly scriptName: string;

    public constructor(scriptName: string) {
        this.scriptName = scriptName;
    }

    protected formatMessage(message: string): string {
        return `[${this.scriptName}] ${message}`;
    }

    public onDebug(message: string): void {
        console.debug(this.formatMessage(message));
    }

    public onLog(message: string): void {
        console.log(this.formatMessage(message));
    }

    public onInfo(message: string): void {
        console.info(this.formatMessage(message));
    }

    public readonly onSuccess = this.onInfo.bind(this);

    public onWarn(message: string, exception?: unknown): void {
        message = this.formatMessage(message);

        if (exception) console.warn(message, exception);
        else console.warn(message);
    }

    public onError(message: string, exception?: unknown): void {
        message = this.formatMessage(message);

        if (exception) console.error(message, exception);
        else console.error(message);
    }
}
