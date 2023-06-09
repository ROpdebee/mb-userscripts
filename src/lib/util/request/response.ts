import type { RequestOptions } from './requestOptions';
import { groupBy } from '../array';

// Like `fetch`'s Headers, but without modification operations. We need a custom
// class for XHR headers because we may not be able to construct a Headers
// instance because of protected headers, and because Map doesn't do case-insensitive
// checks.
export class ResponseHeadersImpl {
    private readonly map: Map<string, string>;

    // @ts-expect-error: False positive?
    public readonly [Symbol.iterator]: () => IterableIterator<[string, string]>;
    public readonly entries: () => IterableIterator<[string, string]>;
    public readonly keys: () => IterableIterator<string>;
    public readonly values: () => IterableIterator<string>;

    public constructor(crlfHeaders: string) {
        const headerList = crlfHeaders
            ? crlfHeaders
                .split('\r\n')
                .filter(Boolean)
                .map((header) => {
                    const [name, ...value] = header.split(':');
                    return [name.toLowerCase().trim(), value.join(':').trim()];
                })
            : /* istanbul ignore next: Shouldn't happen in practice. */[];

        const headerMultimap = groupBy(headerList, ([name]) => name, ([, value]) => value);
        // Can't construct a Headers instance because these may contain protected
        // headers.
        this.map = new Map([...headerMultimap.entries()]
            .map(([name, values]) => [name, values.join(',')] as [string, string]));

        this.entries = this.map.entries.bind(this.map);
        this.keys = this.map.keys.bind(this.map);
        this.values = this.map.values.bind(this.map);
        this[Symbol.iterator] = this.map[Symbol.iterator].bind(this.map);
    }

    public get(name: string): string | null {
        return this.map.get(name.toLowerCase()) ?? null;
    }

    public has(name: string): boolean {
        return this.map.has(name.toLowerCase());
    }

    public forEach(callbackfn: (value: string, key: string, parent: ResponseHeaders) => void): void {
        this.map.forEach((values, key) => {
            callbackfn(values, key, this);
        });
    }
}

type ResponseHeaders = Omit<ResponseHeadersImpl, 'map'>;

export interface BaseResponse {
    readonly headers: ResponseHeaders;
    readonly status: number;
    readonly statusText: string;
    /**
     * The final URL obtained after following all redirects. Potentially undefined
     * in edge cases.
     */
    readonly url?: string;

    readonly rawResponse: unknown;
}

export interface TextResponse extends BaseResponse {
    readonly text: string;

    /**
     * Parse JSON from the response text.
     */
    json(): unknown;
}

export interface BlobResponse extends BaseResponse {
    readonly blob: Blob;
}

export interface ArrayBufferResponse extends BaseResponse {
    readonly arrayBuffer: ArrayBuffer;
}

export type Response = TextResponse | BlobResponse | ArrayBufferResponse;

export type ResponseFor<T extends RequestOptions> = (
    T['responseType'] extends 'arraybuffer' ? ArrayBufferResponse
    : T['responseType'] extends 'blob' ? BlobResponse
    : TextResponse);

export interface ProgressEvent {
    lengthComputable: boolean;
    loaded: number;
    total: number;
}

export function createTextResponse(baseResponse: BaseResponse, text: string): TextResponse {
    return {
        ...baseResponse,
        text,
        json(): unknown {
            return JSON.parse(this.text);
        },
    };
}
