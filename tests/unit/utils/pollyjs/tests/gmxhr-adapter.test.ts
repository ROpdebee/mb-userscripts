import path from 'node:path';

import { setupPolly } from 'setup-polly-jest';

import GMXHRAdapter from '@test-utils/pollyjs/gmxhr-adapter';

import { WarcPersister } from '../warc-persister';

describe('gmxhr adapter', () => {
    // eslint-disable-next-line jest/require-hook
    setupPolly({
        adapters: [GMXHRAdapter],
        recordIfMissing: true,
        persister: WarcPersister,
        persisterOptions: {
            'fs-warc': {
                recordingsDirectory: path.resolve('.', 'tests', 'test-data', '__recordings__'),
            },
        },
    });

    it('should work', async () => {
        const response = await new Promise<GM.Response<never>>((resolve) => {
            GM.xmlHttpRequest({
                url: 'https://jsonplaceholder.typicode.com/posts/1',
                method: 'GET',
                onload: resolve,
            } as GM.Request<never>);
        });

        expect(response.status).toBe(200);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(JSON.parse(response.responseText).id).toBe(1);
    });
});
