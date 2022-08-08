// Async XHR interfaces

import { CustomError } from 'ts-custom-error';

import { GMxmlHttpRequest } from '@lib/compat';

export interface FetchProgress {
    lengthComputable: boolean;
    loaded: number;
    total: number;
}

/* eslint-disable no-restricted-globals */
type LimitedGMXHROptions = Omit<GM.Request, 'onload'|'onerror'|'onabort'|'ontimeout'|'onprogress'|'onreadystatechange'|'method'|'url'>;

export interface GMXHROptions extends LimitedGMXHROptions {
    method?: GM.Request['method'];
    progressCb?: (progress: FetchProgress) => void;
    httpErrorMessages?: Record<number, string | undefined>;
}
/* eslint-enable no-restricted-globals */

export abstract class ResponseError extends CustomError {
    public readonly url: string | URL;

    protected constructor(url: string | URL, extraMessage: string) {
        super(extraMessage);
        this.url = url;
    }
}
export class HTTPResponseError extends ResponseError {
    public readonly statusCode: number;
    public readonly statusText: string;
    // eslint-disable-next-line no-restricted-globals
    public readonly response: GM.Response<never>;

    // eslint-disable-next-line no-restricted-globals
    public constructor(url: string | URL, response: GM.Response<never>, errorMessage?: string) {
        /* istanbul ignore else: Should not happen */
        if (errorMessage) {
            super(url, errorMessage);
        } else if (response.statusText.trim()) {
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
    public constructor(url: string | URL) {
        super(url, 'Request timed out');
    }
}
export class AbortedError extends ResponseError {
    public constructor(url: string | URL) {
        super(url, 'Request aborted');
    }
}
export class NetworkError extends ResponseError {
    public constructor(url: string | URL) {
        super(url, 'Network error');
    }
}

// eslint-disable-next-line no-restricted-globals
export async function gmxhr(url: string | URL, options?: GMXHROptions): Promise<GM.Response<never> & { finalUrl?: string }> {
    return new Promise((resolve, reject) => {
        GMxmlHttpRequest({
            method: 'GET',
            url: url instanceof URL ? url.href : url,
            ...options,

            onload: (resp) => {
                if (resp.status >= 400) reject(new HTTPResponseError(url, resp, options?.httpErrorMessages?.[resp.status]));
                else resolve(resp);
            },
            onerror: () => { reject(new NetworkError(url)); },
            onabort: () => { reject(new AbortedError(url)); },
            ontimeout: () => { reject(new TimeoutError(url)); },
            onprogress: options?.progressCb,
        // eslint-disable-next-line no-restricted-globals
        } as GM.Request<never>);
    });
}
