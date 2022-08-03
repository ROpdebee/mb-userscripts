import { pFinally } from './async';

interface ObservableSemaphoreCallbacks {
    onAcquired(): void;
    onReleased(): void;
}

/**
 * Semaphore-like observable counter to control access to resources depending
 * on whether operations are running.
 *
 * Note that this doesn't truly lock anything and a consumer does not "wait" for
 * the semaphore to be unlocked. Instead, a consumer passes two callbacks to be
 * called when the semaphore locks or unlocks.
 *
 * The number of calls to `release` should never exceed the number of calls to
 * `acquire`, but this property is not checked.
 *
 * Example:
 *   const sema = new ObservableSemaphore({
 *       onAcquired() { console.log('locked'); }
 *       onReleased() { console.log('unlocked'); }
 *   });
 *
 *   sema.acquire();
 *   // prints 'locked'
 *   sema.acquire();
 *   sema.release();
 *   // still locked
 *   sema.release();
 *   // prints 'unlocked'
 *
 *   sema.acquire();
 *   // prints 'locked' again.
 *
 */
export class ObservableSemaphore {
    private readonly onAcquired: () => void;
    private readonly onReleased: () => void;
    private counter = 0;

    /**
     * Initialise the instance.
     *
     * @param {ObservableSemaphoreCallbacks}  callbacks  State change callbacks.
     */
    public constructor({ onAcquired, onReleased }: ObservableSemaphoreCallbacks) {
        this.onAcquired = onAcquired;
        this.onReleased = onReleased;
    }

    /**
     * Acquire the lock: Increment the internal counter of held locks by one.
     *
     * Calls the `onAcquired` callback for the first acquisition only.
     */
    public acquire(): void {
        this.counter++;
        if (this.counter === 1) {
            // First time acquiring, switch state.
            this.onAcquired();
        }
    }

    /**
     * Release a previously-held lock: Decrement the internal counter by one.
     *
     * Calls the `onReleased` callback if no more locks are held past this point.
     * Must not be called without an accompanying `acquire()` call previously!
     */
    public release(): void {
        this.counter--;
        if (this.counter === 0) {
            // All locks released, switch state.
            this.onReleased();
        }
    }

    /**
     * Run a function in a "critical section", automatically acquiring a lock
     * before running it, and releasing it afterwards. Locks will be released
     * on error. If the runnable returns a promise, the promise will not be
     * awaited but a handler will be added to release the lock after it does.
     *
     * @param      {()=>T}  runnable  The runnable.
     * @return     {T}      Result of the runnable.
     */
    public runInSection<T>(runnable: () => Promise<T>): Promise<T>;
    public runInSection<T>(runnable: () => T): T;
    public runInSection<T>(runnable: () => T | Promise<T>): T | Promise<T> {
        this.acquire();
        let result: T | Promise<T> | undefined;

        try {
            result = runnable();
            return result;
        } finally {
            if (result instanceof Promise) {
                // If the function returned a promise, we shouldn't release the
                // lock just yet, and instead wait until the promise has settled.
                pFinally(result, this.release.bind(this))
                    // Also need to catch this one to prevent uncaught exceptions,
                    // since this chain is "detached" from the one we return.
                    // The one we return will reject separately.
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    .catch(() => {});
            } else {
                this.release();
            }
        }
    }
}
