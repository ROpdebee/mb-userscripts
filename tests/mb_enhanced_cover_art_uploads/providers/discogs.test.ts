import { setupPolly } from '@test-utils/pollyjs';

import type { CoverArt } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { DiscogsProvider } from '@src/mb_enhanced_cover_art_uploads/providers/discogs';

describe('discogs provider', () => {
    const pollyContext = setupPolly();
    const provider = new DiscogsProvider();

    const urlCases = [
        ['short URL', 'https://www.discogs.com/release/9892912/', '9892912'],
        ['long URL', 'https://www.discogs.com/release/9892912-Wayne-King-And-His-Orchestra-A-Million-Dreams-Ago-One-Look-At-You', '9892912'],
    ];

    it.each(urlCases)('matches release links with %s', (_1, url) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeTrue();
    });

    it.each`
        url | type
        ${'https://www.discogs.com/artist/881122-Wayne-King-And-His-Orchestra'} | ${'artist'}
        ${'hhttps://www.discogs.com/master/1746505'} | ${'master'}
        ${'https://www.discogs.com/label/61808-Victor'} | ${'label'}
    `('does not match $type links', ({ url }: { url: string }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeFalse();
    });

    it.each(urlCases)('extracts IDs from %s', (_1, url, expectedId) => {
        expect(provider.extractId(new URL(url)))
            .toBe(expectedId);
    });

    describe('finding release images', () => {
        it('finds all images in 600x600', async () => {
            const covers = await provider.findImages(new URL('https://www.discogs.com/release/9892912'));

            expect(covers).toBeArrayOfSize(3);
            expect(covers[0].url.pathname).toBe('/cGX5KW1uJCaiPRzaRY8iE3btV3g=/fit-in/600x624/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-9892912-1579456707-2320.jpeg.jpg');
            expect(covers[1].url.pathname).toBe('/GjkwgdSXa6b6KAXHqtt1lrrSebQ=/fit-in/600x601/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-9892912-1579456707-4048.jpeg.jpg');
            expect(covers[2].url.pathname).toBe('/hch5Dfg5ZsgGY7DCxWtNWEpRSs8=/fit-in/600x681/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-9892912-1488067341-2872.jpeg.jpg');
            expect(covers).toSatisfyAll((cover: CoverArt) => typeof cover.types === 'undefined');
            expect(covers).toSatisfyAll((cover: CoverArt) => typeof cover.comment === 'undefined');
        });

        it('throws on non-existent release', async () => {
            pollyContext.polly.configure({
                recordFailedRequests: true,
            });

            await expect(provider.findImages(new URL('https://www.discogs.com/release/32342343')))
                .rejects.toMatchObject({ message: 'Discogs release does not exist' });
        });
    });

    describe('maximising image', () => {
        it('finds the image', async () => {
            const maxUrl = await DiscogsProvider.maximiseImage(new URL('https://img.discogs.com/husmGPLvKp_kDmwLCXA_fc75LcM=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-9892912-1579456707-2320.jpeg.jpg'));

            expect(maxUrl.pathname).toBe('/cGX5KW1uJCaiPRzaRY8iE3btV3g=/fit-in/600x624/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-9892912-1579456707-2320.jpeg.jpg');
        });
    });
});
