import { filterNonNull, findRight } from '@lib/util/array';

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
