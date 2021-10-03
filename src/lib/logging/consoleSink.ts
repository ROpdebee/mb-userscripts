import type { LoggingSink } from './sink';

export class ConsoleSink implements LoggingSink {
    #scriptName: string;

    constructor(scriptName: string) {
        this.#scriptName = scriptName;
    }

    #formatMessage(message: string): string {
        return `[${this.#scriptName}] ${message}`;
    }

    onDebug(message: string): void {
        console.debug(this.#formatMessage(message));
    }

    onLog(message: string): void {
        console.log(this.#formatMessage(message));
    }

    onInfo(message: string): void {
        console.info(this.#formatMessage(message));
    }

    onSuccess = this.onInfo;

    onWarn(message: string): void {
        console.warn(this.#formatMessage(message));
    }

    onError(message: string, exception?: unknown): void {
        message = this.#formatMessage(message);

        if (exception) console.error(message, exception);
        else console.error(message);
    }
}
