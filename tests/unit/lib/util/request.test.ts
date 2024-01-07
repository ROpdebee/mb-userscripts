import NodeHttpAdapter from '@pollyjs/adapter-node-http';

import { AbortedError, HTTPResponseError, NetworkError, request, RequestBackend, TimeoutError } from '@lib/util/request';
import { mockGMxmlHttpRequest } from '@test-utils/gm-mocks';
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
            const response1 = {
                ...stubResponse,
                lengthComputable: true,
                loaded: 1,
                total: 3,
            };
            const response2 = {
                ...stubResponse,
                lengthComputable: true,
                loaded: 2,
                total: 3,
            };

            mockGMxmlHttpRequest.mockImplementation((options) => {
                options.onprogress?.(response1);
                options.onprogress?.(response2);
                options.onload?.(stubResponse);
            });
            const onProgress = jest.fn();

            await expect(request.get('test', { backend: RequestBackend.GMXHR, onProgress })).toResolve();
            expect(onProgress).toHaveBeenCalledTimes(2);
            expect(onProgress).toHaveBeenNthCalledWith(1, response1);
            expect(onProgress).toHaveBeenNthCalledWith(2, response2);
        });
    });

    describe('frontend', () => {
        beforeEach(() => {
            pollyContext.polly.configure({
                recordFailedRequests: true,
            });
        });

        it('rejects on HTTP error by default', async () => {
            const response = request.get('https://httpbin.org/status/404');

            await expect(response).rejects.toBeInstanceOf(HTTPResponseError);
            await expect(response).rejects.toMatchObject({ statusCode: 404 });
        });

        it('rejects with custom error text on HTTP errors', async () => {
            const response = request.get('https://httpbin.org/status/404', {
                httpErrorMessages: {
                    404: 'Does not exist',
                },
            });

            await expect(response).rejects.toBeInstanceOf(HTTPResponseError);
            await expect(response).rejects.toMatchObject({ statusCode: 404, message: 'Does not exist' });
        });

        it('does not reject if disabled by caller', async () => {
            const response = request.get('https://httpbin.org/status/404', {
                throwForStatus: false,
            });

            await expect(response).toResolve();
        });
    });

    describe.each([['fetch', RequestBackend.FETCH], ['gmxhr', RequestBackend.GMXHR]])('%s backend response headers', (_1, backend) => {
        beforeEach(() => {
            // Mock response headers to ease testing.
            pollyContext.polly.server.any('https://fake.com/headers').intercept((_request, response) => {
                response.setHeader('test', 'test header');
                response.setHeader('test2', ['multiple', 'values']);
                response.sendStatus(200);
            });
        });

        it('gets single-valued header correctly', async () => {
            const response = await request.get('https://fake.com/headers', { backend });

            expect(response.headers.get('test')).toBe('test header');
        });

        it('gets multi-valued header correctly', async () => {
            const response = await request.get('https://fake.com/headers', { backend });

            expect(response.headers.get('test2')).toBe('multiple,values');
        });

        it('returns null for non-existant header', async () => {
            const response = await request.get('https://fake.com/headers', { backend });

            expect(response.headers.get('test3')).toBeNull();
        });

        it.each(['test', 'test2'])('contains header %s', async (headerName) => {
            const response = await request.get('https://fake.com/headers', { backend });

            expect(response.headers.has(headerName)).toBeTrue();
        });

        it('calls forEach callback function for each header', async () => {
            const response = await request.get('https://fake.com/headers', { backend });
            const callback = jest.fn();

            // eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-for-each
            response.headers.forEach(callback);

            // Called 3 times because there's also a content-type header.
            expect(callback).toHaveBeenCalledTimes(3);
            expect(callback).toHaveBeenCalledWith('test header', 'test', response.headers);
            expect(callback).toHaveBeenCalledWith('multiple,values', 'test2', response.headers);
        });
    });
});
