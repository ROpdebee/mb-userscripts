/* eslint-disable no-restricted-globals */

import type { RequestMethod, RequestOptions } from './request-options';
import type { Response, ResponseFor, TextResponse } from './response';
import { performFetchRequest } from './backend-fetch';
import { performGMXHRRequest } from './backend-gmxhr';
import { HTTPResponseError } from './errors';
import { RequestBackend } from './request-options';

export { AbortedError, HTTPResponseError, NetworkError, TimeoutError } from './errors';
export type { RequestMethod, RequestOptions } from './request-options';
export { RequestBackend } from './request-options';
export type { ArrayBufferResponse, BlobResponse, ProgressEvent, Response, TextResponse } from './response';

interface RequestFunction {
    <RequestOptionsT extends RequestOptions>(method: RequestMethod, url: URL | string, options: RequestOptionsT): Promise<ResponseFor<RequestOptionsT>>;
    (method: RequestMethod, url: URL | string): Promise<TextResponse>;

    get<RequestOptionsT extends RequestOptions>(url: URL | string, options: RequestOptionsT): Promise<ResponseFor<RequestOptionsT>>;
    get(url: URL | string): Promise<TextResponse>;

    post<RequestOptionsT extends RequestOptions>(url: URL | string, options: RequestOptionsT): Promise<ResponseFor<RequestOptionsT>>;
    post(url: URL | string): Promise<TextResponse>;

    head<RequestOptionsT extends RequestOptions>(url: URL | string, options: RequestOptionsT): Promise<ResponseFor<RequestOptionsT>>;
    head(url: URL | string): Promise<TextResponse>;
}

const hasGMXHR = (
    // @ts-expect-error GMv3 API.
    typeof GM_xmlHttpRequest !== 'undefined'
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-unnecessary-condition -- Might be using GMv3 API.
    || (typeof GM !== 'undefined' && GM.xmlHttpRequest !== undefined));

function constructErrorMessage(options: RequestOptions | undefined, response: Response): string | undefined {
    const messageHandler = options?.httpErrorMessages?.[response.status];
    if (typeof messageHandler === 'string') {
        return messageHandler;
    } else if (messageHandler !== undefined) {
        return messageHandler(response);
    } else {
        return undefined;
    }
}

export const request: RequestFunction = async function (method: RequestMethod, url: URL | string, options?: RequestOptions) {
    // istanbul ignore next: Difficult to test.
    const backend = options?.backend ?? (hasGMXHR ? RequestBackend.GMXHR : RequestBackend.FETCH);
    const response = await performRequest(backend, method, url, options);

    const throwForStatus = options?.throwForStatus ?? true;
    if (throwForStatus && response.status >= 400) {
        const errorMessage = constructErrorMessage(options, response);
        throw new HTTPResponseError(url, response, errorMessage);
    }

    return response;
} as RequestFunction;

request.get = request.bind(undefined, 'GET');
request.post = request.bind(undefined, 'POST');
request.head = request.bind(undefined, 'HEAD');

function performRequest(backend: RequestBackend, method: RequestMethod, url: URL | string, options?: RequestOptions): Promise<Response> {
    switch (backend) {
        case RequestBackend.FETCH:
            return performFetchRequest(method, url, options);

        case RequestBackend.GMXHR:
            return performGMXHRRequest(method, url, options);
    }
}
