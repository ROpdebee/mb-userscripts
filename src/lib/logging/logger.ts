import type { LoggingSink } from './sink';
import { LogLevel } from './levels';

interface LoggerOptions {
    logLevel: LogLevel;
    sinks: LoggingSink[];
}

const HANDLER_NAMES = {
    [LogLevel.DEBUG]: 'onDebug',
    [LogLevel.LOG]: 'onLog',
    [LogLevel.INFO]: 'onInfo',
    [LogLevel.SUCCESS]: 'onSuccess',
    [LogLevel.WARNING]: 'onWarn',
    [LogLevel.ERROR]: 'onError',
} as const;

const DEFAULT_OPTIONS = {
    logLevel: LogLevel.INFO,
    sinks: [],
};

export class Logger {
    private readonly _configuration: LoggerOptions;

    public constructor(options?: Partial<LoggerOptions>) {
        this._configuration = {
            ...DEFAULT_OPTIONS,
            ...options,
        };
    }

    private fireHandlers(level: LogLevel, message: string, exception?: unknown): void {
        this._configuration.sinks
            .forEach((sink) => {
                const minLevel = sink.minimumLevel ?? this.configuration.logLevel;
                if (level < minLevel) return;

                const handler = sink[HANDLER_NAMES[level]];
                if (!handler) return;

                if (exception) {
                    handler.call(sink, message, exception);
                } else {
                    // Still using a conditional here, otherwise it will call
                    // the handler with undefined as 2nd arg instead of with
                    // just 1 arg, which might lead to bad output.
                    handler.call(sink, message);
                }
            });
    }

    public debug(message: string): void {
        this.fireHandlers(LogLevel.DEBUG, message);
    }

    public log(message: string): void {
        this.fireHandlers(LogLevel.LOG, message);
    }

    public info(message: string): void {
        this.fireHandlers(LogLevel.INFO, message);
    }

    public success(message: string): void {
        this.fireHandlers(LogLevel.SUCCESS, message);
    }

    public warn(message: string, exception?: unknown): void {
        this.fireHandlers(LogLevel.WARNING, message, exception);
    }

    public error(message: string, exception?: unknown): void {
        this.fireHandlers(LogLevel.ERROR, message, exception);
    }

    public configure(options: Partial<LoggerOptions>): void {
        Object.assign(this._configuration, options);
    }

    public get configuration(): Readonly<LoggerOptions> {
        return this._configuration;
    }

    public addSink(sink: LoggingSink): void {
        this._configuration.sinks.push(sink);
    }
}

export const LOGGER = new Logger();
