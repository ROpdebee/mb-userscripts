import { createMBRegex as mb } from '@lib/util/metadata';

describe('creating MB regexes', () => {
    it('should prefix MB domain', () => {
        // Need to remove surrounding slashes
        const pattern = new RegExp(mb`release/add`.slice(1, -1));

        expect(pattern.test('https://musicbrainz.org/release/add')).toBeTrue();
        expect(pattern.test('https://beta.musicbrainz.org/release/add')).toBeTrue();
        expect(pattern.test('https://musicbrainz.org/release/add?x=123')).toBeTrue();
        expect(pattern.test('https://musicbrainz.org/release/add?x=123#fragment')).toBeTrue();
        expect(pattern.test('https://musicbrainz.org/release/add#fragment')).toBeTrue();
        // eslint-disable-next-line jest/max-expects -- FIXME.
        expect(pattern.test('https://musicbrainz.org/release/add/123')).toBeFalse();
        // eslint-disable-next-line jest/max-expects -- FIXME.
        expect(pattern.test('https://musicbrainz.org/release/adda')).toBeFalse();
    });
});
