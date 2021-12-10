// GM_xmlhttpRequest adapter for pollyjs
import type { Headers as PollyHeaders, Request } from '@pollyjs/core';
import { Buffer } from 'buffer';
import Adapter from '@pollyjs/adapter';
import fetch from 'node-fetch';
import { mockGMxmlHttpRequest } from './gm_mocks';
import { assertDefined } from '@lib/util/assert';

function pollyHeadersToString(headers: PollyHeaders): string {
    return Object.entries(headers).flatMap(([k, v]) => {
        if (!Array.isArray(v)) return [`${k}: ${v}`];
        else {
            return v.map((vi) => `${k}: ${vi}`);
        }
    }).join('\r\n');
}

function pollyHeadersToFetchHeaders(pollyHeaders: PollyHeaders): Headers {
    const headersInit: Record<string, string> = {};
    Object.entries(pollyHeaders).forEach(([k, v]) => {
        headersInit[k] = Array.isArray(v) ? v[0] : v;
    });
    return new Headers(headersInit);
}

function fetchHeadersToPollyHeaders(fetchHeaders: Headers): PollyHeaders {
    const pollyHeaders: Record<string, string> = {};
    fetchHeaders.forEach((v, k) => {
        pollyHeaders[k] = v;
    });
    return pollyHeaders;
}

type RequestType<Context> = Request<GM.Request<Context>>

// eslint-disable-next-line @typescript-eslint/ban-types
export default class GMXHRAdapter<Context> extends Adapter<{}, RequestType<Context>> {

    static override get id(): string {
        return 'GM_xmlhttpRequest';
    }

    override onConnect = (): void => {
        mockGMxmlHttpRequest.mockImplementation((options: GM.Request<Context>): void => {
            this.handleRequest({
                url: options.url,
                method: options.method,
                headers: options.headers ?? {},
                body: options.data,
                requestArguments: options,
            });
        });
    };

    override onDisconnect = (): void => {
        mockGMxmlHttpRequest.mockRestore();
    };

    override async onFetchResponse(pollyRequest: RequestType<Context>): ReturnType<Adapter['onFetchResponse']> {
        const { responseType } = pollyRequest.requestArguments;
        const headers = pollyHeadersToFetchHeaders(pollyRequest.headers);
        const resp = await fetch(pollyRequest.url, {
            method: pollyRequest.method,
            headers: headers,
            body: pollyRequest.body,
        });

        const pollyHeaders = fetchHeadersToPollyHeaders(resp.headers);
        // Storing the final URL after redirect, see `passthroughRealGMXHR`.
        pollyHeaders['x-pollyjs-finalurl'] = resp.url;

        const arrayBuffer = await resp.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const isBinary = responseType && responseType !== 'text';
        return {
            statusCode: resp.status,
            headers: pollyHeaders,
            body: buffer.toString(isBinary ? 'base64' : 'utf8'),
            encoding: isBinary ? 'base64' : undefined,
        };
    }

    override onRespond = async (pollyRequest: RequestType<Context>, error?: Error): Promise<void> => {
        if (error) throw error;

        const response = pollyRequest.response;
        const options = pollyRequest.requestArguments;
        const responseType = options.responseType;
        assertDefined(response);

        // Extract the final URL from the headers. We stored these in
        // the passthrough
        const headers = {...response.headers};
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const finalUrl = headers['x-pollyjs-finalurl'] ?? options.url;
        delete headers['x-pollyjs-finalUrl'];

        const resp: GM.Response<Context> = {
            readyState: 4,
            responseHeaders: pollyHeadersToString(headers),
            status: response.statusCode,
            statusText: response.statusText,
            finalUrl: Array.isArray(finalUrl) ? finalUrl[0] : finalUrl,
            context: options.context,
            responseXML: false,
            responseText: '',
            response: null,
        };

        if (response.encoding === 'base64') {
            const buffer = Buffer.from(response.body ?? '', 'base64');
            const arrayBuffer = Uint8Array.from(buffer);
            if (responseType === 'blob') {
                options.onload?.({
                    ...resp,
                    response: new Blob([arrayBuffer]),
                });
            } else if (responseType === 'arraybuffer') {
                options.onload?.({
                    ...resp,
                    response: arrayBuffer,
                });
            } else {
                throw new Error('Unknown response type: ' + responseType);
            }
        } else {
            options.onload?.({
                ...resp,
                responseText: response.body as string,
            });
        }
    };
}
