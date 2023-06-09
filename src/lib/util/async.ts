/**
 * Asynchronous utilities.
 */

import { LOGGER } from '@lib/logging/logger';

/**
 * Create a promise which sleeps and resolves after a certain time.
 *
 * @param      {number}         ms      The time to sleep, in milliseconds. If
 *                                      0 or undefined, resolve on next tick.
 * @return     {Promise<void>}  Promise which resolves after sleeping.
 */
export function asyncSleep(ms?: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an asynchronous function.
 *
 * @param      {(()=>T|Promise<T>)}  fn         The function to retry.
 * @param      {number}              times      The number of times to retry.
 * @param      {number}              retryWait  The amount of time to wait
 *                                              between retries, in ms.
 * @return     {Promise<T>}          Promise resolving to the result of the
 *                                   successful invocation of `fn`, or rejects
 *                                   after all retries have been exhausted.
 */
export function retryTimes<T>(fn: () => T | Promise<T>, times: number, retryWait: number): Promise<T> {
    if (times <= 0) {
        return Promise.reject(new TypeError(`Invalid number of retry times: ${times}`));
    }

    async function createTryPromise(triesLeft: number): Promise<T> {
        try {
            // Need to await if the provided function returns a promise, we
            // want to catch if the promise fails. If it doesn't return a
            // promise, await does nothing.
            return await fn();
        } catch (err) {
            // If we failed the last attempt, the whole thing fails.
            if (triesLeft <= 1) throw err;

            // Return a new promise after sleeping. Because of chaining, the
            // state of our current promise will be the state of this new
            // promise after it settles.
            return asyncSleep(retryWait)
                .then(() => createTryPromise(triesLeft - 1));
        }
    }

    return createTryPromise(times);
}


/**
 * Ignore but log the failure of a promise.
 *
 * @param      {Promise<unknown>}  promise  The promise to observe.
 * @param      {string}            message  The message to log.
 */
export function logFailure(promise: Promise<unknown>, message = 'An error occurred'): void {
    promise.catch((err) => {
        LOGGER.error(message, err);
    });
}

/**
 * Polyfill for Promise.prototype.finally.
 *
 * @param      {Promise<T>}                  promise    The promise to observe.
 * @param      {(()=>(void|Promise<void>))}  onFinally  Callback to execute in
 *                                                      the finally block.
 * @return     {Promise<T>}                  Promise which resolves with the
 *                                           original promise's value.
 */
export async function pFinally<T>(promise: Promise<T>, onFinally: () => (void | Promise<void>)): Promise<T> {
    try {
        return await promise;
    } finally {
        await onFinally();
    }
}
