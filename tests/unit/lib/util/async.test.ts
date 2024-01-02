import { asyncSleep, pFinally, retryTimes } from '@lib/util/async';

afterEach(() => {
    jest.useRealTimers();
});

describe('async timeout', () => {
    it('resolves after a timeout', async () => {
        jest.useFakeTimers();
        const promise = asyncSleep(500);
        const spy = jest.fn();
        void promise.then(spy);

        expect(spy).not.toHaveBeenCalled();

        jest.runAllTimers();
        // Need to await the promise before checking whether the spy has been
        // called, because the spy may have been called asynchronously itself.
        await promise;

        expect(spy).toHaveBeenCalledOnce();
    });

    it('resolves after the correct timeout', async () => {
        jest.useFakeTimers();
        const promise = asyncSleep(500);
        const spy = jest.fn();
        void promise.then(spy);

        expect(spy).not.toHaveBeenCalled();

        jest.advanceTimersByTime(499);

        expect(spy).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1);
        await promise;

        expect(spy).toHaveBeenCalledOnce();
    });
});

describe('retryTimes', () => {
    it('resolves immediately if function does not fail', async () => {
        jest.useFakeTimers();
        const mock = jest.fn().mockImplementation(() => 42);

        await expect(retryTimes(mock, 5, 500)).resolves.toBe(42);
        expect(mock).toHaveBeenCalledOnce();
    });

    it('does not call the function twice', async () => {
        jest.useFakeTimers();
        const mock = jest.fn().mockImplementation(() => 42);

        await expect(retryTimes(mock, 5, 500)).resolves.toBe(42);

        jest.advanceTimersByTime(1000);

        expect(mock).toHaveBeenCalledOnce();
    });

    it('retries the function until it passes', async () => {
        jest.useFakeTimers();
        const mock = jest.fn()
            .mockImplementation(() => 42)
            .mockImplementationOnce(() => {
                throw new Error('test');
            });
        const prom = retryTimes(mock, 5, 500);
        const spy = jest.fn();
        void prom.then(spy);

        expect(spy).not.toHaveBeenCalled();

        jest.runAllTimers();
        await prom;

        expect(spy).toHaveBeenCalledWith(42);
        expect(mock).toHaveBeenCalledTimes(2);
    });

    it('rejects if the function never passes', async () => {
        jest.useFakeTimers();
        const mock = jest.fn()
            .mockImplementation(() => {
                throw new Error('test');
            });
        const prom = retryTimes(mock, 5, 500);

        // Need to continuously run the timers because we're mixing async code
        // with timeouts. Just running it once will only advance the timer for
        // the first failure.
        for (let index = 0; index <= 5; index++) {
            jest.runAllTimers();
            // Give the async code a chance to run
            await new Promise<void>((resolve) => {
                resolve();
            });
        }

        await expect(prom).toReject();
        expect(mock).toHaveBeenCalledTimes(5);
    });

    it.each([[0, 'zero'], [-1, 'negative']])(
        'rejects on %s retryTimes value',
        async (times: number) => {
            jest.useFakeTimers();
            const mock = jest.fn();
            const prom = retryTimes(mock, times, 500);

            await expect(prom).toReject();
        });
});

describe('promise finally polyfill', () => {
    it('runs the finally handler when promise resolves', async () => {
        const callback = jest.fn();
        await pFinally(Promise.resolve(1), callback);

        expect(callback).toHaveBeenCalledOnce();
    });

    it('runs the finally handler when promise rejects', async () => {
        const callback = jest.fn();

        await expect(pFinally(Promise.reject(123), callback)).toReject();
        expect(callback).toHaveBeenCalledOnce();
    });

    it('rejects the promise if the finally handler throws', async () => {
        const callback = jest.fn().mockImplementation(() => {
            throw new Error('123');
        });

        await expect(pFinally(Promise.resolve(1), callback)).rejects.toThrowWithMessage(Error, '123');
    });

    it('rejects the promise if the finally handler returns a rejected promise', async () => {
        const callback = jest.fn().mockRejectedValue(123);

        await expect(pFinally(Promise.resolve(1), callback)).rejects.toBe(123);
    });

    it('rejects the promise with the value of the rejected finally handler', async () => {
        const callback = jest.fn().mockRejectedValue(123);

        await expect(pFinally(Promise.reject(1), callback)).rejects.toBe(123);
    });
});
