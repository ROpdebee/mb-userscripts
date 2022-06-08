import { parseVersion, versionLessThan } from '@lib/util/versions';

describe('parsing versions', () => {
    it('parses versions', () => {
        expect(parseVersion('1.2.3')).toStrictEqual([1, 2, 3]);
    });

    it('parses long versions', () => {
        expect(parseVersion('1.2.3.4')).toStrictEqual([1, 2, 3, 4]);
    });

    it('parses multi-digit versions', () => {
        expect(parseVersion('2022.6.7')).toStrictEqual([2022, 6, 7]);
    });
});

describe('comparing versions', () => {
    it('does not consider same version to be less-than', () => {
        expect(versionLessThan([1, 2, 3], [1, 2, 3])).toBeFalse();
    });

    const cases = [
        ['1.2.3', '1.2.4'],
        ['1.2.3', '1.2.3.4'],
        ['1.2.3', '1.3.0'],
        ['1.2.3', '2.0.0'],
        ['2022.2.1', '2022.6.7'],
    ];

    it.each(cases)('considers %s to be older than %s', (v1s, v2s) => {
        const v1 = parseVersion(v1s);
        const v2 = parseVersion(v2s);

        expect(versionLessThan(v1, v2)).toBeTrue();
        expect(versionLessThan(v2, v1)).toBeFalse();
    });
});
