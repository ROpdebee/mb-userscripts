import { deduplicateArray } from '@lib/util/array';

import type { ArrayBufferResponse, BlobResponse, Response, TextResponse } from '../response';
import type { BaseRequestEvent, RequestObserver } from './types';
import { HTTPResponseError } from '../errors';

type RecordedResponse = Omit<TextResponse, 'json' | 'rawResponse'>;
interface Recording {
    requestInfo: BaseRequestEvent;
    response: RecordedResponse;
}

/**
 * Convert a response to a textual one. For blob and arraybuffer, strips the
 * actual content and sets text to a placeholder string. We don't record the
 * original responses since they can be large and would cause memory leaks.
 */
function convertResponse(response: Response): RecordedResponse {
    if (Object.prototype.hasOwnProperty.call(response, 'text')) return response as TextResponse;

    const text = Object.prototype.hasOwnProperty.call(response, 'blob')
        ? `<Blob, ${(response as BlobResponse).blob.size} bytes>`
        : `<ArrayBuffer, ${(response as ArrayBufferResponse).arrayBuffer.byteLength} bytes>`;

    return {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        text,
    };
}

/**
 * Convert request info for recording. Strips down the passed in object to
 * remove references to responses to prevent memory leaks. Returns a copy.
 */
function convertRequestInfo(requestInfo: BaseRequestEvent): BaseRequestEvent {
    return {
        backend: requestInfo.backend,
        url: requestInfo.url,
        method: requestInfo.method,
        options: requestInfo.options,
    };
}

function getURLHost(url: string | URL): string {
    return new URL(url).host;
}

function exportRecordedResponse(recordedResponse: Recording): string {
    const { requestInfo, response } = recordedResponse;
    const { backend, method, url, options: reqOptions } = requestInfo;

    const reqOptionsString = JSON.stringify(reqOptions, (key, value) => {
        // Don't include the progress callback.
        if (key === 'onProgress') return undefined;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return value;
    }, 2);
    const reqPreamble = `${method} ${url} (backend: ${backend})\nOptions: ${reqOptionsString}`;

    const respPreamble = `${response.url} ${response.status}: ${response.statusText}`;
    const respHeaders = [...response.headers.entries()]
        .map(([name, value]) => `${name}: ${value}`)
        .join('\n');

    return [reqPreamble, '\n', respPreamble, respHeaders, '\n', response.text].join('\n');
}

export class RecordingObserver implements RequestObserver {
    private readonly recordedResponses: Recording[];

    public constructor() {
        this.recordedResponses = [];
    }

    public onSuccess(event: BaseRequestEvent & { response: Response }): void {
        this.recordedResponses.push({
            requestInfo: convertRequestInfo(event),
            response: convertResponse(event.response),
        });
    }

    public onFailed(event: BaseRequestEvent & { error: Error }): void {
        if (!(event.error instanceof HTTPResponseError)) return;
        this.recordedResponses.push({
            requestInfo: convertRequestInfo(event),
            response: convertResponse(event.error.response),
        });
    }

    public exportResponses(): string {
        return this.recordedResponses
            .map((recordedResponse) => exportRecordedResponse(recordedResponse))
            .join('\n\n==============================\n\n');
    }

    public hasRecordings(): boolean {
        return this.recordedResponses.length > 0;
    }

    public get recordedDomains(): string[] {
        return deduplicateArray(this.recordedResponses.flatMap((rec) => {
            const domains = [getURLHost(rec.requestInfo.url)];
            if (rec.response.url) domains.push(getURLHost(rec.response.url));
            return domains;
        }));
    }
}
