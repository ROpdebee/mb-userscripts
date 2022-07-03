import { when } from 'jest-when';

import type { CoverArt, ParsedTrackImage } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { gmxhr } from '@lib/util/xhr';
import { CoverArtProvider, HeadMetaPropertyProvider, ProviderWithTrackImages } from '@src/mb_enhanced_cover_art_uploads/providers/base';

import { createBlob, createFetchedImage, createXhrResponse } from '../test-utils/dummy-data';
import { registerMatchers } from '../test-utils/matchers';

jest.mock('@lib/util/xhr');
const mockXhr = gmxhr as jest.MockedFunction<typeof gmxhr>;

const findImagesMock = jest.fn();

beforeAll(() => {
    registerMatchers();
});

afterEach(() => {
    mockXhr.mockReset();
});

describe('cover art providers', () => {
    class FakeProvider extends CoverArtProvider {
        public readonly name = 'fake';
        public readonly favicon = '';
        public readonly supportedDomains = ['example.com'];
        public get urlRegex(): RegExp | RegExp[] {
            return /example\.com\/(.+)/;
        }

        public readonly findImages = findImagesMock;

        // Hoist some protected methods to public to facilitate testing
        public override cleanUrl(url: URL): string {
            return super.cleanUrl(url);
        }

        public override fetchPage(url: URL): Promise<string> {
            return super.fetchPage(url);
        }

        public override isSafeRedirect(originalUrl: URL, redirectedUrl: URL): boolean {
            return super.isSafeRedirect(originalUrl, redirectedUrl);
        }
    }
    const fakeProvider = new FakeProvider();

    describe('cleaning URL', () => {
        it('removes query parameters', () => {
            const result = fakeProvider.cleanUrl(new URL('https://example.com/test?x=1'));

            expect(result).toBe('example.com/test');
        });

        it('removes hash', () => {
            const result = fakeProvider.cleanUrl(new URL('https://example.com/test#hash'));

            expect(result).toBe('example.com/test');
        });
    });

    describe('url support', () => {
        describe('with single regex', () => {
            it('supports URL if regex matches', () => {
                expect(fakeProvider.supportsUrl(new URL('https://example.com/123?x=123')))
                    .toBeTrue();
            });

            it('does not support URL if regex does not match', () => {
                expect(fakeProvider.supportsUrl(new URL('https://test.com/abc')))
                    .toBeFalse();
            });

            it('extracts the ID', () => {
                expect(fakeProvider.extractId(new URL('https://example.com/123?x=123')))
                    .toBe('123');
            });
        });

        describe('with multiple regexes', () => {
            const regexMock = jest.spyOn(fakeProvider, 'urlRegex', 'get');

            beforeAll(() => {
                regexMock.mockReturnValue([
                    /example\.com\/([abc]{3})/,
                    /example\.com\/([123]{3})/,
                ]);
            });

            afterAll(() => {
                regexMock.mockRestore();
            });

            const matchCases = [
                ['first', 'https://example.com/aba', 'aba'],
                ['second', 'https://example.com/121', '121'],
            ];

            it.each(matchCases)('supports URL if %s regex matches', (_1, url) => {
                expect(fakeProvider.supportsUrl(new URL(url)))
                    .toBeTrue();
            });

            it('does not support URL if none of the regexes match', () => {
                expect(fakeProvider.supportsUrl(new URL('https://example.com/ded')))
                    .toBeFalse();
            });

            it.each(matchCases)('extracts ID for %s regex', (_1, url, id) => {
                expect(fakeProvider.extractId(new URL(url)))
                    .toBe(id);
            });

            it('extracts no ID if no regex matches', () => {
                expect(fakeProvider.extractId(new URL('https://example.com/ded')))
                    .toBeUndefined();
            });
        });
    });

    describe('checking redirects', () => {
        it('considers redirects with the same ID to be safe', () => {
            const originalUrl = 'https://example.com/1234';
            const redirectedUrl = 'https://example.com/1234?x=1234';

            expect(fakeProvider.isSafeRedirect(new URL(originalUrl), new URL(redirectedUrl)))
                .toBeTrue();
        });

        it('considers redirects with a different ID to be unsafe', () => {
            const originalUrl = 'https://example.com/1234';
            const redirectedUrl = 'https://example.com/5678';

            expect(fakeProvider.isSafeRedirect(new URL(originalUrl), new URL(redirectedUrl)))
                .toBeFalse();
        });
    });

    describe('fetching page', () => {
        const dummyResponse = createXhrResponse({
            responseText: '1234',
        });

        it('returns page content', async () => {
            mockXhr.mockResolvedValueOnce({
                ...dummyResponse,
                finalUrl: 'https://example.com/test',
            });

            await expect(fakeProvider.fetchPage(new URL('https://example.com/test')))
                .resolves.toBe('1234');
        });

        it('throws on unsafe redirects', async () => {
            mockXhr.mockResolvedValueOnce({
                ...dummyResponse,
                finalUrl: 'https://example.com/redirected',
            });

            await expect(fakeProvider.fetchPage(new URL('https://example.com/redirect_me')))
                .rejects.toThrowWithMessage(Error, /different release/);
        });
    });

    describe('post-processing images', () => {
        it('does no post-processing by default', async () => {
            const fetchedImage = createFetchedImage();

            const result = await fakeProvider.postprocessImage(fetchedImage);

            expect(result).toStrictEqual(fetchedImage);
        });
    });
});

