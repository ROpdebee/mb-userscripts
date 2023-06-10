import { urlBasename, urlJoin } from '@lib/util/urls';

describe('url basename', () => {
    const cases: Array<[string, string, string]> = [
        ['with single path', 'https://example.com/basename', 'basename'],
        ['with multiple paths', 'https://example.com/some/path', 'path'],
        ['with multiple paths and other parts', 'https://example.com/some/path?x=123#anchor', 'path'],
        ['without path', 'https://example.com/', ''],
    ];

    it.each(cases)('extracts basename from string URLs %s', (_1, url, expected) => {
        expect(urlBasename(url)).toBe(expected);
    });

    it.each(cases)('extracts basename from URL objects %s', (_1, url, expected) => {
        expect(urlBasename(new URL(url))).toBe(expected);
    });

    it('extracts basename from string URLs without path with default', () => {
        expect(urlBasename('https://example.com/', 'image')).toBe('image');
    });

    it('extracts basename from URL objects without path with default', () => {
        expect(urlBasename(new URL('https://example.com/'), 'image')).toBe('image');
    });

    it('extracts basename from string URLs with path with default', () => {
        expect(urlBasename('https://example.com/path', 'image')).toBe('path');
    });

    it('extracts basename from URL objects with path with default', () => {
        expect(urlBasename(new URL('https://example.com/path'), 'image')).toBe('path');
    });
});

describe('url join', () => {
    const cases: Array<[string, string[], string]> = [
        ['without extra paths', [], ''],
        ['with one extra path', ['hello'], 'hello'],
        ['with multiple extra paths', ['hello', 'world'], 'hello/world'],
    ];

    it.each(cases)('joins string URLs without subpath %s', (_1, paths, expected) => {
        expect(urlJoin('https://example.com/', ...paths)).toStrictEqual(new URL(`https://example.com/${expected}`));
    });

    it.each(cases)('joins URL objects without subpath %s', (_1, paths, expected) => {
        expect(urlJoin(new URL('https://example.com/'), ...paths)).toStrictEqual(new URL(`https://example.com/${expected}`));
    });

    it.each(cases)('joins string URLs with subpath %s', (_1, paths, expected) => {
        expect(urlJoin('https://example.com/test', ...paths)).toStrictEqual(new URL(`https://example.com/test/${expected}`));
    });

    it.each(cases)('joins URL objects with subpath %s', (_1, paths, expected) => {
        expect(urlJoin(new URL('https://example.com/test'), ...paths)).toStrictEqual(new URL(`https://example.com/test/${expected}`));
    });
});
