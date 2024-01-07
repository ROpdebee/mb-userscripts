import { safeParseJSON } from '@lib/util/json';

describe('safe JSON parsing', () => {
    it('returns parsed JSON if valid', () => {
        const jsonText = '{"hello": ["world", "test"]}';
        const result = safeParseJSON<Record<string, string[]>>(jsonText);

        expect(result).toStrictEqual({ hello: ['world', 'test'] });
    });

    it('returns undefined on invalid JSON', () => {
        const result = safeParseJSON('{"""}');

        expect(result).toBeUndefined();
    });

    it('throws on invalid JSON if custom message is set', () => {
        expect(() => safeParseJSON('{"""}', 'custom message'))
            .toThrowWithMessage(Error, /custom message/);
    });
});
