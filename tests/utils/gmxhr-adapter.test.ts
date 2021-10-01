import path from 'path';
import { setupPolly } from 'setup-polly-jest';
import FSPersister from '@pollyjs/persister-fs';

import GMXHRAdapter from './gmxhr-adapter';

describe('gmxhr adapter', () => {
    const context = setupPolly({
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
        const resp = await new Promise<GMXMLHttpRequestResponse>((resolve) => {
            GM_xmlhttpRequest({
                url: 'https://jsonplaceholder.typicode.com/posts/1',
                method: 'GET',
                onload: resolve,
            });
        });

        expect(resp.status).toBe(200);
        expect(JSON.parse(resp.responseText).id).toBe(1);
    });

    it('should reuse recordings', async () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const requester = jest.spyOn(context.polly.adapters.get('GM_xmlhttpRequest')!, 'passthroughRequest');

        await new Promise<GMXMLHttpRequestResponse>((resolve) => {
            GM_xmlhttpRequest({
                url: 'https://jsonplaceholder.typicode.com/posts/1',
                method: 'GET',
                onload: resolve,
            });
        });

        expect(requester).not.toHaveBeenCalled();
    });
});
