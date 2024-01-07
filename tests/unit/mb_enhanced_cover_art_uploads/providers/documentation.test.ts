import '@src/mb_enhanced_cover_art_uploads/providers';

import fs from 'node:fs/promises';

import type { CoverArtProvider } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { DispatchMap } from '@lib/util/domain-dispatch';

jest.mock('@lib/util/domain-dispatch');

// eslint-disable-next-line jest/unbound-method
const spyDispatchMapSet = DispatchMap.prototype.set as jest.MockedFunction<DispatchMap<CoverArtProvider>['set']>;

function getAllProviderNamesInSource(): Set<string> {
    const providerNames = new Set<string>();

    for (const [, provider] of spyDispatchMapSet.mock.calls) {
        providerNames.add(provider.name);
    }

    return providerNames;
}

describe('cover art provider documentation', () => {
    const providerNamesInDocumentation = new Set<string>();

    beforeAll(async () => {
        const documentationContent = await fs.readFile('./src/mb_enhanced_cover_art_uploads/docs/supported_providers.md', {
            encoding: 'utf8',
        });

        for (const providerNameMatch of documentationContent.matchAll(/^\|([^|]+)\|/gm)) {
            for (const providerName of providerNameMatch[1].split('/')) {
                providerNamesInDocumentation.add(providerName.trim());
            }
        }
    });

    it.each([...getAllProviderNamesInSource()])('has an entry for %s', (providerName) => {
        expect(providerNamesInDocumentation.has(providerName)).toBeTrue();
    });
});
