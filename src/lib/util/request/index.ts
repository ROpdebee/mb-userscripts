/* eslint-disable no-restricted-globals */

import type { RequestMethod, RequestOptions } from './requestOptions';
import type { Response, ResponseFor, TextResponse } from './response';
import { performFetchRequest } from './backendFetch';
import { performGMXHRRequest } from './backendGMXHR';
import { HTTPResponseError } from './errors';
import { RequestBackend } from './requestOptions';

export { AbortedError, HTTPResponseError, NetworkError, TimeoutError } from './errors';
export type { RequestMethod, RequestOptions } from './requestOptions';
export { RequestBackend } from './requestOptions';
export type { ArrayBufferResponse, BlobResponse, ProgressEvent, Response, TextResponse } from './response';


interface RequestFunc {
    <RequestOptionsT extends RequestOptions>(method: RequestMethod, url: string | URL, options: RequestOptionsT): Promise<ResponseFor<RequestOptionsT>>;
    (method: RequestMethod, url: string | URL): Promise<TextResponse>;

    get<RequestOptionsT extends RequestOptions>(url: string | URL, options: RequestOptionsT): Promise<ResponseFor<RequestOptionsT>>;
    get(url: string | URL): Promise<TextResponse>;

    post<RequestOptionsT extends RequestOptions>(url: string | URL, options: RequestOptionsT): Promise<ResponseFor<RequestOptionsT>>;
    post(url: string | URL): Promise<TextResponse>;

    head<RequestOptionsT extends RequestOptions>(url: string | URL, options: RequestOptionsT): Promise<ResponseFor<RequestOptionsT>>;
    head(url: string | URL): Promise<TextResponse>;
}

const hasGMXHR = (
    // @ts-expect-error GMv3 API.
    typeof GM_xmlHttpRequest !== 'undefined'
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-unnecessary-condition -- Might be using GMv3 API.
    || (typeof GM !== 'undefined' && GM.xmlHttpRequest !== undefined));

export const request: RequestFunc = async function (method: RequestMethod, url: string | URL, options?: RequestOptions) {
    // istanbul ignore next: Difficult to test.
    const backend = options?.backend ?? (hasGMXHR ? RequestBackend.GMXHR : RequestBackend.FETCH);
    const response = await performRequest(backend, method, url, options);

    const throwForStatus = options?.throwForStatus ?? true;
    if (throwForStatus && response.status >= 400) {
        throw new HTTPResponseError(url, response, options?.httpErrorMessages?.[response.status]);
    }

    return response;
} as RequestFunc;

request.get = request.bind(undefined, 'GET');
request.post = request.bind(undefined, 'POST');
request.head = request.bind(undefined, 'HEAD');

function performRequest(backend: RequestBackend, method: RequestMethod, url: string | URL, options?: RequestOptions): Promise<Response> {
    switch (backend) {
    case RequestBackend.FETCH:
        return performFetchRequest(method, url, options);

    case RequestBackend.GMXHR:
        return performGMXHRRequest(method, url, options);
    }
}
