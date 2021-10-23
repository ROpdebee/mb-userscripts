import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { AmazonMusicProvider } from '@src/mb_enhanced_cover_art_uploads/providers/amazon_music';
import { itBehavesLike } from '@test-utils/shared_behaviour';
import { urlMatchingSpec } from './url_matching_spec';

describe('amazon music provider', () => {
    // eslint-disable-next-line jest/require-hook
    setupPolly();
    const provider = new AmazonMusicProvider();

    const supportedUrls = [{
        desc: 'album URLs',
        url: 'https://music.amazon.com/albums/B08Y99SFVJ',
        id: 'B08Y99SFVJ',
    }];

    const unsupportedUrls = [{
        desc: 'artist URLs',
        url: 'https://music.amazon.com/artists/B08YC6GFB7/hannapeles',
    }, {
        desc: 'playlist URLs',
        url: 'https://music.amazon.com/playlists/B07H8NWNNF',
    }];

    // eslint-disable-next-line jest/require-hook
    itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });

    it('uses Amazon provider covers', async () => {
        const covers = await provider.findImages(new URL('https://music.amazon.com/albums/B08MCFCQD8'));

        expect(covers).toBeArrayOfSize(1);
        expect(covers[0].url.pathname).toContain('81NnKXVjJvL');
        expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
    });
});
