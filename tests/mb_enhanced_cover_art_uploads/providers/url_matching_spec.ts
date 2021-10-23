import type { CoverArtProvider } from '@src/mb_enhanced_cover_art_uploads/providers/base';

interface SupportedURL {
    desc: string;
    url: string;
    id: string;
}

interface UnsupportedURL {
    desc: string;
    url: string;
}

interface SpecArgs {
    provider: CoverArtProvider;
    supportedUrls: SupportedURL[];
    unsupportedUrls: UnsupportedURL[];
}

// eslint-disable-next-line jest/no-export
export const urlMatchingSpec = ({ provider, supportedUrls, unsupportedUrls }: SpecArgs): void => {
    describe('url matching', () => {
        it.each(supportedUrls)('supports $desc', ({ url }) => {
            expect(provider.supportsUrl(new URL(url)))
                .toBeTrue();
        });

        it.each(unsupportedUrls)('does not support $desc', ({ url }) => {
            expect(provider.supportsUrl(new URL(url)))
                .toBeFalse();
        });

        it.each(supportedUrls)('extracts ID for $desc', ({ url, id }) => {
            expect(provider.extractId(new URL(url)))
                .toBe(id);
        });
    });
};
