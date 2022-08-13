/* eslint-disable no-restricted-globals */

import { GMxmlHttpRequest } from '@lib/compat';

import type { RequestMethod, RequestOptions } from './requestOptions';
import type { Response} from './response';
import { AbortedError, NetworkError, TimeoutError } from './errors';
import { createTextResponse} from './response';
import { ResponseHeadersImpl } from './response';

function createGMXHRResponse(options: RequestOptions | undefined, rawResponse: GM.Response<never>): Response {
    const responseType = options?.responseType ?? 'text';
    const baseResponse = {
        headers: new ResponseHeadersImpl(rawResponse.responseHeaders),
        url: rawResponse.finalUrl,
        status: rawResponse.status,
        statusText: rawResponse.statusText,
        rawResponse,
    };

    switch (responseType) {
    case 'text':
        return createTextResponse(baseResponse, rawResponse.responseText);

    case 'blob':
        return {
            ...baseResponse,
            blob: rawResponse.response as Blob,
        };

    case 'arraybuffer':
        return {
            ...baseResponse,
            arrayBuffer: rawResponse.response as ArrayBuffer,
        };
    }
}

export function performGMXHRRequest(method: RequestMethod, url: string | URL, options?: RequestOptions): Promise<Response> {
    return new Promise((resolve, reject) => {
        GMxmlHttpRequest({
            method,
            url: url instanceof URL ? url.href : url,
            headers: options?.headers,
            data: options?.body,
            responseType: options?.responseType,

            onload: (rawResponse) => { resolve(createGMXHRResponse(options, rawResponse)); },
            onerror: () => { reject(new NetworkError(url)); },
            onabort: () => { reject(new AbortedError(url)); },
            ontimeout: () => { reject(new TimeoutError(url)); },

            onprogress: options?.onProgress,
        } as GM.Request<never>);
    });
}
