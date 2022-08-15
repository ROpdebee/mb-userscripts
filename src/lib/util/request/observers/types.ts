import type { RequestBackend, RequestMethod, RequestOptions } from '../requestOptions';
import type { ProgressEvent, Response } from '../response';

export interface BaseRequestEvent {
    backend: RequestBackend;
    method: RequestMethod;
    url: URL | string;
    options?: RequestOptions;
}

export interface RequestObserver {
    onStarted?: (event: Readonly<BaseRequestEvent>) => void;
    onFailed?: (event: Readonly<BaseRequestEvent & { error: Error }>) => void;
    onSuccess?: (event: Readonly<BaseRequestEvent & { response: Response }>) => void;
    onProgress?: (event: Readonly<BaseRequestEvent & { progressEvent: ProgressEvent }>) => void;
}
