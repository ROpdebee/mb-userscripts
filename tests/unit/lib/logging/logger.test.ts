import type { LoggingSink } from '@lib/logging/sink';
import { LogLevel } from '@lib/logging/levels';
import { Logger } from '@lib/logging/logger';

// This needs to be a class, it cannot be a simple object that structurally
// matches the LoggingSink interface since we have test cases that create two
// of these sinks.
class FakeSink implements LoggingSink {
    public readonly onDebug = jest.fn();
    public readonly onError = jest.fn();
    public readonly onInfo = jest.fn();
    public readonly onSuccess = jest.fn();
    public readonly onLog = jest.fn();
    public readonly onWarn = jest.fn();
}

const handlerNames: Array<keyof LoggingSink> = ['onDebug', 'onLog', 'onWarn', 'onError', 'onInfo', 'onSuccess'];
type LoggerMethodName = 'debug' | 'log' | 'warn' | 'error' | 'info' | 'success';
const loggerMethodNames: LoggerMethodName[] = ['debug', 'log', 'info', 'success', 'warn', 'error'];
const loggerToHandlerNames = Object.fromEntries(loggerMethodNames
    .map((name) => [name, 'on' + name[0].toUpperCase() + name.slice(1) as keyof LoggingSink]));

describe('logger', () => {
    describe('configuring', () => {
        it('gets configured through constructor', () => {
            const logger = new Logger({
                logLevel: LogLevel.WARNING,
                sinks: [new FakeSink()],
            });

            expect(logger.configuration.logLevel).toBe(LogLevel.WARNING);
            expect(logger.configuration.sinks).toBeArrayOfSize(1);
        });

        it('sets defaults when not configured through constructor', () => {
            const logger = new Logger();

            expect(logger.configuration.logLevel).toBe(LogLevel.INFO);
            expect(logger.configuration.sinks).toBeArrayOfSize(0);
        });

        it('sets configuration through configure', () => {
            const logger = new Logger();
            const sink = new FakeSink();
            logger.configure({
                logLevel: LogLevel.DEBUG,
                sinks: [sink],
            });

            expect(logger.configuration.logLevel).toBe(LogLevel.DEBUG);
            expect(logger.configuration.sinks).toStrictEqual([sink]);
        });

        it('overrides configuration partially through configure', () => {
            const logger = new Logger({
                logLevel: LogLevel.DEBUG,
                sinks: [new FakeSink()],
            });
            logger.configure({
                logLevel: LogLevel.WARNING,
            });

            expect(logger.configuration.logLevel).toBe(LogLevel.WARNING);
            expect(logger.configuration.sinks).toBeArrayOfSize(1);
        });

        it('allow adding sinks through addSink', () => {
            const logger = new Logger({
                sinks: [new FakeSink()],
            });
            logger.addSink(new FakeSink());

            expect(logger.configuration.sinks).toBeArrayOfSize(2);
        });
    });

    describe('logging with one sink', () => {
        const sink = new FakeSink();
        const logger = new Logger({
            logLevel: LogLevel.DEBUG,
            sinks: [sink],
        });

        beforeEach(() => {
            // Reset all mock functions on each test
            handlerNames.forEach((name) => {
                sink[name].mockReset();
            });
        });

        it.each(loggerMethodNames)('calls the %s handler', (level) => {
            logger[level]('test message');
            const handlerName = loggerToHandlerNames[level];
            const notCalledNames = handlerNames.filter((name) => name !== handlerName);

            expect(sink[handlerName]).toHaveBeenCalledExactlyOnceWith('test message');

            notCalledNames.forEach((name) => {
                expect(sink[name]).not.toHaveBeenCalled();
            });
        });

        it('calls the error handler with an exception if provided', () => {
            logger.error('test message', new Error('test error'));

            expect(sink.onError).toHaveBeenCalledExactlyOnceWith('test message', new Error('test error'));
        });

        it('calls no handler if no sink is attached', () => {
            logger.configure({
                sinks: [],
            });
            logger.debug('test message');

            expect(sink.onDebug).not.toHaveBeenCalled();
        });
    });

    describe('logging with incomplete sink', () => {
        const logger = new Logger({
            logLevel: LogLevel.DEBUG,
            sinks: [{}],
        });

        it.each(loggerMethodNames)('allows %s handler to be undefined', (level) => {
            expect(() => {
                logger[level]('test message');
            }).not.toThrow();
        });
    });

    describe('logging with multiple sinks', () => {
        const sinks = [new FakeSink(), new FakeSink()];
        const logger = new Logger({
            logLevel: LogLevel.DEBUG,
            sinks,
        });

        beforeEach(() => {
            // Reset all mock functions on each test
            handlerNames.forEach((name) => {
                sinks.forEach((sink) => {
                    sink[name].mockReset();
                });
            });
        });

        it.each(loggerMethodNames)('calls %s handlers of all sinks if multiple are attached', (level) => {
            logger[level]('test message');
            const handlerName = loggerToHandlerNames[level];
            const notCalledNames = handlerNames.filter((name) => name !== handlerName);

            sinks.forEach((sink) => {
                expect(sink[handlerName]).toHaveBeenCalledExactlyOnceWith('test message');

                notCalledNames.forEach((name) => {
                    expect(sink[name]).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe.each(
        [LogLevel.DEBUG, LogLevel.LOG, LogLevel.INFO, LogLevel.SUCCESS, LogLevel.WARNING, LogLevel.ERROR],
    )('logging with minimum level %i', (minLogLevel) => {
        const sink = new FakeSink();
        const logger = new Logger({
            logLevel: minLogLevel,
            sinks: [sink],
        });

        beforeEach(() => {
            // Reset all mock functions on each test
            handlerNames.forEach((name) => {
                sink[name].mockReset();
            });
        });

        interface Case {
            shouldCall: boolean;
            desc: string;
            level: LoggerMethodName;
        }
        const cases: Case[] = loggerMethodNames.map((level, levelIdx) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
            const shouldCall = levelIdx >= minLogLevel;
            return {
                desc: shouldCall ? 'calls' : 'does not call',
                shouldCall,
                level,
            };
        });

        // "calls ... handler" or "does not call ... handler"
        it.each(cases)('$desc $level handler', ({ shouldCall, level }: Case) => {
            logger[level]('test message');

            expect(sink[loggerToHandlerNames[level]])
                .toHaveBeenCalledTimes(shouldCall ? 1 : 0);
        });
    });
});
