import type { FetchedImage } from '@src/mb_enhanced_cover_art_uploads/fetch';
import type { MaximisedImage } from '@src/mb_enhanced_cover_art_uploads/maximise';
import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { gmxhr, NetworkError } from '@lib/util/xhr';
import { ImageFetcher } from '@src/mb_enhanced_cover_art_uploads/fetch';
import { getMaximisedCandidates } from '@src/mb_enhanced_cover_art_uploads/maximise';
import { getProvider, getProviderByDomain } from '@src/mb_enhanced_cover_art_uploads/providers';
import { CoverArtProvider } from '@src/mb_enhanced_cover_art_uploads/providers/base';

import { createCoverArt, createImageFile, createXhrResponse } from './test-utils/dummy-data';

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
const mockGetProviderByDomain = getProviderByDomain as jest.MockedFunction<typeof getProvider>;

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
    mockGetMaximisedCandidates.mockImplementation(async function* (): AsyncGenerator<MaximisedImage, undefined, undefined> {
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
            file: createImageFile({
                name: filename.replace(/\.\w+$/, '') + '.0.jpg',
                mimeType: 'image/jpeg',
            }),
        }));
}

function disableDummyFetch(mock: jest.SpiedFunction<ImageFetcher['fetchImageContents']>): void {
    // Restore original implementation of fetchImageContents
    mock.mockRestore();
}

