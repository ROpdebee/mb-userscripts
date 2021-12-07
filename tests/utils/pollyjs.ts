import path from 'path';
import type { PollyConfig } from '@pollyjs/core';
import FSPersister from '@pollyjs/persister-fs';
import type { Context } from 'setup-polly-jest';
import { setupPolly as realSetupPolly } from 'setup-polly-jest';

import GMXHRAdapter from './gmxhr-adapter';
import fetch from 'node-fetch';
import type { RequestInfo, RequestInit, Response } from 'node-fetch';

export function setupPolly(overrideOptions?: PollyConfig): Context {
    return realSetupPolly({
        // @ts-expect-error bad type declarations?
        adapters: [GMXHRAdapter],
        recordIfMissing: true,
        // @ts-expect-error bad type declarations?
        persister: FSPersister,
        persisterOptions: {
            fs: {
                recordingsDir: path.resolve('.', 'tests', 'test-data', '__recordings__'),
            },
        },
        ...overrideOptions ?? {},
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
