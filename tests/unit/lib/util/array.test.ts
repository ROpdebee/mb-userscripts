import { filterNonNull, findRight, groupBy, insertBetween } from '@lib/util/array';

describe('filtering null values', () => {
    it('retains non-null values', () => {
        expect(filterNonNull([1, 2, 3])).toStrictEqual([1, 2, 3]);
    });

    it('filters out null values', () => {
        expect(filterNonNull([1, null, 2])).toStrictEqual([1, 2]);
    });

    it('filters out multiple null values', () => {
        expect(filterNonNull([1, null, 2, null])).toStrictEqual([1, 2]);
    });

    it('returns empty array when only null', () => {
        expect(filterNonNull([null, null])).toStrictEqual([]);
    });

    it('filters out undefined values', () => {
        expect(filterNonNull([1, undefined, 2])).toStrictEqual([1, 2]);
    });
});

describe('finding from right', () => {
    it('finds rightmost element matching predicate', () => {
        expect(findRight([1, 2, 3], (i) => i < 5)).toBe(3);
    });

    it('finds rightmost element matching predicate, if it is first element', () => {
        expect(findRight([1, 2, 3], (i) => i <= 1)).toBe(1);
    });

    it('returns null when no item matches', () => {
        expect(findRight([1, 2, 3], (i) => i > 5)).toBeNull();
    });
});

describe('group by', () => {
    it('returns empty map for empty array', () => {
        expect(groupBy([], () => undefined, () => null)).toBeEmpty();
    });

    it('groups by key', () => {
        const arr = ['aa', 'ba', 'ca'];
        const result = groupBy(arr, (el) => el[0], (el) => el[1]);
        const expected = new Map([['a', ['a']], ['b', ['a']], ['c', ['a']]]);

        expect(result).toStrictEqual(expected);
    });

    it('groups multiple values', () => {
        const arr = ['aa', 'ba', 'ca'];
        const result = groupBy(arr, (el) => el[1], (el) => el[0]);
        const expected = new Map([['a', ['a', 'b', 'c']]]);

        expect(result).toStrictEqual(expected);
    });
});

describe('insert between', () => {
    it('returns empty array when given empty array', () => {
        expect(insertBetween([], 0)).toStrictEqual([]);
    });

    it('does not add elements for array with one element', () => {
        expect(insertBetween([1], 0)).toStrictEqual([1]);
    });

    it('adds element for array with multiple elements', () => {
        expect(insertBetween([1, 2, 3], 0)).toStrictEqual([1, 0, 2, 0, 3]);
    });
});
