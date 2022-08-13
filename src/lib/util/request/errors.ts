import { CustomError } from 'ts-custom-error';

import type { Response } from './response';

abstract class ResponseError extends CustomError {
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
