import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { HTTPResponseError } from '@lib/util/xhr';
import { QubMusiqueProvider } from '@src/mb_enhanced_cover_art_uploads/providers/qub_musique';
import { itBehavesLike } from '@test-utils/shared_behaviour';
import { urlMatchingSpec } from './url_matching_spec';

describe('qub musique provider', () => {
    const pollyContext = setupPolly();
    const provider = new QubMusiqueProvider();

    const supportedUrls = [{
        desc: 'album URLs',
        url: 'https://www.qub.ca/musique/album/normal-de-l-est-w2l52wh19l0ib',
        id: 'w2l52wh19l0ib',
    }, {
        desc: 'album URLs with numbers',
        url: 'https://www.qub.ca/musique/album/rapelles-saison-1-ysyh4e97276hc',
        id: 'ysyh4e97276hc',
    }, {
        desc: 'dirty album URLs',
        url: 'https://www.qub.ca/musique/album/rapelles-saison-1-ysyh4e97276hc?test=123',
        id: 'ysyh4e97276hc',
    }];

    const unsupportedUrls = [{
        desc: 'artist URLs',
        url: 'https://www.qub.ca/musique/artiste/multi-artistes-3662940',
    }, {
        desc: 'radio URLs',
        url: 'https://www.qub.ca/radio/balado/benoit-dutrizac',
    }, {
        desc: 'article URLs',
        url: 'https://www.qub.ca/article/jean-charest-defend-le-regime-de-pekin-1058978600',
    }];

    // eslint-disable-next-line jest/require-hook
    itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });

    it('finds cover image', async () => {
        const covers = await provider.findImages(new URL('https://www.qub.ca/musique/album/pour-le-plug-dbssxi6nl5fuc'));

        expect(covers).toBeArrayOfSize(1);
        expect(covers[0].url.pathname).toBe('/images/covers/uc/5f/dbssxi6nl5fuc_org.jpg');
        expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(covers[0].comment).toBeUndefined();
    });

    it('throws on non-existent release', async () => {
        pollyContext.polly.configure({
            recordFailedRequests: true,
        });

        await expect(provider.findImages(new URL('https://www.qub.ca/musique/album/pour-le-plug-dbssx')))
            .rejects.toBeInstanceOf(HTTPResponseError);
    });
});
