/* eslint-disable jest/no-export, jest/consistent-test-it */

import type { CoverArtProvider } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { getProvider } from '@src/mb_enhanced_cover_art_uploads/providers';

interface SupportedURL {
    description: string;
    url: string;
    id: string;
}

interface UnsupportedURL {
    description: string;
    url: string;
}

interface SpecificationArguments {
    provider: CoverArtProvider;
    supportedUrls: SupportedURL[];
    unsupportedUrls: UnsupportedURL[];
}

export const urlMatchingSpec = ({ provider, supportedUrls, unsupportedUrls }: SpecificationArguments): void => {
    it.each(supportedUrls)('supports $description', ({ url }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeTrue();
    });

    it.each(unsupportedUrls)('does not support $description', ({ url }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeFalse();
    });

    it.each(supportedUrls)('extracts ID for $description', ({ url, id }) => {
        expect(provider.extractId(new URL(url)))
            .toBe(id);
    });

    // This test has two purposes:
    //   1. Additional testing of DispatchMap
    //   2. Making sure we don't forget to register a provider.
    it.each(supportedUrls)('can find the provider in the dispatch map for $description', ({ url }) => {
        // Expect them to be of the same class. We can't expect them to be
        // the exact same instance because the test suite that uses this
        // shared spec may create a whole other instance.
        expect(getProvider(new URL(url))?.constructor)
            .toBe(provider.constructor);
    });

    it.each(unsupportedUrls)('does not return provider from the dispatch map for $description', ({ url }) => {
        expect(getProvider(new URL(url)))
            .toBeUndefined();
    });
};
