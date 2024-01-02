import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { AppleMusicProvider } from '@src/mb_enhanced_cover_art_uploads/providers/apple-music';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('apple music provider', () => {
    const provider = new AppleMusicProvider();

    describe('url matching', () => {
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
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'Apple Music release',
            url: 'https://music.apple.com/us/album/la-167/1586869902',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '02596b89-0475-9b14-3b51-934d24770ec3/886449572236.jpg',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            desc: 'iTunes release',
            url: 'https://itunes.apple.com/us/album/flavourite-c%C3%A2l%C3%A2/id1451216499',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '73bdc8dc-9ab2-ce6e-e581-4bb3d9e559fc/190295474089.jpg',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            desc: 'release with video cover',
            url: 'https://music.apple.com/us/album/expensive-pain/1585883836',
            numImages: 1,
            expectedImages: [{
                index: 0,
                // Needs to be the JPEG, not the video.
                urlPart: /3a4deeb4-9555-4bef-3836-185a913b0b20\/075679769602.*\.jpg$/,
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent Apple Music release',
            url: 'https://music.apple.com/gb/album/123456789',
        }, {
            desc: 'non-existent iTunes release',
            url: 'https://itunes.apple.com/gb/album/id123456789',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });

        it('considers redirect from iTunes to Apple Music to be safe', () => {
            const itunesUrl = new URL('https://itunes.apple.com/gb/album/id993998924');
            const appleMusicUrl = new URL('https://music.apple.com/gb/album/993998924');

            expect(provider['isSafeRedirect'](itunesUrl, appleMusicUrl))
                .toBeTrue();
        });
    });
});
