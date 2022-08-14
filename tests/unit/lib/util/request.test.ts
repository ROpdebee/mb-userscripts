import NodeHttpAdapter from '@pollyjs/adapter-node-http';

import { LOGGER } from '@lib/logging/logger';
import { AbortedError, HTTPResponseError, NetworkError, request, RequestBackend, TimeoutError } from '@lib/util/request';
import { loggingObserver } from '@lib/util/request/observers';
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

    beforeEach(() => {
        // Set up pollyjs so we reuse the same recordings for requests that
        // we're making multiple times.
        const server = pollyContext.polly.server;
        server
            .get(httpBinHelloWorldUrl)
            // FIXME: We need to keep recordings for GMXHR contentType separate.
            // The recordings for arraybuffer and blob are encoded as Base64,
            // and the pollyjs GMXHR adapter needs that information to return
            // the correct response. We should fix the adapter to not require
            // a specific encoding. If we reuse the recordings for these, the
            // adapter will return a response with `responseText` even though
            // the `contentType` is set to `blob` or `arraybuffer`.
            .filter((req) => !req.recordingName.includes('gmxhr backend/supports'))
            .recordingName('request/hello world');
        server
            .get('https://httpbin.org/json')
            .recordingName('request/json');
        server
            .get('https://httpbin.org/status/404')
            .recordingName('request/status 404');
        server
            .get('https://httpbin.org/status/200')
            .recordingName('request/status 200');
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

    describe.each([['fetch', RequestBackend.FETCH], ['gmxhr', RequestBackend.GMXHR]])('%s backend response headers', (_1, backend) => {
        beforeEach(() => {
            // Mock response headers to ease testing.
            pollyContext.polly.server.any('https://fake.com/headers').intercept((_req, res) => {
                res.setHeader('test', 'test header');
                res.setHeader('test2', ['multiple', 'values']);
                res.sendStatus(200);
            });
        });

        it('gets single-valued header correctly', async () => {
            const resp = await request.get('https://fake.com/headers', { backend });

            expect(resp.headers.get('test')).toBe('test header');
        });

        it('gets multi-valued header correctly', async () => {
            const resp = await request.get('https://fake.com/headers', { backend });

            expect(resp.headers.get('test2')).toBe('multiple,values');
        });

        it('returns null for non-existant header', async () => {
            const resp = await request.get('https://fake.com/headers', { backend });

            expect(resp.headers.get('test3')).toBeNull();
        });

        it.each(['test', 'test2'])('contains header %s', async (headerName) => {
            const resp = await request.get('https://fake.com/headers', { backend });

            expect(resp.headers.has(headerName)).toBeTrue();
        });

        it('calls forEach callback function for each header', async () => {
            const resp = await request.get('https://fake.com/headers', { backend });
            const cb = jest.fn();

            // eslint-disable-next-line unicorn/no-array-callback-reference
            resp.headers.forEach(cb);

            // Called 3 times because there's also a content-type header.
            expect(cb).toHaveBeenCalledTimes(3);
            expect(cb).toHaveBeenCalledWith('test header', 'test', resp.headers);
            expect(cb).toHaveBeenCalledWith('multiple,values', 'test2', resp.headers);
        });
    });

    describe('observers', () => {
        const fakeObserver = {
            onStarted: jest.fn(),
            onFailed: jest.fn(),
            onSuccess: jest.fn(),
        };

        beforeAll(() => {
            request.addObserver(fakeObserver);
        });

        beforeEach(() => {
            fakeObserver.onStarted.mockReset();
            fakeObserver.onFailed.mockReset();
            fakeObserver.onSuccess.mockReset();
        });

        it('notifies onStarted', async () => {
            await request.get('https://httpbin.org/status/200');

            expect(fakeObserver.onStarted).toHaveBeenCalledOnce();
        });

        it('notifies onSuccess on success', async () => {
            await request.get('https://httpbin.org/status/200');

            expect(fakeObserver.onSuccess).toHaveBeenCalledOnce();
            expect(fakeObserver.onFailed).not.toHaveBeenCalled();
        });

        it('notifies onFailure on errors', async () => {
            pollyContext.polly.configure({
                recordFailedRequests: true,
            });

            await expect(request.get('https://httpbin.org/status/404')).toReject();

            expect(fakeObserver.onFailed).toHaveBeenCalledOnce();
            expect(fakeObserver.onSuccess).not.toHaveBeenCalled();
        });
    });

    describe('logging observer', () => {
        const debugSpy = jest.spyOn(LOGGER, 'debug');

        beforeAll(() => {
            // This will remain attached after these tests are finished because
            // we can't remove observers at this time. It's not a problem though.
            request.addObserver(loggingObserver);
        });

        beforeEach(() => {
            debugSpy.mockClear();
        });

        it('logs when request started', async () => {
            await request.get('https://httpbin.org/status/200');

            // Should've been called multiple times.
            expect(debugSpy).toHaveBeenNthCalledWith(1, 'GET https://httpbin.org/status/200 - STARTED (backend: 2)');
        });

        it('notifies onSuccess on success', async () => {
            await request.get('https://httpbin.org/status/200');

            expect(debugSpy).toHaveBeenLastCalledWith('GET https://httpbin.org/status/200 - SUCCESS (code 200)');
        });

        it('notifies onFailure on errors', async () => {
            pollyContext.polly.configure({
                recordFailedRequests: true,
            });

            await expect(request.get('https://httpbin.org/status/404')).toReject();

            expect(debugSpy).toHaveBeenLastCalledWith('GET https://httpbin.org/status/404 - FAILED (HTTPResponseError: HTTP error 404: Not Found)');
        });
    });
});
