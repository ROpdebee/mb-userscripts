export interface WARCInfoFields {
    software: string;
    harVersion: string;
    harCreator: string;
}

export interface WARCRecordMetadataFields {
    harEntryId: string;
    harEntryOrder: string;
    cache: string;
    startedDateTime: string;
    time: string;
    timings: string;
    // Doesn't match up with the warc header.
    warcRequestHeadersSize: string;
    warcResponseHeadersSize: string;
    // We don't want to parse cookies.
    warcRequestCookies: string;
    warcResponseCookies: string;
    warcResponseContentEncoding?: string;
    responseDecoded: string;
}
