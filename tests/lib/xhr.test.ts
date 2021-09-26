import { gmxhr } from '@lib/util/xhr';

let mocked_GM_xhr = jest.fn() as jest.MockedFunction<typeof GM_xmlhttpRequest>;
global.GM_xmlhttpRequest = mocked_GM_xhr;

beforeEach(() => {
    mocked_GM_xhr.mockImplementation(() => ({} as any));
});

afterEach(() => {
    mocked_GM_xhr.mockClear();
});

describe('gmxhr', () => {
    const stubResponse = {} as unknown as GMXMLHttpRequestResponse;

    it('resolves on load', async () => {
        mocked_GM_xhr.mockImplementation((options) => options.onload?.(stubResponse));
        await expect(gmxhr({ url: 'test', method: 'GET' })).resolves.toBe(stubResponse);
    });

    it('rejects on error', async () => {
        mocked_GM_xhr.mockImplementation((options) => options.onerror?.(stubResponse));
        await expect(gmxhr({ url: 'test', method: 'GET'})).rejects.toEqual({'reason': 'network error', 'error': stubResponse});
    });

    it('rejects on timeout', async () => {
        mocked_GM_xhr.mockImplementation((options) => options.ontimeout?.(stubResponse));
        await expect(gmxhr({ url: 'test', method: 'GET'})).rejects.toEqual({'reason': 'timed out', 'error': stubResponse});
    });

    it('rejects on abort', async () => {
        mocked_GM_xhr.mockImplementation((options) => options.onabort?.(stubResponse));
        await expect(gmxhr({ url: 'test', method: 'GET'})).rejects.toEqual({'reason': 'aborted', 'error': stubResponse});
    });

    it('rejects on HTTP error', async () => {
        mocked_GM_xhr.mockImplementation((options) => options.onload?.({
            status: 400,
            statusText: 'Bad request',
        } as unknown as GMXMLHttpRequestResponse));
        await expect(gmxhr({ url: 'test', method: 'GET'})).rejects.toEqual({'reason': 'HTTP error Bad request', 'error': { status: 400, statusText: 'Bad request'}});
    });

});
