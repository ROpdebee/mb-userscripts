import path from 'path';
import type { PollyConfig } from '@pollyjs/core';
import FSPersister from '@pollyjs/persister-fs';
import type { Context } from 'setup-polly-jest';
import { setupPolly as realSetupPolly } from 'setup-polly-jest';

import GMXHRAdapter from './gmxhr-adapter';

export function setupPolly(overrideOptions?: PollyConfig): Context {
    return realSetupPolly({
        adapters: [GMXHRAdapter],
        recordIfMissing: true,
        persister: FSPersister,
        persisterOptions: {
            fs: {
                recordingsDir: path.resolve('.', 'tests', 'test-data', '__recordings__'),
            },
        },
        ...overrideOptions ?? {},
    });
}
