import type { Har, HarEntry, HarLog, HarRequest, HarResponse } from '@pollyjs/persister';
import type { WARCRecord } from 'warcio';
import { WARCParser } from 'warcio';

import { assert, assertHasValue } from '@lib/util/assert';
import { safeParseJSON } from '@lib/util/json';

import type { WARCInfoFields, WARCRecordMetadataFields } from './types';

export default async function warc2har(warc: Uint8Array): Promise<Har> {
    const harLog = {
        pages: [],
    } as unknown as HarLog;

    const entryMap = new Map<string, HarEntry>();

    for await (const record of WARCParser.iterRecords([warc])) {
        let entry: HarEntry;
        switch (record.warcType) {
        case 'warcinfo':
            await populateHarLogInfo(record, harLog);
            break;

        case 'request':
            entry = getOrCreateEntry(entryMap, record.warcHeader('WARC-Concurrent-To'));
            await populateEntryRequest(record, entry);
            break;

        case 'response':
            entry = getOrCreateEntry(entryMap, record.warcHeader('WARC-Record-ID'));
            await populateEntryResponse(record, entry);
            break;

        case 'metadata':
            entry = getOrCreateEntry(entryMap, record.warcHeader('WARC-Concurrent-To'));
            await populateEntryMetadata(record, entry);
            break;

        default:
            console.log(`Unsupported WARC entry type: ${record.warcType}`);
        }
    }

    harLog.entries = [...entryMap.values()].sort((e1, e2) => e1._order - e2._order);
    return {
        log: harLog,
    };
}

function getOrCreateEntry(entryMap: Map<string, HarEntry>, warcRecordId: string | null | undefined): HarEntry {
    assertHasValue(warcRecordId);
    if (!entryMap.has(warcRecordId)) {
        entryMap.set(warcRecordId, { cache: {}, request: {}, response: {} } as unknown as HarEntry);
    }

    return entryMap.get(warcRecordId)!;
}

async function parseWARCFields<T>(record: WARCRecord): Promise<T> {
    assert(record.warcContentType === 'application/warc-fields', 'Wrong content type for record');
    const content = await record.contentText();
    return Object.fromEntries(content.split('\r\n')
        .map((line) => line.split(': '))) as T;
}

async function populateHarLogInfo(record: WARCRecord, log: HarLog): Promise<void> {
    const metadata = await parseWARCFields<WARCInfoFields>(record);
    log.version = metadata.harVersion;
    log.creator = safeParseJSON<HarLog['creator']>(metadata.harCreator, 'Malformed WARC record: Missing `creator` field');

    const filename = record.warcHeader('WARC-Filename');
    assertHasValue(filename);
    log._recordingName = filename;
}

async function populateEntryMetadata(record: WARCRecord, entry: HarEntry): Promise<void> {
    const metadata = await parseWARCFields<WARCRecordMetadataFields>(record);

    entry._id = metadata.harEntryId;
    entry._order = parseInt(metadata.harEntryOrder);
    entry.cache = safeParseJSON<HarEntry['cache']>(metadata.cache, 'Malformed WARC record: Missing `cache` field');
    entry.startedDateTime = metadata.startedDateTime;
    entry.time = parseInt(metadata.time);
    entry.timings = safeParseJSON<HarEntry['timings']>(metadata.timings, 'Malformed WARC record: Missing `timings` field');
    // @ts-expect-error hack
    entry.responseShouldBeEncoded = safeParseJSON<boolean>(metadata.responseDecoded, 'Malformed WARC record: Missing `responseShouldBeEncoded` field');

    const request: HarRequest = entry.request;
    request.headersSize = parseInt(metadata.warcRequestHeadersSize);
    request.cookies = safeParseJSON<HarRequest['cookies']>(metadata.warcRequestCookies, 'Malformed WARC record: Missing `cookies` field on request');

    entry.response.cookies = safeParseJSON<HarResponse['cookies']>(metadata.warcResponseCookies, 'Malformed WARC record: Missing `cookies` field on response');
    entry.response.headersSize = parseInt(metadata.warcResponseHeadersSize);
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    entry.response.content = {} as { mimeType: string };
    if (metadata.warcResponseContentEncoding) {
        entry.response.content.encoding = metadata.warcResponseContentEncoding;
    }
}

function httpHeadersToKeyValue(record: WARCRecord): Array<{ name: string; value: string }> {
    return [...record.httpHeaders!.headers.entries()].map(([name, value]) => {
        return { name, value };
    });
}

function parseQueryString(path: string): Array<{ name: string; value: string }> {
    return [...new URLSearchParams(path.split('?')[1]).entries()]
        .map(([name, value]) => {
            return { name, value };
        });
}

async function populateEntryRequest(record: WARCRecord, entry: HarEntry): Promise<void> {
    const [method, path, httpVersion] = record.httpHeaders!.statusline.split(' ');
    const request: HarRequest = {
        ...entry.request,
        httpVersion,
        method,
        bodySize: 0,
        url: record.warcTargetURI!,
        headers: httpHeadersToKeyValue(record),
        queryString: parseQueryString(path),
    };

    entry.request = request;
}

async function populateEntryResponse(record: WARCRecord, entry: HarEntry): Promise<void> {
    const [httpVersion, status, ...statusTextParts] = record.httpHeaders!.statusline.split(' ');
    const headers = httpHeadersToKeyValue(record);
    const bodyEncoded = await record.readFully();
    const response: HarResponse = {
        ...entry.response,
        bodySize: bodyEncoded.length,
        headers,
        httpVersion,
        status: parseInt(status),
        statusText: statusTextParts.join(' '),
    };


    const mimeType = record.httpHeaders!.headers.get('content-type') ?? 'text/plain';
    response.content.mimeType = mimeType;
    response.content.size = bodyEncoded.length;

    const bodyBuffer = Buffer.from(bodyEncoded);
    // @ts-expect-error hack
    response.content.text = bodyBuffer.toString(entry.responseShouldBeEncoded ? 'base64' : 'utf8');

    entry.response = response;
}
