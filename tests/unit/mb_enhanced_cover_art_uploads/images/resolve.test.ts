import type { CoverArtBatch, CoverArtJob } from '@src/mb_enhanced_cover_art_uploads/types';
import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { getMaximisedCandidates } from '@src/mb_enhanced_cover_art_uploads/images/maximise';
import { CoverArtResolver as OriginalCoverArtResolver } from '@src/mb_enhanced_cover_art_uploads/images/resolve';
import { getProvider } from '@src/mb_enhanced_cover_art_uploads/providers';
import { CoverArtProvider } from '@src/mb_enhanced_cover_art_uploads/providers/base';

import { createCoverArt } from '../test-utils/dummy-data';

// Hoist visibility of protected members for use in test.
class CoverArtResolver extends OriginalCoverArtResolver {
    public override resolveImagesFromProvider(job: CoverArtJob, provider: CoverArtProvider): Promise<CoverArtBatch> {
        return super.resolveImagesFromProvider(job, provider);
    }
}

jest.mock('@lib/logging/logger');
jest.mock('@src/mb_enhanced_cover_art_uploads/images/maximise');
jest.mock('@src/mb_enhanced_cover_art_uploads/providers');
jest.mock('@src/mb_enhanced_cover_art_uploads/form');

const mockLoggerWarn = jest.mocked(LOGGER.warn);
const mockGetMaximisedCandidates = jest.mocked(getMaximisedCandidates);
const mockGetProvider = jest.mocked(getProvider);

// Fake provider to enable us to control which images are extracted through
// this mock function.
const mockFindImages: jest.MockedFunction<CoverArtProvider['findImages']> = jest.fn();
class FakeProvider extends CoverArtProvider {
    public readonly name = 'test';
    public readonly findImages = mockFindImages;
    public readonly supportedDomains = [];
    public readonly favicon = '';
    protected readonly urlRegex = /example\.com\/(.+)/;
}

const fakeProvider = new FakeProvider();

// Utility setup functions
function disableMaximisation(): void {
    mockGetMaximisedCandidates.mockResolvedValue([]);
}

beforeEach(() => {
    mockFindImages.mockReset();
    mockGetProvider.mockReset();
    mockLoggerWarn.mockReset();
});

