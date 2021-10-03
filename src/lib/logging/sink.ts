export interface LoggingSink {
    onDebug?(message: string): void
    onLog?(message: string): void
    onInfo?(message: string): void
    onWarn?(message: string): void
    onError?(message: string, exception?: unknown): void
}
