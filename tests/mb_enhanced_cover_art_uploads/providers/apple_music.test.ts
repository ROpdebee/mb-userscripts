import { setupPolly } from '@test-utils/pollyjs';

import { AppleMusicProvider } from '@src/mb_enhanced_cover_art_uploads/providers/apple_music';
import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { itBehavesLike } from '@test-utils/shared_behaviour';
import { urlMatchingSpec } from './url_matching_spec';

describe('apple music provider', () => {
    // eslint-disable-next-line jest/require-hook
    setupPolly();
    const provider = new AppleMusicProvider();

    const supportedUrls = [{
        desc: 'iTunes album URLs without album name',
        url: 'https://itunes.apple.com/gb/album/id993998924',
        id: '993998924',
    }, {
        desc: 'iTunes album URLs with album name',
        url: 'https://itunes.apple.com/us/album/dark-waves-ep/id919575861',
        id: '919575861',
    }, {
        desc: 'iTunes album URLs with album name with special characters',
        url: 'https://itunes.apple.com/us/album/flavourite-c%C3%A2l%C3%A2/id1451216499',
        id: '1451216499',
    }, {
        desc: 'Apple Music album URLs without album name',
        url: 'https://music.apple.com/gb/album/993998924',
        id: '993998924',
    }, {
        desc: 'Apple Music album URLs with album name',
        url: 'https://music.apple.com/us/album/dark-waves-ep/919575861',
        id: '919575861',
    }, {
        desc: 'Apple Music album URLs with album name with special characters',
        url: 'https://music.apple.com/us/album/flavourite-c%C3%A2l%C3%A2/1451216499',
        id: '1451216499',
    }];

    const unsupportedUrls = [{
        desc: 'iTunes artist URLs with name',
        url: 'https://itunes.apple.com/us/artist/s%C3%B4nge/id1193354626',
    }, {
        desc: 'iTunes artist URLs without name',
        url: 'https://itunes.apple.com/us/artist/id1193354626',
    }, {
        desc: 'Apple Music artist URLs with name',
        url: 'https://music.apple.com/us/artist/s%C3%B4nge/1193354626',
    }, {
        desc: 'Apple Music artist URLs without name',
        url: 'https://music.apple.com/us/artist/1193354626',
    }, {
        desc: 'Apple Music curator URLs',
        url: 'https://music.apple.com/us/curator/the-matt-wilkinson-show/1184566442',
    }, {
        desc: 'Apple Music grouping URLs',
        url: 'https://music.apple.com/us/grouping/34',
    }, {
        desc: 'Apple Music music video URLs',
        url: 'https://music.apple.com/us/music-video/sejodioto/1586865687',
    }];

    // eslint-disable-next-line jest/require-hook
    itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });

    it('considers redirect from iTunes to Apple Music to be safe', () => {
        expect(provider.isSafeRedirect(new URL('https://itunes.apple.com/gb/album/id993998924'), new URL('https://music.apple.com/gb/album/993998924')))
            .toBeTrue();
    });

    it('grabs the correct cover for Apple Music links', async () => {
        const coverUrl = await provider.findImages(new URL('https://music.apple.com/us/album/la-167/1586869902'));

        expect(coverUrl).toBeArrayOfSize(1);
        expect(coverUrl[0].url.pathname).toContain('02596b89-0475-9b14-3b51-934d24770ec3/886449572236.jpg');
        expect(coverUrl[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(coverUrl[0].comment).toBeUndefined();
    });

    it('grabs the image, not the video', async () => {
        const coverUrl = await provider.findImages(new URL('https://music.apple.com/us/album/expensive-pain/1585883836'));

        expect(coverUrl).toBeArrayOfSize(1);
        expect(coverUrl[0].url.pathname).toContain('3a4deeb4-9555-4bef-3836-185a913b0b20/075679769602.jpg');
        expect(coverUrl[0].url.pathname).toEndWith('.jpg');
    });

    it('grabs the correct cover for iTunes links', async () => {
        const coverUrl = await provider.findImages(new URL('https://itunes.apple.com/us/album/flavourite-c%C3%A2l%C3%A2/id1451216499'));

        expect(coverUrl).toBeArrayOfSize(1);
        expect(coverUrl[0].url.pathname).toContain('73bdc8dc-9ab2-ce6e-e581-4bb3d9e559fc/190295474089.jpg');
        expect(coverUrl[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(coverUrl[0].comment).toBeUndefined();
    });

    it('throws if Apple Music release is not available', async () => {
        // Apple Music doesn't actually return a 404 for releases which are
        // unavailable. It instead returns a 200 and has an alert popup.
        // Regardless, the image property won't exist, so this will still throw.
        await expect(provider.findImages(new URL('https://music.apple.com/gb/album/993998924')))
            .toReject();
    });

    it('throws if iTunes release is not available', async () => {
        await expect(provider.findImages(new URL('https://itunes.apple.com/gb/album/id993998924')))
            .toReject();
    });
});
