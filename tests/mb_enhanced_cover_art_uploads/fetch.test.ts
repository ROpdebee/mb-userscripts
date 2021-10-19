import { gmxhr, NetworkError } from '@lib/util/xhr';
import { ImageFetcher } from '@src/mb_enhanced_cover_art_uploads/fetch';
import { getMaximisedCandidates } from '@src/mb_enhanced_cover_art_uploads/maximise';
import { ArtworkTypeIDs, CoverArtProvider } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { getProvider } from '@src/mb_enhanced_cover_art_uploads/providers';

jest.mock('@lib/util/xhr');
// We need to provide a mock factory, because for some reason, either jest or
// rewire is not recognising the generator, leading to `getMaximisedCandidates`
// being undefined in this test suite.
jest.mock('@src/mb_enhanced_cover_art_uploads/maximise', () => {
    return {
        getMaximisedCandidates: jest.fn(),
    };
});
jest.mock('@src/mb_enhanced_cover_art_uploads/providers');

const mockXhr = gmxhr as jest.MockedFunction<typeof gmxhr>;
const mockGetMaximisedCandidates = getMaximisedCandidates as jest.MockedFunction<typeof getMaximisedCandidates>;
const mockGetProvider = getProvider as jest.MockedFunction<typeof getProvider>;

// Fake provider to enable us to control which images are extracted through
// this mock function.
const mockFindImages = jest.fn() as jest.MockedFunction<CoverArtProvider['findImages']>;
class FakeProvider extends CoverArtProvider {
    name = 'test';
    findImages = mockFindImages;
    supportedDomains = [];
    favicon = '';
    urlRegex = /example\.com\/(.+)/;
}

const fakeProvider = new FakeProvider();

// Utility setup functions
function disableMaximisation(): void {
    // eslint-disable-next-line require-yield
    mockGetMaximisedCandidates.mockImplementation(async function* () {
        return;
    });
}

function enableDummyFetch(mock: jest.SpiedFunction<ImageFetcher['fetchImageContents']>): void {
    // Return dummy response for fetching images
    mock.mockImplementation((url: URL, filename: string) =>
        Promise.resolve({
            fetchedUrl: url,
            requestedUrl: url,
            wasRedirected: false,
            file: new File([new Blob(['test'])], filename + '.0.jpg', { type: 'image/jpeg' }),
        }));
}

function disableDummyFetch(mock: jest.SpiedFunction<ImageFetcher['fetchImageContents']>): void {
    // Restore original implementation of fetchImageContents
    mock.mockRestore();
}

