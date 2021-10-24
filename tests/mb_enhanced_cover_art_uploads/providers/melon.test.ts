import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { itBehavesLike } from '@test-utils/shared_behaviour';
import { urlMatchingSpec } from './url_matching_spec';
import { MelonProvider } from '@src/mb_enhanced_cover_art_uploads/providers/melon';

describe('melon provider', () => {
    // eslint-disable-next-line jest/require-hook
    const pollyContext = setupPolly();
    const provider = new MelonProvider();

    const supportedUrls = [{
        desc: 'release URLs',
        url: 'https://www.melon.com/album/detail.htm?albumId=10749882',
        id: '10749882',
    }];

    const unsupportedUrls = [{
        desc: 'artist URLs',
        url: 'https://www.melon.com/artist/timeline.htm?artistId=561051',
    }];

    // eslint-disable-next-line jest/require-hook
    itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });

    it('grabs cover for release', async () => {
        const covers = await provider.findImages(new URL('https://www.melon.com/album/detail.htm?albumId=10749882'));

        expect(covers).toBeArrayOfSize(1);
        expect(covers[0].url.href).toInclude('10749882_20211022144758');
        expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(covers[0].comment).toBeUndefined();
    });

    it('throws if release does not exist', async () => {
        pollyContext.polly.configure({
            recordFailedRequests: true,
        });

        await expect(provider.findImages(new URL('https://www.melon.com/album/detail.htm?albumId=0')))
            .toReject();
    });
});
