import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
// @ts-expect-error rewired
import { QobuzProvider, __set__ } from '@src/mb_enhanced_cover_art_uploads/providers/qobuz';
import { HTTPResponseError } from '@lib/util/xhr';

describe('qobuz provider', () => {
    const pollyContext = setupPolly();
    const provider = new QobuzProvider();

    it.each`
        url | desc
        ${'https://www.qobuz.com/gb-en/album/crime-of-the-century-2014-hd-remaster-supertramp/0060075354770'} | ${'www URLs with language'}
        ${'https://www.qobuz.com/album/crime-of-the-century-2014-hd-remaster-supertramp/0060075354770'} | ${'www URLs without language'}
        ${'https://open.qobuz.com/album/0074643811224'} | ${'open URLs'}
    `('matches $desc links for release', ({ url }: { url: string }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeTrue();
    });

    it.each`
        url | type
        ${'https://www.qobuz.com/gb-en/label/universal-music-group-international/download-streaming-albums'} | ${'label'}
        ${'https://www.qobuz.com/nl-nl/label/universal-music-group-international/download-streaming-albums/92570'} | ${'label with ID'}
        ${'https://www.qobuz.com/nl-nl/interpreter/supertramp/download-streaming-albums'} | ${'artist'}
        ${'https://open.qobuz.com/artist/50195'} | ${'open artist'}
    `('does not match $type links', ({ url }: { url: string }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeFalse();
    });

    describe('extracting IDs', () => {
        it.each`
            url | desc | id
            ${'https://www.qobuz.com/gb-en/album/crime-of-the-century-2014-hd-remaster-supertramp/0060075354770'} | ${'www URLs with language'} | ${'0060075354770'}
            ${'https://www.qobuz.com/album/crime-of-the-century-2014-hd-remaster-supertramp/0060075354770'} | ${'www URLs without language'} | ${'0060075354770'}
            ${'https://open.qobuz.com/album/0074643811224'} | ${'open URLs'} | ${'0074643811224'}
        `('extracts the correct ID for $desc', ({ url, id }: { url: string; id: string }) => {
            expect(QobuzProvider.extractId(new URL(url)))
                .toBe(id);
        });
    });

    describe('finding release images', () => {

        it('finds cover image without booklet if there is no booklet', async () => {
            const covers = await provider.findImages(new URL('https://open.qobuz.com/album/0060075330437'));

            expect(covers).toBeArrayOfSize(1);
            expect(covers[0].url.pathname).toBe('/images/covers/37/04/0060075330437_org.jpg');
            expect(covers[0].type).toStrictEqual([ArtworkTypeIDs.Front]);
            expect(covers[0].comment).toBeUndefined();
        });

        it('includes the booklet if there is one', async () => {
            const covers = await provider.findImages(new URL('https://open.qobuz.com/album/0825646089178'));

            expect(covers).toBeArrayOfSize(2);
            expect(covers[0].url.pathname).toBe('/images/covers/78/91/0825646089178_org.jpg');
            expect(covers[0].type).toStrictEqual([ArtworkTypeIDs.Front]);
            expect(covers[0].comment).toBeUndefined();
            expect(covers[1].url.pathname).toEndWith('000078807.pdf');
            expect(covers[1].type).toStrictEqual([ArtworkTypeIDs.Booklet]);
            expect(covers[1].comment).toBe('Qobuz booklet');
        });

        it('throws on non-existent release', async () => {
            pollyContext.polly.configure({
                recordFailedRequests: true,
            });

            await expect(provider.findImages(new URL('https://open.qobuz.com/album/123')))
                .rejects.toBeInstanceOf(HTTPResponseError);
        });

        describe('with invalid app ID', () => {
            // Separate describe block so we can patch out console.error before
            // this single test case, while leaving it in place for other tests.

            beforeAll(() => {
                // Need to patch out console.error, since it's expected to be
                // called in this test case but jest prints the message even
                // though the test passes. There seems to be no straightforward
                // way of disabling this for a single test case only.
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                jest.spyOn(console, 'error').mockImplementationOnce(() => {});
            });

            afterAll(() => {
                // @ts-expect-error mocked
                console.error.mockRestore();
            });

            it('throws on invalid app ID', async () => {
                __set__('QOBUZ_APP_ID', '123');
                pollyContext.polly.configure({
                    recordFailedRequests: true,
                });

                await expect(provider.findImages(new URL('https://open.qobuz.com/album/0825646089178')))
                    .rejects.toMatchObject({
                        message: expect.toEndWith('app ID invalid?'),
                    });
            });
        });
    });

    describe('extracting goodies', () => {
        it('sets booklet type if goodie is a booklet', () => {
            const cover = QobuzProvider.extractGoodies({
                original_url: 'https://example.com/original_url',
                url: 'https://example.com/url',
                name: 'Livret Numérique',
                id: 123,
                file_format_id: 456,
                description: 'test',
            });

            expect(cover.url.href).toBe('https://example.com/original_url');
            expect(cover.type).toStrictEqual([ArtworkTypeIDs.Booklet]);
            expect(cover.comment).toBe('Qobuz booklet');
        });

        it('sets no type if goodie is not a booklet', () => {
            const cover = QobuzProvider.extractGoodies({
                original_url: 'https://example.com/original_url',
                url: 'https://example.com/url',
                name: 'not a booklet',
                id: 123,
                file_format_id: 456,
                description: 'test',
            });

            expect(cover.url.href).toBe('https://example.com/original_url');
            expect(cover.type).toBeEmpty();
            expect(cover.comment).toBe('not a booklet');
        });
    });

    describe('constructing cover URL from ID', () => {
        it('constructs the correct cover URL', () => {
            // Not the most powerful of tests, the output of this method will
            // likely be nonsensical if an ID with less that 4 characters is
            // provided, but we're assuming that won't happen.
            expect(QobuzProvider.idToCoverUrl('0825646089178').href)
                .toBe('https://static.qobuz.com/images/covers/78/91/0825646089178_org.jpg');
        });
    });
});
