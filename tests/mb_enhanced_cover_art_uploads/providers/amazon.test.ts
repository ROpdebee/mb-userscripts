import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { AmazonProvider } from '@src/mb_enhanced_cover_art_uploads/providers/amazon';
import { HTTPResponseError } from '@lib/util/xhr';

describe('amazon provider', () => {
    const pollyContext = setupPolly();
    const provider = new AmazonProvider();

    const urlCases = [
        ['dirty URL', 'https://www.amazon.com/Pattern-Seeking-Animals/dp/B07RZ2T9F1/ref=tmm_acd_swatch_0?_encoding=UTF8&qid=&sr=', 'B07RZ2T9F1'],
        ['dp URL', 'https://www.amazon.com/dp/B07RZ2T9F1', 'B07RZ2T9F1'],
        ['gp URL', 'https://www.amazon.com/gp/product/B07RZ2T9F1', 'B07RZ2T9F1'],
    ];

    it.each(urlCases)('matches product links with %s', (_1, url) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeTrue();
    });

    it('does not match other links', () => {
        expect(provider.supportsUrl(new URL('https://www.amazon.com/s/ref=dp_byline_sr_music_1?ie=UTF8&field-artist=Pattern-Seeking+Animals&search-alias=music')))
            .toBeFalse();
    });

    it.each(urlCases)('extracts IDs for product links with %s', (_1, url, expectedId) => {
        expect(provider.extractId(new URL(url)))
            .toBe(expectedId);
    });

    const extractionCases = [
        ['dp URLs', 'https://www.amazon.com/dp/B07QWNQT8X'],
        ['gp URLs', 'https://www.amazon.com/gp/product/B07QWNQT8X'],
    ];

    it.each(extractionCases)('grabs all images for physical products from the embedded JS on %s', async (_1, url) => {
        const covers = await provider.findImages(new URL(url));

        expect(covers).toBeArrayOfSize(5);
        expect(covers[0].url.pathname).toContain('81bqssuW6LL');
        expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(covers[1].url.pathname).toContain('61jZYB6BJYL');
        expect(covers[1].types).toStrictEqual([ArtworkTypeIDs.Back]);
        expect(covers[2].url.pathname).toContain('71TLgC33KgL');
        expect(covers[3].url.pathname).toContain('81JCfIAZ71L');
        expect(covers[4].url.pathname).toContain('816dglIIJHL');
    });

    it.each(extractionCases)('falls back to thumbnail grabbing for physical products on %s', async (_1, url) => {
        // mock the failed attempt of extracting images from embedded JS to trigger the thumbnail fallback
        const spy = jest.spyOn(provider, 'extractFromEmbeddedJS').mockImplementationOnce(() => undefined);
        const covers = await provider.findImages(new URL(url));

        expect(covers).toBeArrayOfSize(4);
        expect(covers[0].url.pathname).toContain('51nM1ikLWPL');
        expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(covers[1].url.pathname).toContain('41RQivjYeeL');
        expect(covers[1].types).toStrictEqual([ArtworkTypeIDs.Back]);
        expect(covers[2].url.pathname).toContain('31-n8wloCcL');
        expect(covers[3].url.pathname).toMatch(/41MN(?:%2B|\+)eLL(?:%2B|\+)JL/);

        spy.mockRestore();
    });

    it('returns no covers for product without images', async () => {
        const covers = await provider.findImages(new URL('https://www.amazon.com/dp/B000Q3KSMQ'));

        expect(covers).toBeEmpty();
    });

    it.each`
        url | desc
        ${'https://www.amazon.com/dp/B07R92TVWN'} | ${'dp URLs'}
        ${'https://www.amazon.com/gp/product/B07R92TVWN'} | ${'gp URLs'}
    `('grabs the only image for digital releases on $desc', async ({ url }: { url: string }) => {
        const covers = await provider.findImages(new URL(url));

        expect(covers).toBeArrayOfSize(1);
        expect(covers[0].url.pathname).toContain('819w7BrMFgL');
        expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(covers[0].comment).toBeUndefined();
    });

    it('throws on non-existent product', async () => {
        pollyContext.polly.configure({
            recordFailedRequests: true,
        });

        await expect(provider.findImages(new URL('http://amazon.com/gp/product/B01NCKFNXH')))
            .rejects.toBeInstanceOf(HTTPResponseError);
    });

    it('provides a favicon', () => {
        // Not resetting this after the tests, since this will only have an
        // effect on this suite anyway.
        // eslint-disable-next-line jest/prefer-spy-on
        global.GM_getResourceURL = jest.fn().mockReturnValueOnce('testFavicon');

        expect(provider.favicon).toBe('testFavicon');
    });
});
