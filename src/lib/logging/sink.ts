import type { LogLevel } from './levels';

export interface LoggingSink {
    onDebug?(message: string): void;
    onLog?(message: string): void;
    onInfo?(message: string): void;
    onSuccess?(message: string): void;
    onWarn?(message: string, exception?: unknown): void;
    onError?(message: string, exception?: unknown): void;

    /**
     * Minimum level of log messages to pass to this sink. If left undefined,
     * the logger will use the minimum level set on the logger itself.
     */
    minimumLevel?: LogLevel;
}
