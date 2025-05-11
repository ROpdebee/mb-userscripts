import { memoize } from '@lib/util/functions';

describe('memoization', () => {
    const function_ = jest.fn((a: string, b: string): string => a + ' ' + b);

    afterEach(() => {
        function_.mockClear();
    });

    it('performs first evaluation', () => {
        const memoizedFunction = memoize(function_);

        expect(memoizedFunction('hello', 'world')).toBe('hello world');

        expect(function_).toHaveBeenCalledOnce();
    });

    it('does not perform subsequent evaluation', () => {
        const memoizedFunction = memoize(function_);
        memoizedFunction('hello', 'universe');

        expect(memoizedFunction('hello', 'universe')).toBe('hello universe');

        expect(function_).toHaveBeenCalledOnce();
    });

    it('allows custom key functions', () => {
        const memoizedFunction = memoize(function_, (arguments_) => arguments_[0] + arguments_[1]);

        expect(memoizedFunction('hello', 'world')).toBe('hello world');
        expect(memoizedFunction('hello', 'universe')).toBe('hello universe');

        expect(function_).toHaveBeenCalledTimes(2);
    });
});
