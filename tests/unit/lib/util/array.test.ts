import { deduplicate, filterNonNull, findRight, groupBy, insertBetween, splitChunks } from '@lib/util/array';

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
        expect(findRight([1, 2, 3], (index) => index < 5)).toBe(3);
    });

    it('finds rightmost element matching predicate, if it is first element', () => {
        expect(findRight([1, 2, 3], (index) => index <= 1)).toBe(1);
    });

    it('returns null when no item matches', () => {
        expect(findRight([1, 2, 3], (index) => index > 5)).toBeNull();
    });
});

describe('group by', () => {
    it('returns empty map for empty array', () => {
        expect(groupBy([], () => undefined, () => null)).toBeEmpty();
    });

    it('groups by key', () => {
        const array = ['aa', 'ba', 'ca'];
        const result = groupBy(array, (element) => element[0], (element) => element[1]);
        const expected = new Map([['a', ['a']], ['b', ['a']], ['c', ['a']]]);

        expect(result).toStrictEqual(expected);
    });

    it('groups multiple values', () => {
        const array = ['aa', 'ba', 'ca'];
        const result = groupBy(array, (element) => element[1], (element) => element[0]);
        const expected = new Map([['a', ['a', 'b', 'c']]]);

        expect(result).toStrictEqual(expected);
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

describe('splitting chunks', () => {
    it('returns one chunk in case the array is smaller than the chunk size', () => {
        const result = splitChunks([1, 2, 3], 5);

        expect(result).toStrictEqual([[1, 2, 3]]);
    });

    it('returns the correct chunks when array needs to be split', () => {
        const result = splitChunks([1, 2, 3], 2);

        expect(result).toStrictEqual([[1, 2], [3]]);
    });

    it('returns the correct chunks when array length is a multiple of chunk size', () => {
        const result = splitChunks([1, 2, 3, 4], 2);

        expect(result).toStrictEqual([[1, 2], [3, 4]]);
    });

    it('returns the correct chunks when array length is equal to chunk size', () => {
        const result = splitChunks([1, 2, 3, 4], 4);

        expect(result).toStrictEqual([[1, 2, 3, 4]]);
    });
});

describe('deduplicate', () => {
    it('returns empty array for empty array', () => {
        expect(deduplicate([])).toStrictEqual([]);
    });

    it('returns same array for singleton array', () => {
        expect(deduplicate(['abc'])).toStrictEqual(['abc']);
    });

    it('returns same array for array without duplicates without changing order', () => {
        expect(deduplicate(['abc', 'def'])).toStrictEqual(['abc', 'def']);
        expect(deduplicate(['def', 'abc'])).toStrictEqual(['def', 'abc']);
    });

    it('removes repeated elements', () => {
        expect(deduplicate(['abc', 'abc'])).toStrictEqual(['abc']);
        expect(deduplicate(['def', 'abc', 'abc', 'ggg'])).toStrictEqual(['def', 'abc', 'ggg']);
    });

    it('removes non-consecutive repeated elements', () => {
        expect(deduplicate(['abc', 'def', 'abc'])).toStrictEqual(['abc', 'def']);
    });
});
