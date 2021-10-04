// We need to stub GM_getResourceURL, since it's not defined in node but required
// upon initialisation of some providers (e.g. Amazon). However, when we import
// from the base providers module, the Amazon provider is instantiated immediately.
// Thus, GM_getResourceURL needs to be stubbed before importing. But even then,
// the stubbed implementation does not apply on the static import (perhaps
// because of jest or rewire, perhaps for another reason). So, as a workaround,
// we're dynamically importing those functions before running the tests, but
// after mocking the GM_getResourceURL function.

import type { getProvider, hasProvider } from '@src/mb_enhanced_cover_art_uploads/providers';

// spyOn only works for functions that are defined.
// eslint-disable-next-line jest/prefer-spy-on
global.GM_getResourceURL = jest.fn().mockReturnValue('');

let getProviderFn: typeof getProvider;
let hasProviderFn: typeof hasProvider;

beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('@src/mb_enhanced_cover_art_uploads/providers');
    getProviderFn = mod.getProvider;
    hasProviderFn = mod.hasProvider;
});

describe('provider mapping', () => {
    it.each`
        url
        ${'https://itunes.apple.com/gb/album/id993998924'}
        ${'https://happysadportable.bandcamp.com/track/again-and-again'}
    `('has provider for $url', ({ url }: { url: string }) => {
        expect(hasProviderFn(new URL(url))).toBeTrue();
        expect(getProviderFn(new URL(url))).toBeDefined();
    });

    it.each`
        url
        ${'https://example.com/hello-world'}
        ${'https://powergameheavy.bandcamp.com/music'}
    `('does not have provider for $url', ({ url }: { url: string }) => {
        expect(hasProviderFn(new URL(url))).toBeFalse();
        expect(getProviderFn(new URL(url))).toBeUndefined();
    });
});
