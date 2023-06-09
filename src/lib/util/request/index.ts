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

    /**
     * Perform a HTTP GET request.
     *
     * @param      {(URL|string)}       url      The URL to request.
     * @param      {RequestOptionsT}    options  Request options.
     * @return     {Promise<Response>}  The requests' response. Type depends on
     *                                  requested type in options.
     */
    get<RequestOptionsT extends RequestOptions>(url: string | URL, options: RequestOptionsT): Promise<ResponseFor<RequestOptionsT>>;
    /**
     * Perform a HTTP GET request, expecting a text response.
     *
     * @param      {(URL|string)}           url     The URL to request.
     * @return     {Promise<TextResponse>}  The request's response.
     */
    get(url: string | URL): Promise<TextResponse>;

    /**
     * Perform a HTTP POST request.
     *
     * @param      {(URL|string)}       url      The URL to request.
     * @param      {RequestOptionsT}    options  Request options.
     * @return     {Promise<Response>}  The requests' response. Type depends on
     *                                  requested type in options.
     */
    post<RequestOptionsT extends RequestOptions>(url: string | URL, options: RequestOptionsT): Promise<ResponseFor<RequestOptionsT>>;
    /**
     * Perform a HTTP POST request, expecting a text response.
     *
     * @param      {(URL|string)}           url     The URL to request.
     * @return     {Promise<TextResponse>}  The request's response.
     */
    post(url: string | URL): Promise<TextResponse>;

    /**
     * Perform a HTTP HEAD request.
     *
     * @param      {(URL|string)}       url      The URL to request.
     * @param      {RequestOptionsT}    options  Request options.
     * @return     {Promise<Response>}  The requests' response. Type depends on
     *                                  requested type in options.
     */
    head<RequestOptionsT extends RequestOptions>(url: string | URL, options: RequestOptionsT): Promise<ResponseFor<RequestOptionsT>>;
    /**
     * Perform a HTTP HEAD request, expecting a text response.
     *
     * @param      {(URL|string)}           url     The URL to request.
     * @return     {Promise<TextResponse>}  The request's response.
     */
    head(url: string | URL): Promise<TextResponse>;
}

const hasGMXHR = (
    // @ts-expect-error GMv3 API.
    typeof GM_xmlHttpRequest !== 'undefined'
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Might be using GMv3 API.
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
