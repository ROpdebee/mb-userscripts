// GM_xmlhttpRequest adapter for pollyjs
import type { Headers as PollyHeaders, Request, Response } from '@pollyjs/core';
import Adapter from '@pollyjs/adapter';
import fetch from 'node-fetch';

function stringToPollyHeaders(headers: string): PollyHeaders {
    return Object.fromEntries(headers.split('\r\n').map((header) => {
        const [k, v] = header.split(':');
        return [k, v.replace(/\r|\n|^\s+/g, '')];
    }));
}

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
    #realGMXHR: typeof GM_xmlhttpRequest | undefined;

    static override get id(): string {
        return 'GM_xmlhttpRequest';
    }

    onConnect(): void {
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            this.#realGMXHR = GM_xmlhttpRequest;
        }

        window.GM_xmlhttpRequest = (options: GMXMLHttpRequestOptions): GMXMLHttpRequestResult => {
            // @ts-expect-error bad type defs
            this.handleRequest({
                url: options.url,
                method: options.method,
                headers: options.headers,
                body: options.data,
                requestArguments: options
            }).then(({ response }: { response: Response }) => {
                // Extract the final URL from the headers. We stored these in
                // the passthrough
                const headers = {...response.headers};
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                const finalUrl = headers['x-pollyjs-finalurl'] ?? options.url;
                delete headers['x-pollyjs-finalUrl'];

                options.onload?.({
                    readyState: 4,
                    responseHeaders: pollyHeadersToString(headers),
                    responseText: response.body as string,
                    status: response.statusCode,
                    statusText: response.statusText,
                    finalUrl: Array.isArray(finalUrl) ? finalUrl[0] : finalUrl,
                    context: options.context,
                });
            });

            // TODO: Do we need to implement this? We're also not supporting
            // synchronous stuff here.
            return {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                abort: () => {}
            } as unknown as GMXMLHttpRequestResult;
        };
    }

    onDisconnect(): void {
        // this.#realGMXHR could be undefined if it was not defined before we
        // connected to the adapter. In that case, we'll still restore it to
        // its original state but we must cast as TS doesn't like it.
        window.GM_xmlhttpRequest = this.#realGMXHR as typeof GM_xmlhttpRequest;
    }

    override async passthroughRequest(pollyRequest: Request): ReturnType<Adapter['passthroughRequest']> {
        // If the real GM_xmlhttpRequest is defined, use it. Otherwise, use
        // node-fetch.
        if (this.#realGMXHR) {
            return this.passthroughRealGMXHR(pollyRequest);
        } else {
            return this.passthroughFetch(pollyRequest);
        }
    }

    async passthroughRealGMXHR(pollyRequest: Request): ReturnType<Adapter['passthroughRequest']> {
        return new Promise((resolve, reject) => {
            // Shouldn't happen.
            if (!this.#realGMXHR) throw new Error('Where is GM_xmlhttpRequest?');

            this.#realGMXHR({
                url: pollyRequest.url,
                method: pollyRequest.method,
                headers: pollyRequest.headers,
                data: pollyRequest.body,
                onload: (resp) => {
                    const pollyHeaders = stringToPollyHeaders(resp.responseHeaders);
                    // PollyJS seems not to store the final URL after redirects,
                    // and the headers seem to be the only way to store this in
                    // the persisted response.
                    pollyHeaders['x-pollyjs-finalurl'] = resp.finalUrl;
                    resolve({
                        statusCode: resp.status,
                        headers: pollyHeaders,
                        body: resp.responseText,
                    });
                },
                onerror: reject,
                onabort: reject,
                ontimeout: reject,
            });
        });
    }

    async passthroughFetch(pollyRequest: Request): ReturnType<Adapter['passthroughRequest']> {
        const headers = pollyHeadersToFetchHeaders(pollyRequest.headers);
        const resp = await fetch(pollyRequest.url, {
            method: pollyRequest.method,
            headers: headers,
            body: pollyRequest.body,
        });

        const pollyHeaders = fetchHeadersToPollyHeaders(resp.headers);
        // Storing the final URL after redirect, see `passthroughRealGMXHR`.
        pollyHeaders['x-pollyjs-finalurl'] = resp.url;
        return {
            statusCode: resp.status,
            headers: pollyHeaders,
            body: await resp.text()
        };
    }
}
