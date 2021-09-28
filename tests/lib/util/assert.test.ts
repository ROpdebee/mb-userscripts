import { assert, assertDefined, assertHasValue, AssertionError, assertNonNull } from '@lib/util/assert';

describe('assert', () => {
    it('throws on false condition', () => {
        expect(() => {
            assert(-1 > 0);
        }).toThrow(AssertionError);
    });

    it('does not throw on true conditions', () => {
        expect(() => {
            assert(-1 < 0);
        }).not.toThrow(AssertionError);
    });
});

describe('assertNonNull', () => {
    it('throws on null values', () => {
        expect(() => {
            assertNonNull(null);
        }).toThrow(AssertionError);
    });

    it('does not throw on undefined values', () => {
        expect(() => {
            assertNonNull(undefined);
        }).not.toThrow(AssertionError);
    });

    it.each`
        value
        ${''}
        ${true}
        ${false}
        ${'test'}
    `('does not throw on truthy values ($value)', ({value}) => {
        expect(() => {
            assertNonNull(value);
        }).not.toThrow(AssertionError);
    });
});

describe('assertDefined', () => {
    it('throws on undefined values', () => {
        expect(() => {
            assertDefined(undefined);
        }).toThrow(AssertionError);
    });

    it('does not throw on null values', () => {
        expect(() => {
            assertDefined(null);
        }).not.toThrow(AssertionError);
    });

    it.each`
        value
        ${''}
        ${true}
        ${false}
        ${'test'}
    `('does not throw on truthy values ($value)', ({value}) => {
        expect(() => {
            assertDefined(value);
        }).not.toThrow(AssertionError);
    });
});

describe('assertHasValue', () => {
    it('throws on undefined values', () => {
        expect(() => {
            assertHasValue(undefined);
        }).toThrow(AssertionError);
    });

    it('throws on null values', () => {
        expect(() => {
            assertHasValue(null);
        }).toThrow(AssertionError);
    });

    it.each`
        value
        ${''}
        ${true}
        ${false}
        ${'test'}
    `('does not throw on truthy values ($value)', ({value}) => {
        expect(() => {
            assertHasValue(value);
        }).not.toThrow(AssertionError);
    });
});

