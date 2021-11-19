import { AbortedError, gmxhr, HTTPResponseError, NetworkError, TimeoutError } from '@lib/util/xhr';
import { mockGMxmlHttpRequest } from '@test-utils/gm_mocks';

describe('gmxhr', () => {
    const stubResponse = {} as unknown as GM.Response<never>;

    beforeEach(() => {
        mockGMxmlHttpRequest.mockImplementation(() => ({} as unknown as GM.Response<never>));
    });

    afterEach(() => {
        mockGMxmlHttpRequest.mockClear();
    });

    it('resolves on load', async () => {
        mockGMxmlHttpRequest.mockImplementation((options) => options.onload?.(stubResponse));

        await expect(gmxhr('test')).resolves.toBe(stubResponse);
    });

    it('rejects on error', async () => {
        mockGMxmlHttpRequest.mockImplementation((options) => options.onerror?.(stubResponse));

        await expect(gmxhr('test')).rejects.toBeInstanceOf(NetworkError);
    });

    it('rejects on timeout', async () => {
        mockGMxmlHttpRequest.mockImplementation((options) => options.ontimeout?.(stubResponse));

        await expect(gmxhr('test')).rejects.toBeInstanceOf(TimeoutError);
    });

    it('rejects on abort', async () => {
        mockGMxmlHttpRequest.mockImplementation((options) => options.onabort?.(stubResponse));

        await expect(gmxhr('test')).rejects.toBeInstanceOf(AbortedError);
    });

    it('rejects on HTTP error', async () => {
        expect.assertions(2);

        mockGMxmlHttpRequest.mockImplementation((options) => options.onload?.({
            status: 400,
            statusText: 'Bad request',
        } as unknown as GM.Response<never>));
        const res = gmxhr('test');

        await expect(res).rejects.toBeInstanceOf(HTTPResponseError);
        await expect(res).rejects.toMatchObject({ statusCode: 400, statusText: 'Bad request'});
    });

    it('uses GET by default', async () => {
        mockGMxmlHttpRequest.mockImplementation((options) => options.onload?.(stubResponse));
        await gmxhr('test');

        expect(mockGMxmlHttpRequest).toHaveBeenCalledOnce();
        expect(mockGMxmlHttpRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'GET' }));
    });

    it('allows overriding HTTP method', async () => {
        mockGMxmlHttpRequest.mockImplementation((options) => options.onload?.(stubResponse));
        await gmxhr('test', { method: 'POST' });

        expect(mockGMxmlHttpRequest).toHaveBeenCalledOnce();
        expect(mockGMxmlHttpRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'POST' }));
    });

    it('accepts string URLs', async () => {
        mockGMxmlHttpRequest.mockImplementation((options) => options.onload?.(stubResponse));
        await gmxhr('https://example.com/test?x=1#y');

        expect(mockGMxmlHttpRequest).toHaveBeenCalledOnce();
        expect(mockGMxmlHttpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://example.com/test?x=1#y' }));
    });

    it('accepts URL URLs', async () => {
        mockGMxmlHttpRequest.mockImplementation((options) => options.onload?.(stubResponse));
        await gmxhr(new URL('https://example.com/test?x=1#y'));

        expect(mockGMxmlHttpRequest).toHaveBeenCalledOnce();
        expect(mockGMxmlHttpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://example.com/test?x=1#y' }));
    });

});
