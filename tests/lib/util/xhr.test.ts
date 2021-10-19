import { AbortedError, gmxhr, HTTPResponseError, NetworkError, TimeoutError } from '@lib/util/xhr';

const mocked_GM_xhr = jest.fn() as jest.MockedFunction<typeof GM_xmlhttpRequest>;
global.GM_xmlhttpRequest = mocked_GM_xhr;

describe('gmxhr', () => {
    const stubResponse = {} as unknown as GMXMLHttpRequestResponse;

    beforeEach(() => {
        mocked_GM_xhr.mockImplementation(() => ({} as unknown as GMXMLHttpRequestResult));
    });

    afterEach(() => {
        mocked_GM_xhr.mockClear();
    });

    it('resolves on load', async () => {
        mocked_GM_xhr.mockImplementation((options) => options.onload?.(stubResponse));

        await expect(gmxhr('test')).resolves.toBe(stubResponse);
    });

    it('rejects on error', async () => {
        mocked_GM_xhr.mockImplementation((options) => options.onerror?.(stubResponse));

        await expect(gmxhr('test')).rejects.toBeInstanceOf(NetworkError);
    });

    it('rejects on timeout', async () => {
        mocked_GM_xhr.mockImplementation((options) => options.ontimeout?.(stubResponse));

        await expect(gmxhr('test')).rejects.toBeInstanceOf(TimeoutError);
    });

    it('rejects on abort', async () => {
        mocked_GM_xhr.mockImplementation((options) => options.onabort?.(stubResponse));

        await expect(gmxhr('test')).rejects.toBeInstanceOf(AbortedError);
    });

    it('rejects on HTTP error', async () => {
        expect.assertions(2);

        mocked_GM_xhr.mockImplementation((options) => options.onload?.({
            status: 400,
            statusText: 'Bad request',
        } as unknown as GMXMLHttpRequestResponse));
        const res = gmxhr('test');

        await expect(res).rejects.toBeInstanceOf(HTTPResponseError);
        await expect(res).rejects.toMatchObject({ statusCode: 400, statusText: 'Bad request'});
    });

    it('uses GET by default', async () => {
        mocked_GM_xhr.mockImplementation((options) => options.onload?.(stubResponse));
        await gmxhr('test');

        expect(mocked_GM_xhr).toHaveBeenCalledOnce();
        expect(mocked_GM_xhr).toHaveBeenCalledWith(expect.objectContaining({ method: 'GET' }));
    });

    it('allows overriding HTTP method', async () => {
        mocked_GM_xhr.mockImplementation((options) => options.onload?.(stubResponse));
        await gmxhr('test', { method: 'POST' });

        expect(mocked_GM_xhr).toHaveBeenCalledOnce();
        expect(mocked_GM_xhr).toHaveBeenCalledWith(expect.objectContaining({ method: 'POST' }));
    });

    it('accepts string URLs', async () => {
        mocked_GM_xhr.mockImplementation((options) => options.onload?.(stubResponse));
        await gmxhr('https://example.com/test?x=1#y');

        expect(mocked_GM_xhr).toHaveBeenCalledOnce();
        expect(mocked_GM_xhr).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://example.com/test?x=1#y' }));
    });

    it('accepts URL URLs', async () => {
        mocked_GM_xhr.mockImplementation((options) => options.onload?.(stubResponse));
        await gmxhr(new URL('https://example.com/test?x=1#y'));

        expect(mocked_GM_xhr).toHaveBeenCalledOnce();
        expect(mocked_GM_xhr).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://example.com/test?x=1#y' }));
    });

});
