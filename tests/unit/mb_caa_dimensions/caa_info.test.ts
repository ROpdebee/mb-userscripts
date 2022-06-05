import NodeHttpAdapter from '@pollyjs/adapter-node-http';

import { getCAAInfo } from '@src/mb_caa_dimensions/caa_info';
import { mockFetch, setupPolly } from '@test-utils/pollyjs';

// eslint-disable-next-line jest/require-hook
setupPolly({
    adapters: [NodeHttpAdapter],
});

beforeAll(() => {
    mockFetch();
});

describe('getting CAA information', () => {
    it('returns size and format', async () => {
        const info = await getCAAInfo('mbid-e276296d-0e1a-40bb-ac14-7a95f1ca7ff0', 'mbid-e276296d-0e1a-40bb-ac14-7a95f1ca7ff0-31558457789.jpg');

        expect(info.size).toBe(2063874);
        expect(info.fileType).toBe('JPEG');
    });

    it('throws when image is not found', async () => {
        await expect(getCAAInfo('mbid-e276296d-0e1a-40bb-ac14-7a95f1ca7ff0', 'test'))
            .rejects.toThrowWithMessage(Error, 'Could not find image "test" in IA manifest');
    });
});
