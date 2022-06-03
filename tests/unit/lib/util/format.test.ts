import { formatSize } from '@lib/util/format';

describe('formatting size', () => {
    it('formats small sizes', () => {
        expect(formatSize(123)).toBe('123 B');
    });

    it('formats larger sizes', () => {
        expect(formatSize(1073741824)).toBe('1 GB');
    });

    it('formats larger, non-round sizes', () => {
        expect(formatSize(123049392)).toBe('117.35 MB');
    });

    it('formats empty size', () => {
        expect(formatSize(0)).toBe('0 B');
    });
});
