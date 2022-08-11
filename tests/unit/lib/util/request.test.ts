import NodeHttpAdapter from '@pollyjs/adapter-node-http';

import { AbortedError, HTTPResponseError, NetworkError, request, RequestBackend, TimeoutError } from '@lib/util/request';
import { mockGMxmlHttpRequest } from '@test-utils/gm_mocks';
import { mockFetch, setupPolly } from '@test-utils/pollyjs';
import GMXHRAdapter from '@test-utils/pollyjs/gmxhr-adapter';

const pollyContext = setupPolly({
    adapters: [GMXHRAdapter, NodeHttpAdapter],
});

describe('request', () => {
    const httpBinHelloWorldUrl = 'https://httpbin.org/base64/aGVsbG8gd29ybGQ=';
    const responseTypeCases = [
        ['text', 'text', 'hello world'],
        ['blob', 'blob', new Blob(['hello world'])],
        ['arraybuffer', 'arrayBuffer', new TextEncoder().encode('hello world').buffer],
    ] as const;

    beforeAll(() => {
        mockFetch();
    });

    describe.each([['fetch', RequestBackend.FETCH], ['gmxhr', RequestBackend.GMXHR]])('%s backend', (_1, backend) => {
        it.each(responseTypeCases)('supports %s responseType requests', async (responseType, property, expectedValue) => {
            const response = await request.get(httpBinHelloWorldUrl, {
                responseType,
                backend,
            });

            expect(response).toHaveProperty(property, expectedValue);
        });

        it('defaults to textual responses', async () => {
            const response = await request.get(httpBinHelloWorldUrl, {
                backend,
            });

            expect(response).toHaveProperty('text', 'hello world');
        });

        it('includes JSON parser in textual responses', async () => {
            const response = await request.get('https://httpbin.org/json', {
                backend,
            });

            expect(response.json()).toBeDefined();
        });

        it('accepts URL input', async () => {
            const response = await request.get(new URL(httpBinHelloWorldUrl), {
                backend,
            });

            expect(response).toHaveProperty('text', 'hello world');
        });
    });

    describe('gmxhr backend', () => {
        const stubResponse = {} as unknown as GM.Response<never>;

        it('rejects on error', async () => {
            mockGMxmlHttpRequest.mockImplementation((options) => options.onerror?.(stubResponse));

            await expect(request.get('test', { backend: RequestBackend.GMXHR })).rejects.toBeInstanceOf(NetworkError);
        });

        it('rejects on timeout', async () => {
            mockGMxmlHttpRequest.mockImplementation((options) => options.ontimeout?.(stubResponse));

            await expect(request.get('test', { backend: RequestBackend.GMXHR })).rejects.toBeInstanceOf(TimeoutError);
        });

        it('rejects on abort', async () => {
            mockGMxmlHttpRequest.mockImplementation((options) => options.onabort?.(stubResponse));

            await expect(request.get('test', { backend: RequestBackend.GMXHR })).rejects.toBeInstanceOf(AbortedError);
        });

        it('emits progress events', async () => {
            const resp1 = {
                ...stubResponse,
                lengthComputable: true,
                loaded: 1,
                total: 3,
            };
            const resp2 = {
                ...stubResponse,
                lengthComputable: true,
                loaded: 2,
                total: 3,
            };

            mockGMxmlHttpRequest.mockImplementation((options) => {
                options.onprogress?.(resp1);
                options.onprogress?.(resp2);
                options.onload?.(stubResponse);
            });
            const onProgress = jest.fn();

            await expect(request.get('test', { backend: RequestBackend.GMXHR, onProgress })).toResolve();
            expect(onProgress).toHaveBeenCalledTimes(2);
            expect(onProgress).toHaveBeenNthCalledWith(1, resp1);
            expect(onProgress).toHaveBeenNthCalledWith(2, resp2);
        });
    });

    describe('frontend', () => {
        beforeEach(() => {
            pollyContext.polly.configure({
                recordFailedRequests: true,
            });
        });

        it('rejects on HTTP error by default', async () => {
            const resp = request.get('https://httpbin.org/status/404');

            await expect(resp).rejects.toBeInstanceOf(HTTPResponseError);
            await expect(resp).rejects.toMatchObject({ statusCode: 404 });
        });

        it('rejects with custom error text on HTTP errors', async () => {
            const resp = request.get('https://httpbin.org/status/404', {
                httpErrorMessages: {
                    404: 'Does not exist',
                },
            });

            await expect(resp).rejects.toBeInstanceOf(HTTPResponseError);
            await expect(resp).rejects.toMatchObject({ statusCode: 404, message: 'Does not exist' });
        });

        it('does not reject if disabled by caller', async () => {
            const resp = request.get('https://httpbin.org/status/404', {
                throwForStatus: false,
            });

            await expect(resp).toResolve();
        });
    });
});
