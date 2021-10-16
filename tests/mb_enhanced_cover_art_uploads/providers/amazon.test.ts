import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { AmazonProvider } from '@src/mb_enhanced_cover_art_uploads/providers/amazon';
import { HTTPResponseError } from '@lib/util/xhr';

describe('amazon provider', () => {
    const pollyContext = setupPolly();
    const provider = new AmazonProvider();

    it.each`
        url | desc
        ${'https://www.amazon.com/Pattern-Seeking-Animals/dp/B07RZ2T9F1/ref=tmm_acd_swatch_0?_encoding=UTF8&qid=&sr='} | ${'with dirty URL'}
        ${'https://www.amazon.com/dp/B07RZ2T9F1'} | ${'with dp link'}
        ${'https://www.amazon.com/gp/product/B07RZ2T9F1'} | ${'with gp link'}
    `('matches product links $desc', ({ url }: { url: string }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeTrue();
    });

    it('does not match other links', () => {
        expect(provider.supportsUrl(new URL('https://www.amazon.com/s/ref=dp_byline_sr_music_1?ie=UTF8&field-artist=Pattern-Seeking+Animals&search-alias=music')))
            .toBeFalse();
    });

    it.each`
        url | desc
        ${'https://www.amazon.com/dp/B07QWNQT8X'} | ${'dp URLs'}
        ${'https://www.amazon.com/gp/product/B07QWNQT8X'} | ${'gp URLs'}
    `('grabs all images for physical products on $desc', async ({ url }: { url: string }) => {
        const covers = await provider.findImages(new URL(url));

        expect(covers).toBeArrayOfSize(4);
        expect(covers[0].url.pathname).toContain('51nM1ikLWPL');
        expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(covers[1].url.pathname).toContain('41RQivjYeeL');
        expect(covers[2].url.pathname).toContain('31-n8wloCcL');
        expect(covers[3].url.pathname).toMatch(/41MN(?:%2B|\+)eLL(?:%2B|\+)JL/);
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
