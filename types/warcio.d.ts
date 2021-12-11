type WARCType = 'warcinfo' | 'request' | 'response' | 'revisit' | 'metadata';

interface WARCRecordCreateOptions {
    url: string;
    date?: string;
    type: WARCType;
    warcHeaders?: Record<string, string>;
    filename?: string;
    httpHeaders?: Record<string, string>;
    statusline?: string;
    warcVersion?: string;
    keepHeadersCase?: boolean;
    refersToUrl?: string;
    refersToDate?: string;
}

interface WARCSerializerOptions {
    gzip?: boolean;
    digest?: {
        digestAlgo?: string;
        digestAlgoPrefix?: string;
        digestBase32?: boolean;
    };
}

interface WARCParserOptions {
    keepHeadersCase?: boolean;
    parseHttp?: boolean;
}

interface StatusAndHeaders {
    statusline: string;
    headers: Map<string, string> | Headers;
    toString(): string;
}

declare module 'warcio/src/warcrecord' {
    class WARCRecord {
        static create(options: WARCRecordCreateOptions = {}, reader?: AsyncIterable<Uint8Array>): WARCRecord;
        static createWARCInfo(opts: { filename: string; warcVersion: string }, info: Record<string, string>): WARCRecord;
        warcHeader(name: string): string | null;

        async readFully(): Promise<Uint8Array>;
        async contentText(): Promise<string>;
        get warcType(): WARCType;
        get warcTargetURI(): string;
        get warcContentType(): string;
        httpHeaders: StatusAndHeaders;
    }
}

declare module 'warcio/src/warcserializer' {
    class WARCSerializer {
        static async serialize(record: WARCRecord, opts?: WARCSerializerOptions): Promise<Uint8Array>;
    }
}

declare module 'warcio/src/warcparser' {
    import type { WARCRecord } from 'warcio/src/warcrecord';
    class WARCParser {
        static async iterRecords(source: Iterable<Uint8Array>, options?: WARCParserOptions): AsyncIterable<WARCRecord>;
    }
}

declare module 'warcio/src/utils' {
    function concatChunks(chunks: Uint8Array[], size: number): Uint8Array;
}
