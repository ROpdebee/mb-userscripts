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

declare module 'warcio' {
    class WARCRecord {
        public static create(options: WARCRecordCreateOptions, reader?: AsyncIterable<Uint8Array>): WARCRecord;
        public static createWARCInfo(opts: { filename: string; warcVersion: string }, info: Record<string, string>): WARCRecord;
        public warcHeader(name: string): string | null;

        public readFully(): Promise<Uint8Array>;
        public contentText(): Promise<string>;
        public get warcType(): WARCType;
        public get warcTargetURI(): string;
        public get warcContentType(): string;
        public httpHeaders: StatusAndHeaders;
    }

    class WARCSerializer {
        public static serialize(record: WARCRecord, opts?: WARCSerializerOptions): Promise<Uint8Array>;
    }

    class WARCParser {
        public static iterRecords(source: Iterable<Uint8Array>, options?: WARCParserOptions): AsyncIterable<WARCRecord>;
    }

    function concatChunks(chunks: Uint8Array[], size: number): Uint8Array;
}
