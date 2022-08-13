/* eslint-disable no-restricted-globals */

import type { RequestObserver } from './observers';
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

    addObserver(observer: RequestObserver): void;
}

const hasGMXHR = (
    // @ts-expect-error GMv3 API.
    typeof GM_xmlHttpRequest !== 'undefined'
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Might be using GMv3 API.
    || (typeof GM !== 'undefined' && GM.xmlHttpRequest !== undefined));

export const request = ((): RequestFunc => {
    const observers: RequestObserver[] = [];

    function notifyObservers<EventT extends keyof RequestObserver>(event: EventT, data: Parameters<NonNullable<RequestObserver[EventT]>>[0]): void {
        for (const observer of observers) {
            // @ts-expect-error: False positive?
            observer[event]?.(data);
        }
    }

    function insertDefaultProgressListener(backend: RequestBackend, method: RequestMethod, url: URL | string, options?: RequestOptions): RequestOptions {
        return {
            ...options,
            // istanbul ignore next: Difficult to cover, test gmxhr doesn't emit progress events.
            onProgress: (progressEvent): void => {
                notifyObservers('onProgress', { backend, method, url, options, progressEvent });
                // Also pass through this progress event to original listener if it exists.
                options?.onProgress?.(progressEvent);
            },
        };
    }

    const impl = async function (method: RequestMethod, url: string | URL, options?: RequestOptions) {
        // istanbul ignore next: Difficult to test.
        const backend = options?.backend ?? (hasGMXHR ? RequestBackend.GMXHR : RequestBackend.FETCH);

        try {
            notifyObservers('onStarted', { backend, method, url, options });

            // Inject own progress listener so we can echo that to the observers.
            const optionsWithProgressWrapper = insertDefaultProgressListener(backend, method, url, options);
            const response = await performRequest(backend, method, url, optionsWithProgressWrapper);

            const throwForStatus = options?.throwForStatus ?? true;
            if (throwForStatus && response.status >= 400) {
                throw new HTTPResponseError(url, response, options?.httpErrorMessages?.[response.status]);
            }

            notifyObservers('onSuccess', { backend, method, url, options, response });
            return response;
        } catch (err) {
            // istanbul ignore else: Should not happen in practice.
            if (err instanceof Error) {
                notifyObservers('onFailed', { backend, method, url, options, error: err });
            }
            throw err;
        }
    } as RequestFunc;

    impl.get = impl.bind(undefined, 'GET');
    impl.post = impl.bind(undefined, 'POST');
    impl.head = impl.bind(undefined, 'HEAD');

    impl.addObserver = (observer): void => {
        observers.push(observer);
    };

    return impl;
})();

function performRequest(backend: RequestBackend, method: RequestMethod, url: string | URL, options?: RequestOptions): Promise<Response> {
    switch (backend) {
    case RequestBackend.FETCH:
        return performFetchRequest(method, url, options);

    case RequestBackend.GMXHR:
        return performGMXHRRequest(method, url, options);
    }
}
