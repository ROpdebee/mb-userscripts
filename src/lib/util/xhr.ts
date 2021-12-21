// Async XHR interfaces

import { GMxmlHttpRequest } from '@lib/compat';
import { CustomError } from 'ts-custom-error';

// eslint-disable-next-line no-restricted-globals
type LimitedGMXHROptions = Omit<GM.Request, 'onload'|'onerror'|'onabort'|'ontimeout'|'onprogress'|'onreadystatechange'|'method'|'url'>;

interface GMXHROptions extends LimitedGMXHROptions {
    // eslint-disable-next-line no-restricted-globals
    method?: GM.Request['method'];
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
    // eslint-disable-next-line no-restricted-globals
    response: GM.Response<never>;

    // eslint-disable-next-line no-restricted-globals
    constructor(url: string | URL, response: GM.Response<never>) {
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

// eslint-disable-next-line no-restricted-globals
export async function gmxhr(url: string | URL, options?: GMXHROptions): Promise<GM.Response<never>> {
    return new Promise((resolve, reject) => {
        GMxmlHttpRequest({
            method: 'GET',
            url: url instanceof URL ? url.href : url,
            ...options ?? {},

            onload: (resp) => {
                if (resp.status >= 400) reject(new HTTPResponseError(url, resp));
                else resolve(resp);
            },
            onerror: () => { reject(new NetworkError(url)); },
            onabort: () => { reject(new AbortedError(url)); },
            ontimeout: () => { reject(new TimeoutError(url)); },
        // eslint-disable-next-line no-restricted-globals
        } as GM.Request<never>);
    });
}
