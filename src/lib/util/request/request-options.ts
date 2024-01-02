export enum RequestBackend {
    FETCH = 1,
    GMXHR = 2,
}

// eslint-disable-next-line no-restricted-globals
export type RequestMethod = GM.Request['method'];
export type ResponseType = 'text' | 'blob' | 'arraybuffer';
export type ProgressCallback = (progressEvent: ProgressEvent) => void;

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
