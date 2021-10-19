import { ConsoleSink } from '@lib/logging/consoleSink';
import { LogLevel } from '@lib/logging/levels';
import { Logger } from '@lib/logging/logger';

describe('console logging sink', () => {
    const logger = new Logger({
        logLevel: LogLevel.DEBUG,
        sinks: [new ConsoleSink('test script')],
    });

    it.each(['debug', 'log', 'info', 'warn', 'error'])('uses console.%s', (levelName) => {
        // @ts-expect-error too dynamic, too lazy to restrict types
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, levelName).mockImplementationOnce(() => {});
        // @ts-expect-error too dynamic, too lazy to restrict types
        logger[levelName]('test');
        // @ts-expect-error too dynamic, too lazy to restrict types
        const consoleMethod = console[levelName];

        expect(consoleMethod).toHaveBeenCalledOnce();
        expect(consoleMethod).toHaveBeenCalledWith('[test script] test');

        consoleMethod.mockReset();
    });

    it('uses console.info for success', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'info').mockImplementationOnce(() => {});
        logger.success('test');

        expect(console.info).toHaveBeenCalledOnce();
        expect(console.info).toHaveBeenCalledWith('[test script] test');
    });

    it('provides error to console.error', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        logger.error('test', new Error('error'));

        expect(console.error).toHaveBeenCalledOnce();
        expect(console.error).toHaveBeenCalledWith('[test script] test', new Error('error'));
    });
});
