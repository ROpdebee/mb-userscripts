import { ObservableSemaphore } from '@lib/util/observable';

describe('observable semaphores', () => {
    const callbacks = {
        onAcquired: jest.fn(),
        onReleased: jest.fn(),
    };

    beforeEach(() => {
        callbacks.onAcquired.mockClear();
        callbacks.onReleased.mockClear();
    });

    it('should call onAcquired when acquiring the first time', () => {
        const sema = new ObservableSemaphore(callbacks);
        sema.acquire();

        expect(callbacks.onAcquired).toHaveBeenCalledOnce();
    });

    it('should call onReleased when releasing all locks', () => {
        const sema = new ObservableSemaphore(callbacks);
        sema.acquire();
        sema.release();

        expect(callbacks.onReleased).toHaveBeenCalledOnce();
    });

    it('should not call onAcquired a second time before released', () => {
        const sema = new ObservableSemaphore(callbacks);
        sema.acquire();
        sema.acquire();

        expect(callbacks.onAcquired).toHaveBeenCalledOnce();
    });

    it('should not call onReleased when locks are still held', () => {
        const sema = new ObservableSemaphore(callbacks);
        sema.acquire();
        sema.acquire();
        sema.release();

        expect(callbacks.onReleased).not.toHaveBeenCalled();
    });

    it('should allow multiple lock-unlock phases', () => {
        const sema = new ObservableSemaphore(callbacks);
        sema.acquire();
        sema.release();

        expect(callbacks.onAcquired).toHaveBeenCalledTimes(1);
        expect(callbacks.onReleased).toHaveBeenCalledTimes(1);

        sema.acquire();

        expect(callbacks.onAcquired).toHaveBeenCalledTimes(2);
        expect(callbacks.onReleased).toHaveBeenCalledTimes(1);

        sema.release();

        expect(callbacks.onReleased).toHaveBeenCalledTimes(2);
    });

    describe('running sections', () => {
        it('should run the runnable', () => {
            const runnable = jest.fn();
            const sema = new ObservableSemaphore(callbacks);
            void sema.runInSection(runnable);

            expect(runnable).toHaveBeenCalledOnce();
        });

        it('should return the runnable result', () => {
            const runnable = jest.fn().mockReturnValue(123);
            const sema = new ObservableSemaphore(callbacks);

            expect(sema.runInSection(runnable)).toBe(123);
        });

        it('should acquire and release around the function', () => {
            expect.assertions(3);

            const sema = new ObservableSemaphore(callbacks);
            sema.runInSection(() => {
                expect(callbacks.onAcquired).toHaveBeenCalledOnce();
                expect(callbacks.onReleased).not.toHaveBeenCalled();
            });

            expect(callbacks.onReleased).toHaveBeenCalledOnce();
        });

        it('should release when the runnable throws', () => {
            const sema = new ObservableSemaphore(callbacks);

            expect(() => {
                sema.runInSection((): void => {
                    throw new Error('test');
                });
            }).toThrow('test');

            expect(callbacks.onReleased).toHaveBeenCalledOnce();
        });

        it('should acquire and release around async functions', async () => {
            expect.assertions(5);

            const sema = new ObservableSemaphore(callbacks);
            let resolver: (value: number) => void;
            const prom = sema.runInSection(() => {
                expect(callbacks.onAcquired).toHaveBeenCalledOnce();
                expect(callbacks.onReleased).not.toHaveBeenCalled();

                return new Promise<number>((resolve) => {
                    resolver = resolve;
                });
            });

            // Not resolved yet, so shouldn't be released yet.
            expect(callbacks.onReleased).not.toHaveBeenCalled();

            resolver!(123);

            await expect(prom).resolves.toBe(123);
            expect(callbacks.onReleased).toHaveBeenCalledOnce();
        });

        it('should release when the async runnable throws', async () => {
            expect.assertions(4);

            const sema = new ObservableSemaphore(callbacks);

            await expect(sema.runInSection(() => {
                expect(callbacks.onAcquired).toHaveBeenCalledOnce();
                expect(callbacks.onReleased).not.toHaveBeenCalled();

                return Promise.reject('test');
            })).toReject();
            expect(callbacks.onReleased).toHaveBeenCalledOnce();
        });
    });
});
