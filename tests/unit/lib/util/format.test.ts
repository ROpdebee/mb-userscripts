import { formatFileSize } from '@lib/util/format';

describe('formatting size', () => {
    it('formats small sizes', () => {
        expect(formatFileSize(123)).toBe('123 B');
    });

    it('formats larger sizes', () => {
        expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('formats larger, non-round sizes', () => {
        expect(formatFileSize(123049392)).toBe('117.35 MB');
    });

    it('formats empty size', () => {
        expect(formatFileSize(0)).toBe('0 B');
    });
});