describe('fetching image contents', () => {
    let fetcher: ImageFetcher;
    const mockValidateFileFail = jest.fn();
    const mockValidateFileDone = jest.fn();
    // @ts-expect-error Mocking
    global.MB = {
        CoverArt: {
            validate_file: jest.fn().mockReturnValue({
                done: function(cb: () => void) {
                    mockValidateFileDone(cb);
                    return this;
                },
                fail: function(cb: () => void) {
                    mockValidateFileFail(cb);
                    return this;
                },
            }),
        },
    };
    function createMockXhrResponse(finalUrl: string): GMXMLHttpRequestResponse & { response: Blob } {
        return {
            response: new Blob(['abcd']),
            ...{} as unknown as GMXMLHttpRequestResponse,
            finalUrl,
        };
    }

    beforeEach(() => {
        fetcher = new ImageFetcher();
    });

    it('rejects on HTTP error', async () => {
        mockXhr.mockRejectedValueOnce(new NetworkError(new URL('https://example.com')));

        await expect(fetcher.fetchImageContents(new URL('https://example.com/broken'), 'test.jpg', {}))
            .rejects.toBeInstanceOf(NetworkError);
    });

    it('rejects on invalid file', async () => {
        mockXhr.mockResolvedValueOnce(createMockXhrResponse('https://example.com/broken'));
        mockValidateFileFail.mockImplementationOnce((cb) => cb('unsupported file type'));

        await expect(fetcher.fetchImageContents(new URL('https://example.com/broken'), 'test.jpg', {}))
            .rejects.toThrow('test.jpg has an unsupported file type');
    });

    it('resolves with fetched image', async () => {
        mockXhr.mockResolvedValueOnce(createMockXhrResponse('https://example.com/working'));
        mockValidateFileDone.mockImplementationOnce((cb) => cb('image/png'));

        await expect(fetcher.fetchImageContents(new URL('https://example.com/working'), 'test.jpg', {}))
            .resolves.toMatchObject({
                file: {
                    type: 'image/png',
                    name: 'test.jpg.0.png',
                },
                requestedUrl: {
                    href: 'https://example.com/working',
                },
                fetchedUrl: {
                    href: 'https://example.com/working',
                },
                wasRedirected: false,
            });
    });

    it('retains redirection information', async () => {
        mockXhr.mockResolvedValueOnce(createMockXhrResponse('https://example.com/redirected'));
        mockValidateFileDone.mockImplementationOnce((cb) => cb('image/png'));

        await expect(fetcher.fetchImageContents(new URL('https://example.com/working'), 'test.jpg', {}))
            .resolves.toMatchObject({
                requestedUrl: {
                    href: 'https://example.com/working',
                },
                fetchedUrl: {
                    href: 'https://example.com/redirected',
                },
                wasRedirected: true,
            });
    });

    it('assigns unique ID to each file name', async () => {
        mockXhr
            .mockResolvedValueOnce(createMockXhrResponse('https://example.com/working'))
            .mockResolvedValueOnce(createMockXhrResponse('https://example.com/working'));
        mockValidateFileDone
            .mockImplementationOnce((cb) => cb('image/png'))
            .mockImplementationOnce((cb) => cb('image/png'));

        await expect(fetcher.fetchImageContents(new URL('https://example.com/working'), 'test.jpg', {}))
            .resolves.toMatchObject({
                file: {
                    name: 'test.jpg.0.png',
                },
            });
        await expect(fetcher.fetchImageContents(new URL('https://example.com/working'), 'test.jpg', {}))
            .resolves.toMatchObject({
                file: {
                    name: 'test.jpg.1.png',
                },
            });
    });
});

describe('fetching image from URL', () => {
    let fetcher: ImageFetcher;
    let mockFetchImageContents: jest.SpiedFunction<ImageFetcher['fetchImageContents']>;

    beforeEach(() => {
        fetcher = new ImageFetcher();
        mockFetchImageContents = jest.spyOn(fetcher, 'fetchImageContents');
        enableDummyFetch(mockFetchImageContents);
    });

    afterEach(() => {
        disableDummyFetch(mockFetchImageContents);
    });

    describe('without maximisation', () => {

        beforeAll(() => {
            disableMaximisation();
        });

        it('does not maximise the image', async () => {
            await expect(fetcher.fetchImageFromURL(new URL('https://example.com/test')))
                .resolves.toHaveProperty('wasMaximised', false);
        });

        it('uses the URL filename if present', async () => {
            await expect(fetcher.fetchImageFromURL(new URL('https://example.com/test.jpg')))
                .resolves.toHaveProperty('content.name', 'test.jpg.0.jpg');
        });

        it('falls back to default filename if none present in URL', async () => {
            await expect(fetcher.fetchImageFromURL(new URL('https://example.com/test/')))
                .resolves.toHaveProperty('content.name', 'image.0.jpg');
        });

        it('retains redirection information', async () => {
            mockFetchImageContents.mockResolvedValueOnce({
                fetchedUrl: new URL('https://example.com/test/redirect'),
                requestedUrl: new URL('https://example.com/test/'),
                wasRedirected: true,
                file: new File([new Blob(['test'])],'test.0.jpg', { type: 'image/jpeg' }),
            });

            await expect(fetcher.fetchImageFromURL(new URL('https://example.com/test/')))
                .resolves.toMatchObject({
                    fetchedUrl: {
                        href: 'https://example.com/test/redirect',
                    },
                    maximisedUrl: {
                        href: 'https://example.com/test/',
                    },
                    wasRedirected: true,
                });
        });
    });

    describe('with maximisation', () => {
        beforeAll(() => {
            // Return 2 maximised candidates
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            mockGetMaximisedCandidates.mockImplementation(async function* (_smallurl) {
                // One with and one without filename to test extraction of file
                // names in maximised images too.
                yield {
                    url: new URL('https://example.com/1'),
                    filename: '1.png',
                    headers: {}
                };
                yield {
                    url: new URL('https://example.com/2'),
                    filename: '',
                    headers: {}
                };
            });
        });

        it('maximises the image', async () => {
            await expect(fetcher.fetchImageFromURL(new URL('https://example.com/test')))
                .resolves.toHaveProperty('wasMaximised', true);
        });

        it('fetches the first maximised candidate', async () => {
            await expect(fetcher.fetchImageFromURL(new URL('https://example.com/test')))
                .resolves.toHaveProperty('content.name', '1.png.0.jpg');
        });

        it('fetches the second maximised candidate if first fails', async () => {
            mockFetchImageContents.mockRejectedValueOnce(new Error('1.png has an unsupported file type'));

            await expect(fetcher.fetchImageFromURL(new URL('https://example.com/test')))
                .resolves.toHaveProperty('content.name', '2.0.jpg');
        });

        it('fetches the original URL if both candidates fail', async () => {
            mockFetchImageContents
                .mockRejectedValueOnce(new Error('1.png has an unsupported file type'))
                .mockRejectedValueOnce(new Error('2 has an unsupported file type'));

            await expect(fetcher.fetchImageFromURL(new URL('https://example.com/test')))
                .resolves.toHaveProperty('content.name', 'test.0.jpg');
        });

        it('fetches nothing if maximised URL already fetched', async () => {
            await fetcher.fetchImageFromURL(new URL('https://example.com/1.png'));

            await expect(fetcher.fetchImageFromURL(new URL('https://example.com/test')))
                .resolves.toBeUndefined();
        });
    });
});

