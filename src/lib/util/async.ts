// Asynchronous utilities

export function asyncTimeout(ms?: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retryTimes<T>(fn: () => T, times: number, retryWait: number): Promise<T> {
    if (times <= 0) {
        return Promise.reject(new TypeError('Invalid number of retry times: ' + times));
    }

    // We could've used asyncTimeout to simplify this a lot, but that would
    // require a lot of mixing of async code and timers, which makes testing
    // anything which uses this function very difficult.
    return new Promise((resolve, reject) => {
        function tryOnce(): void {
            try {
                resolve(fn());
            } catch (err) {
                if (--times > 0) return;
                reject(err);
            }
            // Stop looping if the function passed, or when it failed but tries
            // are exhausted. The early return in the catch clause prevents
            // this statement from executing if the tries aren't exhausted yet.
            clearInterval(interval);
        }

        const interval = setInterval(tryOnce, retryWait);
        // Manually calling the first try, the one in the interval will be first
        // called after the first wait period. If the call succeeds immediately,
        // the interval will be cleared before the first execution happens.
        tryOnce();
    });
}
