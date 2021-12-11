import path from 'path';
import { setupPolly } from 'setup-polly-jest';
import FSPersister from '@pollyjs/persister-fs';

import GMXHRAdapter from '@test-utils/pollyjs/gmxhr-adapter';

describe('gmxhr adapter', () => {
    // eslint-disable-next-line jest/require-hook
    setupPolly({
        adapters: [GMXHRAdapter],
        recordIfMissing: true,
        persister: FSPersister,
        persisterOptions: {
            fs: {
                recordingsDir: path.resolve('.', 'tests', 'test-data', '__recordings__'),
            },
        },
    });

    it('should work', async () => {
        const resp = await new Promise<GM.Response<never>>((resolve) => {
            GM.xmlHttpRequest({
                url: 'https://jsonplaceholder.typicode.com/posts/1',
                method: 'GET',
                onload: resolve,
            } as GM.Request<never>);
        });

        expect(resp.status).toBe(200);
        expect(JSON.parse(resp.responseText).id).toBe(1);
    });
});