describe('fetching images from providers', () => {
    let fetcher: ImageFetcher;
    let mockFetchImageContents: jest.SpiedFunction<ImageFetcher['fetchImageContents']>;

    beforeAll(() => {
        disableMaximisation();
    });

    beforeEach(() => {
        fetcher = new ImageFetcher();
        mockFetchImageContents = jest.spyOn(fetcher, 'fetchImageContents');
        enableDummyFetch(mockFetchImageContents);
    });

    afterEach(() => {
        disableDummyFetch(mockFetchImageContents);
    });

    it('returns no images if provider provides no images', async () => {
        mockFindImages.mockResolvedValueOnce([]);

        await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider))
            .resolves.toMatchObject({
                images: [],
                containerUrl: {
                    href: 'https://example.com/',
                },
            });
    });

    it('returns all images provided by provider', async () => {
        mockFindImages.mockResolvedValueOnce([{
            url: new URL('https://example.com/1'),
        }, {
            url: new URL('https://example.com/2'),
        }]);

        await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider))
            .resolves.toMatchObject({
                images: [{
                    content: {
                        name: '1.0.jpg',
                    },
                }, {
                    content: {
                        name: '2.0.jpg',
                    },
                }],
                containerUrl: {
                    href: 'https://example.com/',
                },
            });
    });

    it('retains type and comment if set by provider', async () => {
        mockFindImages.mockResolvedValueOnce([{
            url: new URL('https://example.com/1'),
            types: [ArtworkTypeIDs.Front],
            comment: 'comment'
        }]);

        await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider))
            .resolves.toMatchObject({
                images: [{
                    content: {
                        name: '1.0.jpg',
                    },
                    types: [ArtworkTypeIDs.Front],
                    comment: 'comment',
                }],
            });
    });

    it('skips image if image is already added', async () => {
        // Return the same image twice from the provider. Second image should
        // be skipped.
        mockFindImages.mockResolvedValue([{
            url: new URL('https://example.com/1'),
        }, {
            url: new URL('https://example.com/1'),
        }]);

        await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider))
            .resolves.toMatchObject({
                images: [{
                    content: {
                        name: '1.0.jpg',
                    },
                }],
            });
    });

    it('skips image if maximised image is already added', async () => {
        mockFindImages.mockResolvedValueOnce([{
            url: new URL('https://example.com/1'),
        }, {
            url: new URL('https://example.com/2'),
        }]);

        // Mocking the maximisation to return the same maximised URL for both
        // images. This should lead to the first URL being added and the second
        // one being skipped.
        async function* mockedImplementation(): ReturnType<typeof getMaximisedCandidates> {
            yield {
                url: new URL('https://example.com/3'),
                filename: '3',
                headers: {}
            };
        }
        mockGetMaximisedCandidates
            // Need to mock the implementation twice, once for each URL
            .mockImplementationOnce(mockedImplementation)
            .mockImplementationOnce(mockedImplementation);

        await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider))
            .resolves.toMatchObject({
                images: [{
                    content: {
                        name: '3.0.jpg',
                    },
                    originalUrl: new URL('https://example.com/1'),
                    maximisedUrl: new URL('https://example.com/3'),
                }],
                containerUrl: {
                    href: 'https://example.com/',
                },
            });
    });

    it('skips image on failure', async () => {
        mockFindImages.mockResolvedValueOnce([{
            url: new URL('https://example.com/1'),
        }]);
        mockFetchImageContents.mockRejectedValueOnce(new Error('1 has an unsupported file type'));

        await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider))
            .resolves.toMatchObject({
                images: [],
                containerUrl: {
                    href: 'https://example.com/',
                },
            });
    });
});

