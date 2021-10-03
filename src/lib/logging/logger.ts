import { LogLevel } from './levels';
import type { LoggingSink } from './sink';

interface LoggerOptions {
    logLevel: LogLevel
    sinks: LoggingSink[]
}

const HANDLER_NAMES: Record<LogLevel, keyof LoggingSink> = {
    [LogLevel.DEBUG]: 'onDebug',
    [LogLevel.LOG]: 'onLog',
    [LogLevel.INFO]: 'onInfo',
    [LogLevel.WARNING]: 'onWarn',
    [LogLevel.ERROR]: 'onError',
};

const DEFAULT_OPTIONS = {
    logLevel: LogLevel.INFO,
    sinks: []
};

export class Logger {
    #configuration: LoggerOptions;

    constructor(options?: Partial<LoggerOptions>) {
        this.#configuration = {
            ...DEFAULT_OPTIONS,
            ...options
        };
    }

    #fireHandlers(level: LogLevel, message: string, exception?: unknown): void {
        if (level < this.#configuration.logLevel) return;

        this.#configuration.sinks
            .forEach((sink) => {
                const handler = sink[HANDLER_NAMES[level]];
                if (!handler) return;

                if (exception) {
                    // @ts-expect-error: Too dynamic. `exception` will only be
                    // defined if level is error, in which case the handler
                    // will accept it.
                    handler.call(sink, message, exception);
                } else {
                    // Still using a conditional here, otherwise it will call
                    // the handler with undefined as 2nd arg instead of with
                    // just 1 arg, which might lead to bad output.
                    handler.call(sink, message);
                }
            });
    }

    debug(message: string): void {
        this.#fireHandlers(LogLevel.DEBUG, message);
    }
    log(message: string): void {
        this.#fireHandlers(LogLevel.LOG, message);
    }
    info(message: string): void {
        this.#fireHandlers(LogLevel.INFO, message);
    }
    warn(message: string): void {
        this.#fireHandlers(LogLevel.WARNING, message);
    }
    error(message: string, exception?: unknown): void {
        this.#fireHandlers(LogLevel.ERROR, message, exception);
    }

    configure(options: Partial<LoggerOptions>): void {
        Object.assign(this.#configuration, options);
    }

    get configuration(): Readonly<LoggerOptions> {
        return this.#configuration;
    }

    addSink(sink: LoggingSink): void {
        this.#configuration.sinks.push(sink);
    }
}

export const LOGGER = new Logger();