describe('providers using head meta element', () => {
    class FakeProvider extends HeadMetaPropertyProvider {
        public readonly name = 'fake';
        public readonly favicon = '';
        public readonly supportedDomains = ['example.com'];
        protected readonly urlRegex = /example\.com\/(.+)/;

        public override fetchPage(url: URL): Promise<string> {
            return super.fetchPage(url);
        }
    }
    const fakeProvider = new FakeProvider();
    const mockFetchPage = jest.spyOn(fakeProvider, 'fetchPage');

    it('extracts cover URL from og:image meta element', async () => {
        mockFetchPage.mockResolvedValueOnce('<html><head><meta property="og:image" content="https://example.com/1234"/></head></html>');

        const result = await fakeProvider.findImages(new URL('https://example.com/test'));

        expect(result).toBeArrayOfSize(1);
        expect(result[0]).toMatchCoverArt({
            urlPart: 'https://example.com/1234',
            types: [ArtworkTypeIDs.Front],
        });
    });

    it('throws if release does not exist', async () => {
        mockFetchPage.mockResolvedValueOnce('<html />');
        // @ts-expect-error mocking
        jest.spyOn(fakeProvider, 'is404Page').mockReturnValueOnce(true);

        await expect(fakeProvider.findImages(new URL('https://example.com/test')))
            .rejects.toThrowWithMessage(Error, 'fake release does not exist');
    });
});

