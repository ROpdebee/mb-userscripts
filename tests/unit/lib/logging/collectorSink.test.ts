import { CollectorSink } from '@lib/logging/collectorSink';
import { LogLevel } from '@lib/logging/levels';
import { Logger } from '@lib/logging/logger';

describe('collector sink', () => {
    let sink: CollectorSink;
    let logger: Logger;
    const dateNowMock = jest.spyOn(Date, 'now');
    let expectedTimestamp: string;

    beforeEach(() => {
        // Need to reset sink and logger on each case so that the saved messages
        // are reset
        sink = new CollectorSink();
        logger = new Logger({
            logLevel: LogLevel.INFO,
            sinks: [sink],
        });
        dateNowMock.mockReturnValue(123);
        expectedTimestamp = new Date(Date.now()).toISOString();
    });

    it('places a timestamp on log messages', () => {
        logger.info('this is a message');

        expect(sink.dumpMessages()).toBe(`[${expectedTimestamp} - INFO] this is a message`);
    });

    it('logs multiple messages', () => {
        logger.info('this is a message');
        dateNowMock.mockReturnValue(456);
        logger.info('this is another message');
        const expectedTimestamp2 = new Date(Date.now()).toISOString();

        expect(sink.dumpMessages().split('\n')).toStrictEqual([
            `[${expectedTimestamp} - INFO] this is a message`,
            `[${expectedTimestamp2} - INFO] this is another message`,
        ]);
    });

    it('logs debug messages', () => {
        logger.debug('this is a debug message');

        expect(sink.dumpMessages()).toBe(`[${expectedTimestamp} - DEBUG] this is a debug message`);
    });

    it('logs exception information messages', () => {
        const err = new Error('hello world');
        logger.error('this is an error', err);

        expect(sink.dumpMessages().split('\n')).toStrictEqual([
            `[${expectedTimestamp} - ERROR] this is an error`,
            'Error: hello world',
        ]);
    });
});
