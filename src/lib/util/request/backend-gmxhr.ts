import { GMxmlHttpRequest } from '@lib/compat';

import type { RequestMethod, RequestOptions } from './request-options';
import type { Response } from './response';
import { AbortedError, NetworkError, TimeoutError } from './errors';
import { createTextResponse } from './response';
import { ResponseHeadersImpl } from './response';

function binaryStringToArrayBuffer(binaryString: string): ArrayBuffer {
    const buffer = new ArrayBuffer(binaryString.length);
    const view = new Uint8Array(buffer);
    for (let index = 0; index < binaryString.length; index++) {
        view[index] = binaryString.charCodeAt(index) & 0xFF;
    }
    return buffer;
}

function isArrayBuffer(value: unknown): value is ArrayBuffer {
    return value instanceof ArrayBuffer || Object.prototype.toString.call(value) === '[object ArrayBuffer]';
}

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
                arrayBuffer: isArrayBuffer(rawResponse.response)
                    ? rawResponse.response
                    : binaryStringToArrayBuffer(String(rawResponse.responseText ?? rawResponse.response ?? '')),
            };
    }
}

export function performGMXHRRequest(method: RequestMethod, url: URL | string, options?: RequestOptions): Promise<Response> {
    return new Promise((resolve, reject) => {
        GMxmlHttpRequest({
            method,
            url: url instanceof URL ? url.href : url,
            headers: options?.headers,
            data: options?.body,
            responseType: options?.responseType === 'arraybuffer' ? 'text' : options?.responseType,
            overrideMimeType: options?.responseType === 'arraybuffer' ? 'text/plain; charset=x-user-defined' : undefined,

            onload: (rawResponse) => { resolve(createGMXHRResponse(options, rawResponse)); },
            onerror: () => { reject(new NetworkError(url)); },
            onabort: () => { reject(new AbortedError(url)); },
            ontimeout: () => { reject(new TimeoutError(url)); },

            onprogress: options?.onProgress,
        } as GM.Request<never>);
    });
}
