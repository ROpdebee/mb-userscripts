import path from 'node:path';

import type { PollyConfig } from '@pollyjs/core';
import type { RequestInfo, RequestInit, Response } from 'node-fetch';
import type { Context } from 'setup-polly-jest';
import fetch from 'node-fetch';
import { setupPolly as realSetupPolly } from 'setup-polly-jest';

import GMXHRAdapter from './gmxhr-adapter';
import { WarcPersister } from './warc-persister';

export function setupPolly(overrideOptions?: PollyConfig): Context {
    return realSetupPolly({
        adapters: [GMXHRAdapter],
        recordIfMissing: true,
        persister: WarcPersister,
        persisterOptions: {
            'fs-warc': {
                recordingsDir: path.resolve('.', 'tests', 'test-data', '__recordings__'),
            },
        },
        ...overrideOptions,
    });
}

export function mockFetch(baseOrigin?: string): void {
    if (!baseOrigin) {
        // @ts-expect-error Mocking
        global.fetch = fetch;
        return;
    }

    // Adapt the URLs passed to node-fetch. We can use URLs without a domain
    // in the browser, but that's not possible in node.
    function makeAbsoluteURLAndFetch(info: RequestInfo, init?: RequestInit): Promise<Response> {
        if (typeof info === 'string') {
            return fetch(new URL(info, baseOrigin).href, init);
        }

        if (new URL(info.url, baseOrigin).href !== info.url) {
            console.warn('Fetched URL may have wrong origin, but cannot be adapted automatically.');
        }
        return fetch(info, init);
    }

    // @ts-expect-error Mocking
    global.fetch = makeAbsoluteURLAndFetch;
}
