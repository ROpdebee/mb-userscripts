// Asynchronous utilities

import { LOGGER } from '@lib/logging/logger';

export function asyncSleep(ms?: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function retryTimes<T>(function_: () => Promise<T> | T, times: number, retryWait: number): Promise<T> {
    if (times <= 0) {
        return Promise.reject(new TypeError(`Invalid number of retry times: ${times}`));
    }

    async function createTryPromise(triesLeft: number): Promise<T> {
        try {
            // Need to await if the provided function returns a promise, we
            // want to catch if the promise fails. If it doesn't return a
            // promise, await does nothing.
            return await function_();
        } catch (error) {
            // If we failed the last attempt, the whole thing fails.
            if (triesLeft <= 1) throw error;

            // Return a new promise after sleeping. Because of chaining, the
            // state of our current promise will be the state of this new
            // promise after it settles.
            return asyncSleep(retryWait)
                .then(() => createTryPromise(triesLeft - 1));
        }
    }

    return createTryPromise(times);
}

// istanbul ignore next: Fine.
export function logFailure(message = 'An error occurred'): ((error: Error) => void) {
    return LOGGER.error.bind(LOGGER, message);
}

/**
 * Polyfill for Promise.prototype.finally.
 */
export async function pFinally<T>(promise: Promise<T>, onFinally: () => (Promise<void> | void)): Promise<T> {
    try {
        return await promise;
    } finally {
        await onFinally();
    }
}
