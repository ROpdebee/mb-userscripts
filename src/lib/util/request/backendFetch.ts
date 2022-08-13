/* eslint-disable no-restricted-globals */

import type { RequestMethod, RequestOptions } from './requestOptions';
import type { Response} from './response';
import { createTextResponse} from './response';

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

export async function performFetchRequest(method: RequestMethod, url: string | URL, options?: RequestOptions): Promise<Response> {
    const rawResponse = await fetch(new URL(url), convertFetchOptions(method, options));
    return createFetchResponse(options, rawResponse);
}
