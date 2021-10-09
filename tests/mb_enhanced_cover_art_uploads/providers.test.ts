import { getProvider, hasProvider } from '@src/mb_enhanced_cover_art_uploads/providers';

describe('provider mapping', () => {
    it.each`
        url
        ${'https://itunes.apple.com/gb/album/id993998924'}
        ${'https://happysadportable.bandcamp.com/track/again-and-again'}
    `('has provider for $url', ({ url }: { url: string }) => {
        expect(hasProvider(new URL(url))).toBeTrue();
        expect(getProvider(new URL(url))).toBeDefined();
    });

    it.each`
        url
        ${'https://example.com/hello-world'}
        ${'https://powergameheavy.bandcamp.com/music'}
    `('does not have provider for $url', ({ url }: { url: string }) => {
        expect(hasProvider(new URL(url))).toBeFalse();
        expect(getProvider(new URL(url))).toBeUndefined();
    });
});
