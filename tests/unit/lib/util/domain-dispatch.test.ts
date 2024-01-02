import { DispatchMap } from '@lib/util/domain-dispatch';

describe('domain dispatcher', () => {
    let dispatcher: DispatchMap<number>;

    beforeEach(() => {
        dispatcher = new DispatchMap();
    });

    const invalidPatterns = [
        'test.*.domain.com',
        'domain.*',
        '*',
        'sub*.domain.com',
        '*.com',
        'sub.*.com',
        '*.co.uk',  // .co.uk is a TLD
    ];

    it.each(invalidPatterns)('rejects invalid patterns like %s', (pattern) => {
        expect(() => dispatcher.set(pattern, 0))
            .toThrowWithMessage(Error, 'Invalid pattern: ' + pattern);
    });

    const matchCases: Array<[string, string]> = [
        ['*.example.com', 'sub.example.com'],
        ['*.example.com', 'example.com'],
        ['*.example.com', 'sub1.sub2.example.com'],
        ['example.com', 'example.com'],
        ['sub.example.com', 'sub.example.com'],
    ];

    it.each(matchCases)('matches %s to %s', (pattern, target) => {
        dispatcher.set(pattern, 0);

        expect(dispatcher.get(target)).toBe(0);
    });

    const noMatchCases: Array<[string, string]> = [
        ['*.example.com', 'otherexample.com'],
        ['example.com', 'sub.example.com'],
        ['sub.example.com', 'example.com'],
        ['sub.example.com', 'sub1.sub.example.com'],
        ['sub1.example.com', 'sub.example.com'],
    ];

    it.each(noMatchCases)('does not match %s to %s', (pattern, target) => {
        dispatcher.set(pattern, 0);

        expect(dispatcher.get(target)).toBeUndefined();
    });

    it('supports concrete and wildcard patterns in parallel', () => {
        dispatcher.set('*.example.com', 0);
        dispatcher.set('sub.example.com', 1);
        dispatcher.set('example.com', 2);

        expect(dispatcher.get('example.com')).toBe(2);
        expect(dispatcher.get('sub.example.com')).toBe(1);
        expect(dispatcher.get('other.example.com')).toBe(0);
    });

    const matchConflictsCases: Array<[string[], string, number]> = [
        [['*.example.com', 'example.com'], 'example.com', 1],
        [['example.com', '*.example.com'], 'example.com', 0],
        [['sub.example.com', '*.example.com'], 'sub.example.com', 0],
        [['*.example.com', 'sub.example.com'], 'sub.example.com', 1],
        [['sub.example.com', '*.example.com'], 'a.sub.example.com', 1],
        [['*.sub.example.com', '*.example.com'], 'a.sub.example.com', 0],
        [['*.sub.example.com', '*.example.com'], 'sub.example.com', 0],
    ];

    it.each(matchConflictsCases)('uses most specific match if multiple are available', (patterns, target, expectedIdx) => {
        patterns.forEach((pattern, idx) => dispatcher.set(pattern, idx));

        expect(dispatcher.get(target)).toBe(expectedIdx);
    });
});
