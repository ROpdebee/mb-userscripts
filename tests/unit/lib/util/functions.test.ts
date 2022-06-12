import { memoize } from '@lib/util/functions';

describe('memoization', () => {
    const fn = jest.fn((a: string, b: string): string => a + ' ' + b);

    afterEach(() => {
        fn.mockClear();
    });

    it('performs first evaluation', () => {
        const memoizedFn = memoize(fn);

        expect(memoizedFn('hello', 'world')).toBe('hello world');

        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('does not perform subsequent evaluation', () => {
        const memoizedFn = memoize(fn);
        memoizedFn('hello', 'universe');

        expect(memoizedFn('hello', 'universe')).toBe('hello universe');

        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('allows custom key functions', () => {
        const memoizedFn = memoize(fn, (args) => args[0] + args[1]);

        expect(memoizedFn('hello', 'world')).toBe('hello world');
        expect(memoizedFn('hello', 'universe')).toBe('hello universe');

        expect(fn).toHaveBeenCalledTimes(2);
    });
});
