import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { HTTPResponseError } from '@lib/util/xhr';
import { QubMusiqueProvider } from '@src/mb_enhanced_cover_art_uploads/providers/qub_musique';

describe('qub musique provider', () => {
    const pollyContext = setupPolly();
    const provider = new QubMusiqueProvider();

    const urlCases = [
        ['album URLs', 'https://www.qub.ca/musique/album/normal-de-l-est-w2l52wh19l0ib', 'w2l52wh19l0ib'],
        ['album URLs with numbers', 'https://www.qub.ca/musique/album/rapelles-saison-1-ysyh4e97276hc', 'ysyh4e97276hc'],
        ['dirty album URLs', 'https://www.qub.ca/musique/album/rapelles-saison-1-ysyh4e97276hc?test=123', 'ysyh4e97276hc'],
    ];
    const urlIgnoreCases = [
        ['artist URLs', 'https://www.qub.ca/musique/artiste/multi-artistes-3662940'],
        ['radio URLs', 'https://www.qub.ca/radio/balado/benoit-dutrizac'],
        ['article URLs', 'https://www.qub.ca/article/jean-charest-defend-le-regime-de-pekin-1058978600'],
    ];

    it.each(urlCases)('matches %s', (_1, url) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeTrue();
    });

    it.each(urlIgnoreCases)('does not match %s', (_1, url) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeFalse();
    });

    it.each(urlCases)('extracts ID for %s', (_1, url, expectedId) => {
        expect(provider.extractId(new URL(url)))
            .toBe(expectedId);
    });

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