describe('providers with track images', () => {
    class FakeProvider extends ProviderWithTrackImages {
        public readonly name = 'fake';
        public readonly favicon = '';
        public readonly supportedDomains = ['example.com'];
        protected readonly urlRegex = /example\.com\/(.+)/;
        public readonly findImages = findImagesMock;
        // Hoist the function to be public instead of protected, so we can
        // call it directly in the tests.
        public override mergeTrackImages(trackImages: Array<ParsedTrackImage | undefined>, mainUrl: string, byContent = false): Promise<CoverArt[]> {
            return super.mergeTrackImages(trackImages, mainUrl, byContent);
        }
    }
    const fakeProvider = new FakeProvider();

    describe('merging track images', () => {
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
            const results = await fakeProvider.mergeTrackImages(trackImages.slice(0, 1), 'https://example.com/123', false);

            expect(results).toBeEmpty();
        });

        it('retains track images which are new', async () => {
            const results = await fakeProvider.mergeTrackImages(trackImages.slice(0, 1), 'https://example.com/456', false);

            expect(results).toBeArrayOfSize(1);
            expect(results[0]).toMatchCoverArt({
                urlPart: 'https://example.com/123',
                types: [ArtworkTypeIDs.Track],
                comment: 'Track 1',
            });
        });

        it('sets track number in comment', async () => {
            const results = await fakeProvider.mergeTrackImages(trackImages.slice(0, 1), 'https://example.com/456', false);

            expect(results).toBeArrayOfSize(1);
            expect(results[0].comment).toBe('Track 1');
        });

        it('deduplicates track images', async () => {
            const results = await fakeProvider.mergeTrackImages(trackImages, 'https://example.com/x', false);

            expect(results).toBeArrayOfSize(2);
        });

        it('sets all track numbers in comment', async () => {
            const results = await fakeProvider.mergeTrackImages(trackImages, 'https://example.com/x', false);

            expect(results.find((img) => img.url.pathname === '/123')?.comment)
                .toBe('Tracks 1, 3');
        });

        it('properly sorts track numbers in comment', async () => {
            const trackImages = [{
                url: 'https://example.com/123',
                trackNumber: '3',
            }, {
                url: 'https://example.com/123',
                trackNumber: '10',
            }, {
                url: 'https://example.com/123',
                trackNumber: '2',
            }, {
                url: 'https://example.com/123',
                trackNumber: '1',
            }];
            const results = await fakeProvider.mergeTrackImages(trackImages, 'https://example.com/x', false);

            expect(results.find((img) => img.url.pathname === '/123')?.comment)
                .toBe('Tracks 1, 2, 3, 10');
        });

        it('sets no comment if track image cannot be determined', async () => {
            const trackImages = [{
                url: 'https://example.com/123',
            }];
            const results = await fakeProvider.mergeTrackImages(trackImages, 'https://example.com/x', false);

            expect(results[0].comment).toBeUndefined();
        });

        describe('deduplicating by content', () => {
            it('deduplicates images with identical thumbnail content', async () => {
                when(mockXhr)
                    // Use specific blob for the main image
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    .calledWith('https://example.com/x', expect.anything())
                    .mockResolvedValue(createXhrResponse({
                        response: createBlob(),
                    }))
                    // Always use the same image for any other request, but this
                    // image is different from the previous one.
                    .defaultResolvedValue(createXhrResponse({
                        response: createBlob(),
                    }));

                const results = await fakeProvider.mergeTrackImages(trackImages, 'https://example.com/x', true);

                expect(results).toBeArrayOfSize(1);
                expect(results[0]).toMatchCoverArt({
                    urlPart: /https:\/\/example\.com\/(?:123|456)/,
                    types: [ArtworkTypeIDs.Track],
                    comment: 'Tracks 1, 2, 3',
                });
            });

            it('removes track images which are identical to main image', async () => {
                mockXhr.mockResolvedValue(createXhrResponse({
                    response: createBlob(),
                }));

                const results = await fakeProvider.mergeTrackImages(trackImages, 'https://example.com/x', true);

                expect(results).toBeEmpty();
            });

            it('allows main image to be empty', async () => {
                mockXhr.mockResolvedValue(createXhrResponse({
                    response: createBlob(),
                }));

                const results = await fakeProvider.mergeTrackImages(trackImages, '', true);

                expect(results).toBeArrayOfSize(1);
                expect(results[0]).toMatchCoverArt({
                    urlPart: /https:\/\/example\.com\/(?:123|456)/,
                    types: [ArtworkTypeIDs.Track],
                    comment: 'Tracks 1, 2, 3',
                });
            });

            it('does not deduplicate if there are no track images', async () => {
                await fakeProvider.mergeTrackImages([], 'https://example.com/x', true);

                expect(mockXhr).not.toHaveBeenCalled();
            });

            it('does not deduplicate if there is one track image and no main image', async () => {
                await fakeProvider.mergeTrackImages(trackImages.slice(0, 1), '', true);

                expect(mockXhr).not.toHaveBeenCalled();
            });

            it('deduplicates if there is one track image and one main image', async () => {
                mockXhr.mockResolvedValue(createXhrResponse({
                    response: createBlob(),
                }));

                const results = await fakeProvider.mergeTrackImages(trackImages.slice(0, 1), 'https://example.com/x', true);

                expect(results).toBeEmpty();
                expect(mockXhr).toHaveBeenCalledTimes(2);
            });
        });
    });
});
