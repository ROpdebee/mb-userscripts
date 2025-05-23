// GM_xmlhttpRequest adapter for pollyjs
import '@lib/compat'; // To fix GM.Request declaration

import { Buffer } from 'node:buffer';

import type { Request } from '@pollyjs/core';
import Adapter from '@pollyjs/adapter';
import fetch from 'node-fetch';

import { assertDefined } from '@lib/util/assert';
import { mockGMxmlHttpRequest } from '@test-utils/gm-mocks';

import { CRLFHeaders, FetchHeaders, PollyHeaders } from '../headers';

type RequestType<Context> = Request<GM.Request<Context>>;

const FAKE_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/113.0',
};

export default class GMXHRAdapter<Context> extends Adapter<object, RequestType<Context>> {
    public static override readonly id = 'GM_xmlhttpRequest';

    public override onConnect(): void {
        mockGMxmlHttpRequest.mockImplementation((options: GM.Request<Context>): void => {
            this.handleRequest({
                url: options.url,
                method: options.method,
                headers: options.headers ?? {},
                body: options.data,
                requestArguments: options,
            }).catch((error: unknown) => {
                const response: GM.Response<Context> = {
                    readyState: 4,
                    status: 0,
                    statusText: `${error}`,
                    responseHeaders: '',
                    finalUrl: options.url,
                    context: options.context,
                    responseXML: false,
                    responseText: '',
                    response: null,
                };
                options.onerror?.(response);
            });
        });
    }

    public override onDisconnect(): void {
        mockGMxmlHttpRequest.mockRestore();
    }

    public override async onFetchResponse(pollyRequest: RequestType<Context>): ReturnType<Adapter['onFetchResponse']> {
        const { responseType } = pollyRequest.requestArguments;
        const headers = FetchHeaders.fromPollyHeaders(pollyRequest.headers);
        for (const [headerName, headerValue] of Object.entries(FAKE_HEADERS)) {
            if (!headers.has(headerName)) {
                headers.append(headerName, headerValue);
            }
        }
        const response = await fetch(pollyRequest.url, {
            method: pollyRequest.method,
            headers: headers,
            body: pollyRequest.body,
        });

        const pollyHeaders = PollyHeaders.fromFetchHeaders(response.headers);
        // Storing the final URL after redirect, see `passthroughRealGMXHR`.
        pollyHeaders['x-pollyjs-finalurl'] = response.url;

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const isBinary = responseType && responseType !== 'text';
        return {
            statusCode: response.status,
            headers: pollyHeaders,
            body: buffer.toString(isBinary ? 'base64' : 'utf8'),
            encoding: isBinary ? 'base64' : undefined,
        };
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public override async onRespond(pollyRequest: RequestType<Context>, error?: Error): Promise<void> {
        if (error) throw error;

        const response = pollyRequest.response;
        const options = pollyRequest.requestArguments;
        const responseType = options.responseType;
        assertDefined(response);

        // Extract the final URL from the headers. We stored these in
        // the passthrough
        const headers = { ...response.headers };
        const finalUrl = headers['x-pollyjs-finalurl'] ?? options.url;
        delete headers['x-pollyjs-finalUrl'];

        const response_: GM.Response<Context> = {
            readyState: 4,
            responseHeaders: CRLFHeaders.fromPollyHeaders(headers),
            status: response.statusCode,
            statusText: response.statusText,
            finalUrl: Array.isArray(finalUrl) ? finalUrl[0] : finalUrl,
            context: options.context,
            responseXML: false,
            responseText: '',
            response: null,
        };

        if (!options.onload) return;

        if (response.encoding === 'base64') {
            const buffer = Buffer.from(response.body ?? '', 'base64');
            const arrayBuffer = Uint8Array.from(buffer).buffer;
            if (responseType === 'blob') {
                options.onload({
                    ...response_,
                    response: new Blob([arrayBuffer]),
                });
            } else if (responseType === 'arraybuffer') {
                options.onload({
                    ...response_,
                    response: arrayBuffer,
                });
            } else {
                throw new Error(`Unknown response type: ${responseType}`);
            }
        } else {
            options.onload({
                ...response_,
                responseText: response.body ?? '',
            });
        }
    }
}
