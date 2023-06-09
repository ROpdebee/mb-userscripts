import type { LoggingSink } from './sink';
import { LogLevel } from './levels';

interface LogRecord {
    level: string;
    message: string;
    timestamp: number;
    exception?: unknown;
}

export class CollectorSink implements LoggingSink {
    private readonly records: LogRecord[];

    public constructor() {
        this.records = [];
    }

    private saveMessage(level: string, message: string, exception?: unknown): void {
        this.records.push({
            level,
            message,
            exception,
            timestamp: Date.now(),
        });
    }

    public dumpMessages(): string {
        return this.records
            .flatMap(({ level, message, timestamp, exception }) => {
                const dateStr = new Date(timestamp).toISOString();
                const lines = [`[${dateStr} - ${level}] ${message}`];
                if (exception !== undefined) lines.push(`${exception}`);
                return lines;
            })
            .join('\n');
    }

    public readonly onDebug = this.saveMessage.bind(this, 'DEBUG');
    public readonly onLog = this.saveMessage.bind(this, 'LOG');
    public readonly onInfo = this.saveMessage.bind(this, 'INFO');
    public readonly onSuccess = this.saveMessage.bind(this, 'SUCCESS');
    public readonly onWarn = this.saveMessage.bind(this, 'WARNING');
    public readonly onError = this.saveMessage.bind(this, 'ERROR');

    public readonly minimumLevel = LogLevel.DEBUG;
}
