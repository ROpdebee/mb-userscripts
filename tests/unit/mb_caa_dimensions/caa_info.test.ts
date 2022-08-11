import { getCAAInfo } from '@src/mb_caa_dimensions/caa_info';
import { setupPolly } from '@test-utils/pollyjs';

// eslint-disable-next-line jest/require-hook
setupPolly();

describe('getting CAA information', () => {
    it('returns size and format', async () => {
        const info = await getCAAInfo('mbid-e276296d-0e1a-40bb-ac14-7a95f1ca7ff0', '31558457789');

        expect(info.size).toBe(2_063_874);
        expect(info.fileType).toBe('JPEG');
    });

    it('throws when image is not found', async () => {
        await expect(getCAAInfo('mbid-e276296d-0e1a-40bb-ac14-7a95f1ca7ff0', 'test'))
            .rejects.toThrowWithMessage(Error, 'Could not find image "test" in IA manifest');
    });

    it('returns number of pages for PDF', async () => {
        const info = await getCAAInfo('mbid-32fc99ce-a5b5-48f9-88d3-5e59ac4cb747', '26538524366');

        expect(info.size).toBe(42_248_956);
        expect(info.fileType).toBe('Image Container PDF');
        expect(info.pageCount).toBe(11);
    });
});