describe('fetching images', () => {
    let fetcher: ImageFetcher;
    let mockFetchImageContents: jest.SpiedFunction<ImageFetcher['fetchImageContents']>;

    beforeAll(() => {
        disableMaximisation();
    });

    beforeEach(() => {
        fetcher = new ImageFetcher();
        mockFetchImageContents = jest.spyOn(fetcher, 'fetchImageContents');
        enableDummyFetch(mockFetchImageContents);
    });

    afterEach(() => {
        disableDummyFetch(mockFetchImageContents);
    });

    it('fetches single image if no provider found', async () => {
        const result = await fetcher.fetchImages(new URL('https://example.com/1'));

        expect(result.images).toBeArrayOfSize(1);
        expect(result.images[0]).toMatchObject({
            content: {
                name: '1.0.jpg',
            },
        });
        expect(result).not.toHaveProperty('containerUrl');
    });

    it('fetches all images extracted from provider', async () => {
        mockGetProvider.mockImplementationOnce(() => fakeProvider);
        mockFindImages.mockResolvedValueOnce([{
            url: new URL('https://example.com/1'),
        }, {
            url: new URL('https://example.com/2'),
            types: [ArtworkTypeIDs.Front],
            comment: 'front'
        }]);

        const result = await fetcher.fetchImages(new URL('https://example.com/1'));

        expect(result.images).toBeArrayOfSize(2);
        expect(result.images[0]).toMatchObject({
            content: {
                name: '1.0.jpg',
            },
        });
        expect(result.images[1]).toMatchObject({
            content: {
                name: '2.0.jpg',
            },
            types: [ArtworkTypeIDs.Front],
            comment: 'front',
        });
        expect(result.containerUrl?.href).toBe('https://example.com/1');
    });

    it('does not fetch URL which was already fetched', async () => {
        await fetcher.fetchImages(new URL('https://example.com/1'));

        await expect(fetcher.fetchImages(new URL('https://example.com/1')))
            .resolves.toHaveProperty('images', []);
    });

    it('does not fetch maximised URL which was already fetched previously', async () => {
        await fetcher.fetchImages(new URL('https://example.com/1'));

        // Simulate 1 being maximal version of 2
        mockGetMaximisedCandidates.mockImplementationOnce(async function* () {
            yield {
                url: new URL('https://example.com/1'),
                filename: '1.png',
                headers: {}
            };
        });

        await expect(fetcher.fetchImages(new URL('https://example.com/2')))
            .resolves.toHaveProperty('images', []);
    });
});
