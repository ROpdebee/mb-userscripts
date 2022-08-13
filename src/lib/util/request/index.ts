/* eslint-disable no-restricted-globals */

import { CustomError } from 'ts-custom-error';

import { GMxmlHttpRequest } from '@lib/compat';

import { groupBy } from './array';

export enum RequestBackend {
    FETCH = 1,
    GMXHR = 2,
}

export interface ProgressEvent {
    lengthComputable: boolean;
    loaded: number;
    total: number;
}

type RequestMethod = GM.Request['method'];
type ResponseType = 'text' | 'blob' | 'arraybuffer';
type ProgressCallback = (progressEvent: ProgressEvent) => void;

export interface RequestOptions {
    headers?: Record<string, string>;
    body?: string;  // TODO: Support at least FormData as well.

    /**
     * Expected response type for the request. Defaults to text.
     */
    // The reason why this needs to be specified on the request and cannot be
    // selected on the response is for compatibility with XHR.
    responseType?: ResponseType;

    /**
     * Request backend to use. Defaults to RequestBackend.GMXHR if available,
     * otherwise to RequestBackend.FETCH.
     */
    backend?: RequestBackend;

    /**
     * Whether to throw an error for a HTTP status >= 400. Defaults to true.
     */
    throwForStatus?: boolean;
    /**
     * Custom error messages to use based on HTTP status code. Ignored if
     * `throwForStatus` is false.
     */
    httpErrorMessages?: Record<number, string | undefined>;

    /**
     * Callback for progress events. Ignored for fetch backend.
     */
    onProgress?: ProgressCallback;
}

// Like `fetch`'s Headers, but without modification operations. We need a custom
// class for XHR headers because we may not be able to construct a Headers
// instance because of protected headers, and because Map doesn't do case-insensitive
// checks.
class ResponseHeadersImpl {
    private readonly map: Map<string, string>;

    // @ts-expect-error: False positive?
    public readonly [Symbol.iterator]: () => IterableIterator<[string, string]>;
    public readonly entries: () => IterableIterator<[string, string]>;
    public readonly keys: () => IterableIterator<string>;
    public readonly values: () => IterableIterator<string>;

    public constructor(crlfHeaders: string) {
        const headerList = crlfHeaders
            ? crlfHeaders
                .split('\r\n')
                .filter(Boolean)
                .map((header) => {
                    const [name, ...value] = header.split(':');
                    return [name.toLowerCase().trim(), value.join(':').trim()];
                })
            : /* istanbul ignore next: Shouldn't happen in practice. */ [];

        const headerMultimap = groupBy(headerList, ([name]) => name, ([, value]) => value);
        // Can't construct a Headers instance because these may contain protected
        // headers.
        this.map = new Map([...headerMultimap.entries()]
            .map(([name, values]) => [name, values.join(', ')] as [string, string]));

        this.entries = this.map.entries.bind(this.map);
        this.keys = this.map.keys.bind(this.map);
        this.values = this.map.values.bind(this.map);
        this[Symbol.iterator] = this.map[Symbol.iterator].bind(this.map);
    }

    public get(name: string): string | null {
        return this.map.get(name.toLowerCase()) ?? null;
    }

    public has(name: string): boolean {
        return this.map.has(name.toLowerCase());
    }

    public forEach(callbackfn: (value: string, key: string, parent: ResponseHeaders) => void): void {
        this.map.forEach((values, key) => {
            callbackfn(values, key, this);
        });
    }
}

type ResponseHeaders = Omit<ResponseHeadersImpl, 'map'>;

interface BaseResponse {
    readonly headers: ResponseHeaders;
    readonly status: number;
    readonly statusText: string;
    /**
     * The final URL obtained after following all redirects. Potentially undefined
     * in edge cases.
     */
    readonly url?: string;

    readonly rawResponse: unknown;
}

export interface TextResponse extends BaseResponse {
    readonly text: string;

    /**
     * Parse JSON from the response text.
     */
    json(): unknown;
}

export interface BlobResponse extends BaseResponse {
    readonly blob: Blob;
}

export interface ArrayBufferResponse extends BaseResponse {
    readonly arrayBuffer: ArrayBuffer;
}

export type Response = TextResponse | BlobResponse | ArrayBufferResponse;

type ResponseFor<T extends RequestOptions> = (
    T['responseType'] extends 'arraybuffer' ? ArrayBufferResponse
    : T['responseType'] extends 'blob' ? BlobResponse
    : TextResponse);

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
    public readonly response: Response;

    public constructor(url: string | URL, response: Response, errorMessage?: string) {
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

interface RequestFunc {
    <RequestOptionsT extends RequestOptions>(method: RequestMethod, url: string | URL, options: RequestOptionsT): Promise<ResponseFor<RequestOptionsT>>;
    (method: RequestMethod, url: string | URL): Promise<TextResponse>;

    get<RequestOptionsT extends RequestOptions>(url: string | URL, options: RequestOptionsT): Promise<ResponseFor<RequestOptionsT>>;
    get(url: string | URL): Promise<TextResponse>;

    post<RequestOptionsT extends RequestOptions>(url: string | URL, options: RequestOptionsT): Promise<ResponseFor<RequestOptionsT>>;
    post(url: string | URL): Promise<TextResponse>;

    head<RequestOptionsT extends RequestOptions>(url: string | URL, options: RequestOptionsT): Promise<ResponseFor<RequestOptionsT>>;
    head(url: string | URL): Promise<TextResponse>;
};

const hasGMXHR = (
    // @ts-expect-error GMv3 API.
    typeof GM_xmlHttpRequest !== 'undefined'
        || (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest !== 'undefined'));

export const request: RequestFunc = async function(method: RequestMethod, url: string | URL, options?: RequestOptions) {
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

function createTextResponse(baseResponse: BaseResponse, text: string): TextResponse {
    return {
        ...baseResponse,
        text,
        json(): unknown {
            return JSON.parse(this.text);
        },
    };
}

function convertFetchOptions(method: RequestMethod, options?: RequestOptions): RequestInit | undefined {
    // istanbul ignore next: We always need to pass options to test the fetch backend, since it'll always default to GMXHR in the tests.
    if (!options) return undefined;
    return {
        method,
        body: options.body,
        headers: options.headers,
    };
}

async function createFetchResponse(options: RequestOptions | undefined, rawResponse: Awaited<ReturnType<typeof fetch>>): Promise<Response> {
    const responseType = options?.responseType ?? 'text';
    const baseResponse = {
        headers: rawResponse.headers,
        url: rawResponse.url,
        status: rawResponse.status,
        statusText: rawResponse.statusText,
        rawResponse,
    };

    switch (responseType) {
    case 'text':
        return createTextResponse(baseResponse, await rawResponse.text());

    case 'blob':
        return {
            ...baseResponse,
            blob: await rawResponse.blob(),
        };

    case 'arraybuffer':
        return {
            ...baseResponse,
            arrayBuffer: await rawResponse.arrayBuffer(),
        };
    }
}

async function performFetchRequest(method: RequestMethod, url: string | URL, options?: RequestOptions): Promise<Response> {
    const rawResponse = await fetch(new URL(url), convertFetchOptions(method, options));
    return createFetchResponse(options, rawResponse);
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
            arrayBuffer: rawResponse.response as ArrayBuffer,
        };
    }
}

function performGMXHRRequest(method: RequestMethod, url: string | URL, options?: RequestOptions): Promise<Response> {
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