describe('fetching image contents', () => {
    let fetcher: ImageFetcher;

    beforeEach(() => {
        fetcher = new ImageFetcher();
    });

    it('rejects on HTTP error', async () => {
        mockXhr.mockRejectedValueOnce(new NetworkError(new URL('https://example.com')));

        await expect(fetcher.fetchImageContents(new URL('https://example.com/broken'), 'test.jpg', {}))
            .rejects.toBeInstanceOf(NetworkError);
    });

    it('rejects on text response', async () => {
        mockXhr.mockResolvedValueOnce(createXhrResponse({
            finalUrl: 'https://example.com/broken',
            response: new Blob(['test']),
            responseHeaders: 'Content-Type: text/html; charset=utf-8',
        }));

        await expect(fetcher.fetchImageContents(new URL('https://example.com/broken'), 'test.jpg', {}))
            .rejects.toThrow('Expected to receive an image, but received text. Perhaps this provider is not supported yet?');
    });

    it('rejects on unsupported provider page', async () => {
        mockXhr.mockResolvedValueOnce(createXhrResponse({
            finalUrl: 'https://example.com/not-an-album',
            response: new Blob(['test']),
            responseHeaders: 'Content-Type: text/html; charset=utf-8',
        }));
        mockGetProviderByDomain.mockImplementationOnce(() => fakeProvider);

        await expect(fetcher.fetchImageContents(new URL('https://example.com/not-an-album'), 'test.jpg', {}))
            .rejects.toThrow('This page is not (yet) supported by the test provider, are you sure this page corresponds to a MusicBrainz release?');
    });

    it('rejects on invalid image', async () => {
        mockXhr.mockResolvedValueOnce(createXhrResponse({
            finalUrl: 'https://example.com/broken',
            response: new Blob(['test']),
            responseHeaders: 'Content-Type: application/json',
        }));

        await expect(fetcher.fetchImageContents(new URL('https://example.com/broken'), 'test.jpg', {}))
            .rejects.toThrow('Expected "test.jpg" to be an image, but received application/json.');
    });

    it('rejects on invalid image without content-type header', async () => {
        mockXhr.mockResolvedValueOnce(createXhrResponse({
            finalUrl: 'https://example.com/broken',
            response: new Blob(['test']),
        }));

        await expect(fetcher.fetchImageContents(new URL('https://example.com/broken'), 'test.jpg', {}))
            .rejects.toThrow('Expected "test.jpg" to be an image, but received unknown file type.');
    });

    it('resolves with fetched image', async () => {
        mockXhr.mockResolvedValueOnce(createXhrResponse({
            finalUrl: 'https://example.com/working',
            response: new Blob([Uint32Array.from([0x474E5089, 0xDEADBEEF])]),
        }));

        await expect(fetcher.fetchImageContents(new URL('https://example.com/working'), 'test.jpg', {}))
            .resolves.toMatchObject({
                file: {
                    type: 'image/png',
                    name: 'test.0.png',
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
        mockXhr.mockResolvedValueOnce(createXhrResponse({
            finalUrl: 'https://example.com/redirected',
            response: new Blob([Uint32Array.from([0x474E5089, 0xDEADBEEF])]),
        }));

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
            .mockResolvedValueOnce(createXhrResponse({
                finalUrl: 'https://example.com/working',
                response: new Blob([Uint32Array.from([0x474E5089, 0xDEADBEEF])]),
            }))
            .mockResolvedValueOnce(createXhrResponse({
                finalUrl: 'https://example.com/working',
                response: new Blob([Uint32Array.from([0x474E5089, 0xDEADBEEF])]),
            }));

        await expect(fetcher.fetchImageContents(new URL('https://example.com/working'), 'test.jpg', {}))
            .resolves.toMatchObject({
                file: {
                    name: 'test.0.png',
                },
            });
        await expect(fetcher.fetchImageContents(new URL('https://example.com/working'), 'test.jpg', {}))
            .resolves.toMatchObject({
                file: {
                    name: 'test.1.png',
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
                .resolves.toHaveProperty('content.name', 'test.0.jpg');
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
                file: new File([new Blob(['test'])], 'test.0.jpg', { type: 'image/jpeg' }),
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
                    headers: {},
                };
                yield {
                    url: new URL('https://example.com/2'),
                    filename: '',
                    headers: {},
                };
                return undefined;
            });
        });

        it('maximises the image', async () => {
            await expect(fetcher.fetchImageFromURL(new URL('https://example.com/test')))
                .resolves.toHaveProperty('wasMaximised', true);
        });

        it('fetches the first maximised candidate', async () => {
            await expect(fetcher.fetchImageFromURL(new URL('https://example.com/test')))
                .resolves.toHaveProperty('content.name', '1.0.jpg');
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

        it('skips maximisation if told to do so', async () => {
            await expect(fetcher.fetchImageFromURL(new URL('https://example.com/test'), true))
                .resolves.toMatchObject({
                    wasMaximised: false,
                    maximisedUrl: {
                        href: 'https://example.com/test',
                    },
                });
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

        await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider, false))
            .resolves.toMatchObject({
                images: [],
                containerUrl: {
                    href: 'https://example.com/',
                },
            });
    });

    it('returns all images provided by provider', async () => {
        mockFindImages.mockResolvedValueOnce([
            createCoverArt('https://example.com/1'),
            createCoverArt('https://example.com/2'),
        ]);

        await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider, false))
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
        mockFindImages.mockResolvedValueOnce([
            createCoverArt({
                url: new URL('https://example.com/1'),
                types: [ArtworkTypeIDs.Front],
                comment: 'comment',
            }),
        ]);

        await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider, false))
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
        const cover = createCoverArt('https://example.com/1');
        mockFindImages.mockResolvedValue([cover, cover]);

        await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider, false))
            .resolves.toMatchObject({
                images: [{
                    content: {
                        name: '1.0.jpg',
                    },
                }],
            });
    });

    it('skips image if maximised image is already added', async () => {
        mockFindImages.mockResolvedValueOnce([
            createCoverArt('https://example.com/1'),
            createCoverArt('https://example.com/2'),
        ]);

        // Mocking the maximisation to return the same maximised URL for both
        // images. This should lead to the first URL being added and the second
        // one being skipped.
        async function* mockedImplementation(): ReturnType<typeof getMaximisedCandidates> {
            yield {
                url: new URL('https://example.com/3'),
                filename: '3',
                headers: {},
            };
            return undefined;
        }
        mockGetMaximisedCandidates
            // Need to mock the implementation twice, once for each URL
            .mockImplementationOnce(mockedImplementation)
            .mockImplementationOnce(mockedImplementation);

        await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider, false))
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
        mockFindImages.mockResolvedValueOnce([
            createCoverArt('https://example.com/1'),
        ]);
        mockFetchImageContents.mockRejectedValueOnce(new Error('1 has an unsupported file type'));

        await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider, false))
            .resolves.toMatchObject({
                images: [],
                containerUrl: {
                    href: 'https://example.com/',
                },
            });
    });

    it('skips maximisation if provider requests it', async () => {
        mockFindImages.mockResolvedValueOnce([
            createCoverArt({
                url: new URL('https://example.com/1'),
                skipMaximisation: true,
            }),
        ]);

        await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider, false))
            .resolves.toMatchObject({
                images: [{
                    wasMaximised: false,
                }],
            });
    });

    it('allows provider to postprocess images', async () => {
        class PostprocessingProvider extends FakeProvider {
            override async postprocessImages(images: FetchedImage[]): Promise<FetchedImage[]> {
                return images.slice(1);
            }
        }
        const provider = new PostprocessingProvider();
        mockFindImages.mockResolvedValueOnce([
            createCoverArt('https://example.com/1'),
            createCoverArt('https://example.com/2'),
        ]);

        await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), provider, false))
            .resolves.toMatchObject({
                images: [{
                    originalUrl: {
                        href: 'https://example.com/2',
                    },
                }],
            });
    });

    describe('fetching only front images', () => {
        it('removes non-front images', async () => {
            mockFindImages.mockResolvedValueOnce([
                createCoverArt({
                    url: new URL('https://example.com/1'),
                    types: [ArtworkTypeIDs.Front],
                }),
                createCoverArt({
                    url: new URL('https://example.com/2'),
                    types: [ArtworkTypeIDs.Back],
                }),
            ]);

            await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider, true))
                .resolves.toMatchObject({
                    images: [{
                        originalUrl: {
                            href: 'https://example.com/1',
                        },
                        types: [ArtworkTypeIDs.Front],
                    }],
                });
            expect(mockFetchImageContents).toHaveBeenCalledOnce();
        });

        it('removes non-front images regardless of order', async () => {
            mockFindImages.mockResolvedValueOnce([
                createCoverArt({
                    url: new URL('https://example.com/2'),
                    types: [ArtworkTypeIDs.Back],
                }),
                createCoverArt({
                    url: new URL('https://example.com/1'),
                    types: [ArtworkTypeIDs.Front],
                }),
            ]);

            await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider, true))
                .resolves.toMatchObject({
                    images: [{
                        originalUrl: {
                            href: 'https://example.com/1',
                        },
                        types: [ArtworkTypeIDs.Front],
                    }],
                });
            expect(mockFetchImageContents).toHaveBeenCalledOnce();
        });

        it('retains multiple front images', async () => {
            mockFindImages.mockResolvedValueOnce([
                createCoverArt({
                    url: new URL('https://example.com/1'),
                    types: [ArtworkTypeIDs.Front],
                }),
                createCoverArt({
                    url: new URL('https://example.com/2'),
                    types: [ArtworkTypeIDs.Front],
                }),
            ]);

            await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider, true))
                .resolves.toMatchObject({
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    images: expect.toBeArrayOfSize(2),
                });
            expect(mockFetchImageContents).toHaveBeenCalledTimes(2);
        });

        it('uses first image if no front image defined', async () => {
            mockFindImages.mockResolvedValueOnce([
                createCoverArt({
                    url: new URL('https://example.com/1'),
                    types: [ArtworkTypeIDs.Medium],
                }),
                createCoverArt({
                    url: new URL('https://example.com/2'),
                    types: [ArtworkTypeIDs.Back],
                }),
            ]);

            await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider, true))
                .resolves.toMatchObject({
                    images: [{
                        originalUrl: {
                            href: 'https://example.com/1',
                        },
                        types: [ArtworkTypeIDs.Medium],
                    }],
                });
            expect(mockFetchImageContents).toHaveBeenCalledTimes(1);
        });

        it('allows re-fetching a provider release', async () => {
            const resolvedValue = [
                createCoverArt({
                    url: new URL('https://example.com/1'),
                    types: [ArtworkTypeIDs.Front],
                }),
                createCoverArt({
                    url: new URL('https://example.com/2'),
                    types: [ArtworkTypeIDs.Back],
                }),
            ];
            mockFindImages
                .mockResolvedValueOnce(resolvedValue)
                .mockResolvedValueOnce(resolvedValue);

            await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider, true))
                .resolves.toMatchObject({
                    images: [{
                        originalUrl: {
                            href: 'https://example.com/1',
                        },
                        types: [ArtworkTypeIDs.Front],
                    }],
                });
            // Call again but allow non-front now, should only return the last one since the first is already
            // done.
            await expect(fetcher.fetchImagesFromProvider(new URL('https://example.com'), fakeProvider, false))
                .resolves.toMatchObject({
                    images: [{
                        originalUrl: {
                            href: 'https://example.com/2',
                        },
                        types: [ArtworkTypeIDs.Back],
                    }],
                });
            expect(mockFetchImageContents).toHaveBeenCalledTimes(2);
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
        const result = await fetcher.fetchImages(new URL('https://example.com/1'), false);

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
        mockFindImages.mockResolvedValueOnce([
            createCoverArt('https://example.com/1'),
            createCoverArt({
                url: new URL('https://example.com/2'),
                types: [ArtworkTypeIDs.Front],
                comment: 'front',
            }),
        ]);

        const result = await fetcher.fetchImages(new URL('https://example.com/1'), false);

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
        await fetcher.fetchImages(new URL('https://example.com/1'), false);

        await expect(fetcher.fetchImages(new URL('https://example.com/1'), false))
            .resolves.toHaveProperty('images', []);
    });

    it('does not fetch maximised URL which was already fetched previously', async () => {
        await fetcher.fetchImages(new URL('https://example.com/1'), false);

        // Simulate 1 being maximal version of 2
        mockGetMaximisedCandidates.mockImplementationOnce(async function* () {
            yield {
                url: new URL('https://example.com/1'),
                filename: '1.png',
                headers: {},
            };
            return undefined;
        });

        await expect(fetcher.fetchImages(new URL('https://example.com/2'), false))
            .resolves.toHaveProperty('images', []);
    });
});
