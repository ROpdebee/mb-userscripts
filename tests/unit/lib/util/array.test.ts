import { collatedSort, enumerate, filterNonNull, findRight, groupBy, insertBetween } from '@lib/util/array';

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

describe('collated sort', () => {
    it('does not sort empty array', () => {
        expect(collatedSort([])).toStrictEqual([]);
    });

    it('sorts array of one element', () => {
        expect(collatedSort(['1'])).toStrictEqual(['1']);
    });

    it('sorts array of multiple text elements', () => {
        expect(collatedSort(['world', 'hello', 'test'])).toStrictEqual(['hello', 'test', 'world']);
    });

    it('properly sorts numeric text values', () => {
        expect(collatedSort(['1', '10', '2', '1001'])).toStrictEqual(['1', '2', '10', '1001']);
    });

    it('properly sorts text and numeric values', () => {
        expect(collatedSort(['B3', 'A2', 'A1', '1'])).toStrictEqual(['1', 'A1', 'A2', 'B3']);
    });
});

describe('enumerate', () => {
    it('handles empty arrays', () => {
        expect(enumerate([])).toStrictEqual([]);
    });

    it('handles arrays of one element', () => {
        expect(enumerate(['abc'])).toStrictEqual([['abc', 0]]);
    });

    it('handles arrays of multiple elements', () => {
        expect(enumerate(['abc', 'def', 'ghi'])).toStrictEqual([['abc', 0], ['def', 1], ['ghi', 2]]);
    });
});

describe('insert between', () => {
    describe('with literal element', () => {
        it('does not insert elements in empty array', () => {
            const result = insertBetween([], 0);

            expect(result).toBeArrayOfSize(0);
        });

        it('does not insert elements in array of one element', () => {
            const result = insertBetween([1], 0);

            expect(result).toStrictEqual([1]);
        });

        it('does inserts elements in array of more than one element', () => {
            const result = insertBetween([1, 2, 3], 0);

            expect(result).toStrictEqual([1, 0, 2, 0, 3]);
        });
    });

    describe('with factory', () => {
        let counter: number;

        function factory(): number {
            return counter++;
        }

        beforeEach(() => {
            counter = 0;
        });

        it('does not insert elements in empty array', () => {
            const result = insertBetween([], factory);

            expect(result).toBeArrayOfSize(0);
        });

        it('does not insert elements in array of one element', () => {
            const result = insertBetween([1], factory);

            expect(result).toStrictEqual([1]);
        });

        it('does inserts elements in array of more than one element', () => {
            const result = insertBetween([1, 2, 3], factory);

            expect(result).toStrictEqual([1, 0, 2, 1, 3]);
        });
    });
});
