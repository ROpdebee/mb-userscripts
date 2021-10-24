// Async XHR interfaces

// TODO: Look into using GM.* instead of GM_*, they're async

import { CustomError } from 'ts-custom-error';

type LimitedGMXHROptions = Omit<GMXMLHttpRequestOptions, 'onload'|'onerror'|'onabort'|'ontimeout'|'onprogress'|'onreadystatechange'|'method'|'url'>;

interface GMXHROptions extends LimitedGMXHROptions {
    responseType?: XMLHttpRequestResponseType;
    method?: GMXMLHttpRequestOptions['method'];
}

interface GMXHRResponse extends GMXMLHttpRequestResponse {
    response: Blob;
}

export abstract class ResponseError extends CustomError {
    url: string | URL;

    constructor(url: string | URL, extraMessage: string) {
        super(extraMessage);
        this.url = url;
    }
}
export class HTTPResponseError extends ResponseError {
    statusCode: number;
    statusText: string;
    response: GMXMLHttpRequestResponse;

    constructor(url: string | URL, response: GMXMLHttpRequestResponse) {
        /* istanbul ignore else: Should not happen */
        if (response.statusText.trim()) {
            super(url, `HTTP error ${response.status}: ${response.statusText}`);
        } else {
            super(url, `HTTP error ${response.status}`);
        }

        this.response = response;
        this.statusCode = response.status;
        this.statusText = response.statusText;
    }
}
export class TimeoutError extends ResponseError {
    constructor(url: string | URL) {
        super(url, 'Request timed out');
    }
}
export class AbortedError extends ResponseError {
    constructor(url: string | URL) {
        super(url, 'Request aborted');
    }
}
export class NetworkError extends ResponseError {
    constructor(url: string | URL) {
        super(url, 'Network error');
    }
}

export async function gmxhr(url: string | URL, options?: GMXHROptions): Promise<GMXHRResponse> {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url instanceof URL ? url.href : url,
            ...options ?? {},

            onload: (resp) => {
                if (resp.status >= 400) reject(new HTTPResponseError(url, resp));
                else resolve(resp as GMXHRResponse);
            },
            onerror: () => { reject(new NetworkError(url)); },
            onabort: () => { reject(new AbortedError(url)); },
            ontimeout: () => { reject(new TimeoutError(url)); },
        });
    });
}
