// GM_xmlhttpRequest adapter for pollyjs
import type { Headers as PollyHeaders, Request, Response } from '@pollyjs/core';
import { Buffer } from 'buffer';
import Adapter from '@pollyjs/adapter';
import fetch from 'node-fetch';
import { mockGMxmlHttpRequest } from './gm_mocks';

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

export default class GMXHRAdapter extends Adapter {

    static override get id(): string {
        return 'GM_xmlhttpRequest';
    }

    onConnect(): void {
        mockGMxmlHttpRequest.mockImplementation((options: GM.Request<unknown>): void => {
            // @ts-expect-error bad type defs
            this.handleRequest({
                url: options.url,
                method: options.method,
                headers: options.headers,
                body: options.data,
                requestArguments: options,
            });
        });
    }

    onDisconnect(): void {
        mockGMxmlHttpRequest.mockRestore();
    }

    override async passthroughRequest(pollyRequest: Request): ReturnType<Adapter['passthroughRequest']> {
        // @ts-expect-error bad type defs
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

        if (!responseType || responseType === 'text') {
            return {
                statusCode: resp.status,
                headers: pollyHeaders,
                body: await resp.text(),
                // @ts-expect-error bad type defs
                isBinary: false,
            };
        } else {
            const arrayBuffer = await resp.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return {
                statusCode: resp.status,
                headers: pollyHeaders,
                body: buffer.toString('hex'),
                // @ts-expect-error bad type defs
                isBinary: true,
            };
        }
    }

    respondToRequest(pollyRequest: Request, error?: GM.Response<never>): void {
        // @ts-expect-error bad type defs
        const response = pollyRequest.response as Response;
        // @ts-expect-error bad type defs
        const options = pollyRequest.requestArguments as GM.Request<never>;
        // @ts-expect-error bad type defs
        const responseType = options.responseType;

        // Extract the final URL from the headers. We stored these in
        // the passthrough
        const headers = {...response.headers};
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const finalUrl = headers['x-pollyjs-finalurl'] ?? options.url;
        delete headers['x-pollyjs-finalUrl'];

        if (error) {
            options.onerror?.(error);
        } else {
            const resp: GM.Response<never> = {
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

            if (response.isBinary) {
                const buffer = Buffer.from(response.body as string, 'hex');
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
        }
    }
}
