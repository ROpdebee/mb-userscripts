import { ConsoleSink } from '@lib/logging/consoleSink';
import { LogLevel } from '@lib/logging/levels';
import { Logger } from '@lib/logging/logger';

describe('console logging sink', () => {
    const logger = new Logger({
        logLevel: LogLevel.DEBUG,
        sinks: [new ConsoleSink('test script')],
    });

    type LogLevel = 'debug' | 'log' | 'info' | 'warn' | 'error';
    const allLevels: LogLevel[] = ['debug', 'log', 'info', 'warn', 'error'];
    const levelsWithExceptions: LogLevel[] = ['error', 'warn'];

    it.each(allLevels)('uses console.%s', (levelName) => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const consoleMethod = jest.spyOn(console, levelName).mockImplementationOnce(() => {});
        logger[levelName]('test');

        expect(consoleMethod).toHaveBeenCalledExactlyOnceWith('[test script] test');

        consoleMethod.mockReset();
    });

    it('uses console.info for success', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'info').mockImplementationOnce(() => {});
        logger.success('test');

        expect(console.info).toHaveBeenCalledExactlyOnceWith('[test script] test');
    });

    it.each(levelsWithExceptions)('provides error to console.%s', (levelName) => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const consoleMethod = jest.spyOn(console, levelName).mockImplementationOnce(() => {});
        logger[levelName]('test', new Error('error'));

        expect(consoleMethod).toHaveBeenCalledExactlyOnceWith('[test script] test', new Error('error'));
    });
});