describe('resolving images from providers', () => {
    let resolver: CoverArtResolver;

    beforeAll(() => {
        disableMaximisation();
    });

    beforeEach(() => {
        resolver = new CoverArtResolver();
    });

    it('returns no images if provider provides no images', async () => {
        mockFindImages.mockResolvedValueOnce([]);

        const result = resolver.resolveImagesFromProvider({ url: new URL('https://example.com') }, fakeProvider);

        await expect(result)
            .resolves.toMatchObject({
                images: [],
                provider: fakeProvider,
                jobUrl: {
                    href: 'https://example.com/',
                },
            });
    });

    it('returns all images provided by provider', async () => {
        mockFindImages.mockResolvedValueOnce([
            createCoverArt('https://example.com/1'),
            createCoverArt('https://example.com/2'),
        ]);

        const result = resolver.resolveImagesFromProvider({ url: new URL('https://example.com') }, fakeProvider);

        await expect(result)
            .resolves.toMatchObject({
                images: [{
                    originalUrl: {
                        href: 'https://example.com/1',
                    },
                }, {
                    originalUrl: {
                        href: 'https://example.com/2',
                    },
                }],
                provider: fakeProvider,
                jobUrl: {
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

        const result = resolver.resolveImagesFromProvider({ url: new URL('https://example.com') }, fakeProvider);

        await expect(result)
            .resolves.toMatchObject({
                images: [{
                    originalUrl: {
                        href: 'https://example.com/1',
                    },
                    types: [ArtworkTypeIDs.Front],
                    comment: 'comment',
                }],
            });
    });

    it('maximises images', async () => {
        mockFindImages.mockResolvedValueOnce([
            createCoverArt({
                url: new URL('https://example.com/1'),
                skipMaximisation: true,
            }),
        ]);
        const candidates = [{
            url: new URL('https://example.com/2'),
            filename: '1.png',
            headers: {},
        }, {
            url: new URL('https://example.com/3'),
            filename: '2.png',
            headers: {},
        }];
        mockGetMaximisedCandidates.mockResolvedValueOnce(candidates);

        const result = resolver.resolveImagesFromProvider({ url: new URL('https://example.com') }, fakeProvider);

        await expect(result)
            .resolves.toMatchObject({
                images: [{
                    originalUrl: {
                        href: 'https://example.com/1',
                    },
                    maximisedUrlCandidates: candidates,
                }],
            });
    });

    it('skips maximisation if provider requests it', async () => {
        mockFindImages.mockResolvedValueOnce([
            createCoverArt({
                url: new URL('https://example.com/1'),
                skipMaximisation: true,
            }),
        ]);

        const result = resolver.resolveImagesFromProvider({ url: new URL('https://example.com') }, fakeProvider);

        await expect(result)
            .resolves.toMatchObject({
                images: [{
                    originalUrl: {
                        href: 'https://example.com/1',
                    },
                    maximisedUrlCandidates: [],
                }],
            });
    });
});

describe('resolving images', () => {
    let resolver: CoverArtResolver;

    beforeAll(() => {
        disableMaximisation();
    });

    beforeEach(() => {
        resolver = new CoverArtResolver();
    });

    it('resolves single URL images', async () => {
        const result = await resolver.resolveImages({ url: new URL('https://example.com/1') });

        expect(result.images).toBeArrayOfSize(1);
        expect(result.images[0]).toMatchObject({
            originalUrl: {
                href: 'https://example.com/1',
            },
        });
        expect(result.provider).toBeUndefined();
    });

    it('resolves provider images', async () => {
        mockGetProvider.mockImplementationOnce(() => fakeProvider);
        mockFindImages.mockResolvedValueOnce([
            createCoverArt('https://example.com/1'),
            createCoverArt({
                url: new URL('https://example.com/2'),
                types: [ArtworkTypeIDs.Front],
                comment: 'front',
            }),
        ]);

        const result = await resolver.resolveImages({ url: new URL('https://example.com/1') });

        expect(result.images).toBeArrayOfSize(2);
        expect(result.images[0]).toMatchObject({
            originalUrl: {
                href: 'https://example.com/1',
            },
        });
        expect(result.images[1]).toMatchObject({
            originalUrl: {
                href: 'https://example.com/2',
            },
            types: [ArtworkTypeIDs.Front],
            comment: 'front',
        });
        expect(result.provider).toBe(fakeProvider);
    });

    it('reuses cache', async () => {
        mockGetProvider.mockImplementationOnce(() => fakeProvider);
        mockFindImages.mockResolvedValueOnce([
            createCoverArt('https://example.com/1'),
            createCoverArt({
                url: new URL('https://example.com/2'),
                types: [ArtworkTypeIDs.Front],
                comment: 'front',
            }),
        ]);

        await resolver.resolveImages({ url: new URL('https://example.com') });
        await resolver.resolveImages({ url: new URL('https://example.com') });

        expect(mockFindImages).toHaveBeenCalledOnce();
    });

    it('maximises single URLs', async () => {
        const candidates = [{
            url: new URL('https://example.com/2'),
            filename: '1.png',
            headers: {},
        }, {
            url: new URL('https://example.com/3'),
            filename: '2.png',
            headers: {},
        }];
        mockGetMaximisedCandidates.mockResolvedValueOnce(candidates);

        const result = resolver.resolveImages({ url: new URL('https://example.com') });

        await expect(result)
            .resolves.toMatchObject({
                images: [{
                    originalUrl: {
                        href: 'https://example.com/',
                    },
                    maximisedUrlCandidates: candidates,
                }],
            });
    });

    it('inserts default types and comments when specific ones are not set', async () => {
        mockGetProvider.mockImplementationOnce(() => fakeProvider);
        mockFindImages.mockResolvedValueOnce([
            createCoverArt('https://example.com/1'),
        ]);

        const result = await resolver.resolveImages({
            url: new URL('https://example.com/'),
            types: [ArtworkTypeIDs.Obi],
            comment: 'test',
        });

        expect(result.images).toBeArrayOfSize(1);
        expect(result.images[0]).toMatchObject({
            originalUrl: {
                href: 'https://example.com/1',
            },
            types: [ArtworkTypeIDs.Obi],
            comment: 'test',
        });
        expect(result.provider).toBe(fakeProvider);
    });

    it('does not use default parameters when specific ones are set', async () => {
        mockGetProvider.mockImplementationOnce(() => fakeProvider);
        mockFindImages.mockResolvedValueOnce([
            createCoverArt({
                url: new URL('https://example.com/1'),
                types: [ArtworkTypeIDs.Front],
                comment: 'front',
            }),
        ]);

        const result = await resolver.resolveImages({
            url: new URL('https://example.com/'),
            types: [ArtworkTypeIDs.Obi],
            comment: 'test',
        });

        expect(result.images).toBeArrayOfSize(1);
        expect(result.images[0]).toMatchObject({
            originalUrl: {
                href: 'https://example.com/1',
            },
            types: [ArtworkTypeIDs.Front],
            comment: 'front',
        });
        expect(result.provider).toBe(fakeProvider);
    });

    it('allows specific types and comment to be empty', async () => {
        mockGetProvider.mockImplementationOnce(() => fakeProvider);
        mockFindImages.mockResolvedValueOnce([
            createCoverArt({
                url: new URL('https://example.com/1'),
                types: [],
                comment: '',
            }),
        ]);

        const result = await resolver.resolveImages({
            url: new URL('https://example.com/'),
            types: [ArtworkTypeIDs.Obi],
            comment: 'test',
        });

        expect(result.images).toBeArrayOfSize(1);
        expect(result.images[0]).toMatchObject({
            originalUrl: {
                href: 'https://example.com/1',
            },
            types: [],
            comment: '',
        });
        expect(result.provider).toBe(fakeProvider);
    });
});
