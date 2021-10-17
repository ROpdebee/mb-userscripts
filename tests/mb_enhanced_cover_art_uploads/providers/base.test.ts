import type { CoverArt } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { CoverArtProvider } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { gmxhr } from '@lib/util/xhr';

jest.mock('@lib/util/xhr');
const mockXhr = gmxhr as jest.MockedFunction<typeof gmxhr>;

describe('cover art providers', () => {
    describe('fetching DOM', () => {
        it('throws on unsafe redirects', async () => {
            class FakeProvider extends CoverArtProvider {
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

            await expect(fakeProvider.fetchPageDOM(new URL('https://example.com/redirect_me')))
                .rejects.toMatchObject({
                    message: expect.stringMatching('different release'),
                });
        });
    });
});
