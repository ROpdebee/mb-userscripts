import type { CoverArt, ParsedTrackImage } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { ArtworkTypeIDs, ProviderWithTrackImages } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { gmxhr } from '@lib/util/xhr';

jest.mock('@lib/util/xhr');
const mockXhr = gmxhr as jest.MockedFunction<typeof gmxhr>;

class FakeProvider extends ProviderWithTrackImages {
    name = 'fake';
    favicon = '';
    supportedDomains = ['example.com'];
    urlRegex = /example\.com\/(.+)/;
    async findImages(): Promise<CoverArt[]> {
        return [];
    }
    override isSafeRedirect(): boolean {
        return false;
    }
}

describe('cover art providers', () => {
    describe('fetching DOM', () => {
        it('throws on unsafe redirects', async () => {
            const fakeProvider = new FakeProvider();
            mockXhr.mockResolvedValueOnce({
                response: new Blob(['1234']),
                finalUrl: 'https://example.com/redirected',
                readyState: 4,
                responseHeaders: '',
                responseText: '1234',
                status: 200,
                statusText: 'OK',
                context: undefined,
            });

            await expect(fakeProvider.fetchPage(new URL('https://example.com/redirect_me')))
                .rejects.toMatchObject({
                    message: expect.stringMatching('different release'),
                });
        });
    });

    describe('merging track images', () => {
        class ExposingProvider extends FakeProvider {
            // Hoist the function to be public instead of protected, so we can
            // call it directly in the tests.
            override mergeTrackImages(trackImages: Array<ParsedTrackImage | undefined>, mainUrl: string, byContent = false): Promise<CoverArt[]> {
                return super.mergeTrackImages(trackImages, mainUrl, byContent);
            }
        }
        const provider = new ExposingProvider();
        const trackImages = [{
            url: 'https://example.com/123',
            trackNumber: '1',
        }, {
            url: 'https://example.com/456',
            trackNumber: '2',
        }, {
            url: 'https://example.com/123',
            trackNumber: '3',
        }];

        it('removes track images which duplicate the main image', async () => {
            const results = await provider.mergeTrackImages(trackImages.slice(0, 1), 'https://example.com/123', false);

            expect(results).toBeEmpty();
        });

        it('retains track images which are new', async () => {
            const results = await provider.mergeTrackImages(trackImages.slice(0, 1), 'https://example.com/456', false);

            expect(results).toBeArrayOfSize(1);
            expect(results[0].url.href).toBe('https://example.com/123');
            expect(results[0].types).toStrictEqual([ArtworkTypeIDs.Track]);
        });

        it('sets track number in comment', async () => {
            const results = await provider.mergeTrackImages(trackImages.slice(0, 1), 'https://example.com/456', false);

            expect(results).toBeArrayOfSize(1);
            expect(results[0].comment).toBe('Track 1');
        });

        it('deduplicates track images', async () => {
            const results = await provider.mergeTrackImages(trackImages, 'https://example.com/x', false);

            expect(results).toBeArrayOfSize(2);
        });

        it('sets all track numbers in comment', async () => {
            const results = await provider.mergeTrackImages(trackImages, 'https://example.com/x', false);

            expect(results.find((img) => img.url.pathname === '/123')?.comment)
                .toBe('Tracks 1, 3');
        });

        it('sets no comment if track image cannot be determined', async () => {
            const trackImages = [{
                url: 'https://example.com/123',
            }];
            const results = await provider.mergeTrackImages(trackImages, 'https://example.com/x', false);

            expect(results[0].comment).toBeUndefined();
        });
    });
});
