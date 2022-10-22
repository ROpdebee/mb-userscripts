import type { Har, HarEntry, HarRequest, HarResponse } from '@pollyjs/persister';
import { concatChunks, WARCRecord, WARCSerializer } from 'warcio';

import { assert, assertHasValue } from '@lib/util/assert';

// Importing from ./types will allow declaration merging to fix PollyJS
// declaration problems.
import type { WARCRecordMetadataFields } from './types';

const ENCODER = new TextEncoder();

export default async function har2warc(har: Har): Promise<Uint8Array> {
    const infoRecord = createWarcInfoRecord(har);
    const payloadRecords = har.log.entries.flatMap((entry) => createWarcPayloadRecords(entry));

    const allRecords = [infoRecord, ...payloadRecords];
    const serialisedRecords = await Promise.all(allRecords.map((record) => WARCSerializer.serialize(record)));
    return concatChunks(serialisedRecords, serialisedRecords.reduce((acc, curr) => acc + curr.length, 0));
}

function createWarcInfoRecord(har: Har): WARCRecord {
    const warcVersion = 'WARC/1.1';
    const warcName = har.log._recordingName;
    const info = {
        software: 'warcio.js',
        harVersion: har.log.version,
        harCreator: JSON.stringify(har.log.creator),
    };

    return WARCRecord.createWARCInfo({
        filename: warcName,
        warcVersion,
    }, info);
}

function createWarcPayloadRecords(entry: HarEntry): WARCRecord[] {
    const { request, response } = entry as unknown as { request: HarRequest; response: HarResponse };
    const url = request.url;
    // Convert the response first so that we have a UUID to link the request to.
    const responseRecord = createWarcResponseRecord(url, response);
    const responseId = responseRecord.warcHeader('WARC-Record-ID');
    assertHasValue(responseId);

    const requestRecord = createWarcRequestRecord(url, request, responseId);
    const metadataRecord = createWarcMetadataRecord(url, entry, responseId);

    return [requestRecord, metadataRecord, responseRecord];
}

function shouldDecodeResponse(response: HarResponse): boolean {
    // For binary content, node-http sets text to be a JSON-encoded array
    // of base64-encoded chunks. Don't decode these.
    return !!response.content.text
        && response.content.encoding === 'base64'
        && !response.content.text.startsWith('["');
}

function createWarcResponseRecord(url: string, response: HarResponse): WARCRecord {
    const httpStatusLine = `${response.httpVersion} ${response.status} ${response.statusText}`;
    const httpHeaders = Object.fromEntries(response.headers.map(({ name, value }) => [name, value]));
    let content: Uint8Array;
    // eslint-disable-next-line unicorn/prefer-ternary -- Too complex
    if (!response.content.text) {
        content = new Uint8Array();
    } else {
        content = Buffer.from(response.content.text, shouldDecodeResponse(response) ? 'base64' : 'utf8');
    }
    async function* chunker(): AsyncIterable<Uint8Array> {
        yield content;
    }

    return WARCRecord.create({
        url,
        type: 'response',
        httpHeaders,
        statusline: httpStatusLine,
        warcVersion: 'WARC/1.1',
    }, chunker());
}

function createWarcRequestRecord(url: string, request: HarRequest, responseId: string): WARCRecord {
    assert(request.cookies.length === 0, 'Cannot serialise cookies to WARC yet');
    assert(!request.postData, 'Cannot serialise request body to WARC yet');
    const parsedUrl = new URL(url);
    const fullPath = parsedUrl.pathname + parsedUrl.search;
    const httpStatusLine = `${request.method} ${fullPath} ${request.httpVersion}`;
    const httpHeaders = Object.fromEntries(request.headers.map(({ name, value }) => [name, value]));

    return WARCRecord.create({
        url,
        type: 'request',
        httpHeaders,
        statusline: httpStatusLine,
        warcVersion: 'WARC/1.1',
        warcHeaders: {
            'WARC-Concurrent-To': responseId,
        },
    });
}

function createWarcMetadataRecord(url: string, entry: HarEntry, responseId: string): WARCRecord {
    const request: HarRequest = entry.request;
    const requestMetadata: WARCRecordMetadataFields = {
        harEntryId: entry._id,
        harEntryOrder: entry._order.toString(),
        cache: JSON.stringify(entry.cache),
        startedDateTime: entry.startedDateTime,
        time: entry.time.toString(),
        timings: JSON.stringify(entry.timings),
        warcRequestHeadersSize: request.headersSize.toString(),
        warcRequestCookies: JSON.stringify(request.cookies),
        warcResponseHeadersSize: entry.response.headersSize.toString(),
        warcResponseCookies: JSON.stringify(entry.response.cookies),
        responseDecoded: JSON.stringify(shouldDecodeResponse(entry.response)),
    };

    if (entry.response.content.encoding) {
        requestMetadata.warcResponseContentEncoding = entry.response.content.encoding;
    }

    async function* chunker(): AsyncIterable<Uint8Array> {
        for (const [name, value] of Object.entries(requestMetadata)) {
            yield ENCODER.encode(`${name}: ${value}\r\n`);
        }
    }

    return WARCRecord.create({
        url,
        type: 'metadata',
        warcVersion: 'WARC/1.1',
        warcHeaders: {
            'WARC-Concurrent-To': responseId,
        },
    }, chunker());
}
