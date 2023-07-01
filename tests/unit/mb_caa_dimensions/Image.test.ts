import { getCAAInfo } from '@src/mb_caa_dimensions/caa_info';
import { getImageDimensions } from '@src/mb_caa_dimensions/dimensions';
import { CAAImage, QueuedUploadImage } from '@src/mb_caa_dimensions/Image';

import { dummyCAAItemID, dummyCAAReleaseFullSizeURL, dummyCAAReleaseGroupURL, dummyCAAReleasePDFURL, dummyCAAReleaseThumbnailURL, dummyDimensions, dummyDirectFullSizeURL, dummyDirectPDFURL, dummyDirectThumbnailURL, dummyFileInfo, dummyImageID, dummyImageInfo, dummyPDFJP2URL, dummyReleaseID, mockCache } from './test-utils/mock-data';

jest.mock('@src/mb_caa_dimensions/InfoCache');
jest.mock('@src/mb_caa_dimensions/caa_info');
jest.mock('@src/mb_caa_dimensions/dimensions');


const mockGetImageDimensions = getImageDimensions as jest.MockedFunction<typeof getImageDimensions>;
const mockGetCAAInfo = getCAAInfo as jest.MockedFunction<typeof getCAAInfo>;

afterEach(() => {
    mockCache.getDimensions.mockReset();
    mockCache.putDimensions.mockReset();
    mockCache.getFileInfo.mockReset();
    mockCache.putFileInfo.mockReset();

    mockGetImageDimensions.mockReset();
    mockGetCAAInfo.mockReset();
});

describe('caa image', () => {
    describe('getting dimensions', () => {
        it('retrieves from cache if available', async () => {
            mockCache.getDimensions.mockResolvedValue(dummyDimensions);
            const image = new CAAImage(dummyDirectFullSizeURL, mockCache);

            await expect(image.getDimensions()).resolves.toStrictEqual(dummyDimensions);
            expect(mockGetImageDimensions).not.toHaveBeenCalled();
        });

        it('loads on cache miss', async () => {
            mockCache.getDimensions.mockResolvedValue(undefined);
            mockGetImageDimensions.mockResolvedValue(dummyDimensions);
            const image = new CAAImage(dummyDirectFullSizeURL, mockCache);

            await expect(image.getDimensions()).resolves.toStrictEqual(dummyDimensions);
            expect(mockGetImageDimensions).toHaveBeenCalledExactlyOnceWith(dummyDirectFullSizeURL);
            expect(mockCache.putDimensions).toHaveBeenCalledExactlyOnceWith(dummyDirectFullSizeURL, dummyDimensions);
        });

        it('loads on cache error', async () => {
            mockCache.getDimensions.mockRejectedValue(new Error('test'));
            mockGetImageDimensions.mockResolvedValue(dummyDimensions);
            const image = new CAAImage(dummyDirectFullSizeURL, mockCache);

            await expect(image.getDimensions()).resolves.toStrictEqual(dummyDimensions);
            expect(mockGetImageDimensions).toHaveBeenCalledExactlyOnceWith(dummyDirectFullSizeURL);
            expect(mockCache.putDimensions).toHaveBeenCalledExactlyOnceWith(dummyDirectFullSizeURL, dummyDimensions);
        });

        it('returns undefined when live loading fails', async () => {
            mockCache.getDimensions.mockRejectedValue(new Error('test'));
            mockGetImageDimensions.mockRejectedValue(new Error('test'));
            const image = new CAAImage(dummyDirectFullSizeURL, mockCache);

            await expect(image.getDimensions()).resolves.toBeUndefined();
            expect(mockGetImageDimensions).toHaveBeenCalledExactlyOnceWith(dummyDirectFullSizeURL);
            expect(mockCache.putDimensions).not.toHaveBeenCalled();
        });

        it('loads PDF dimensions from first page', async () => {
            mockGetImageDimensions.mockResolvedValue(dummyDimensions);
            const image = new CAAImage(dummyDirectPDFURL, mockCache);

            await expect(image.getDimensions()).resolves.toStrictEqual(dummyDimensions);
            expect(mockGetImageDimensions).toHaveBeenCalledWith(dummyPDFJP2URL);
        });
    });

    describe('getting file info', () => {
        it('retrieves from cache if available', async () => {
            mockCache.getFileInfo.mockResolvedValue(dummyFileInfo);
            const image = new CAAImage(dummyDirectFullSizeURL, mockCache);

            await expect(image.getFileInfo()).resolves.toStrictEqual(dummyFileInfo);
            expect(mockGetCAAInfo).not.toHaveBeenCalled();
        });

        it('loads on cache miss', async () => {
            mockCache.getFileInfo.mockResolvedValue(undefined);
            mockGetCAAInfo.mockResolvedValue(dummyFileInfo);
            const image = new CAAImage(dummyDirectFullSizeURL, mockCache);

            await expect(image.getFileInfo()).resolves.toStrictEqual(dummyFileInfo);
            expect(mockGetCAAInfo).toHaveBeenCalledExactlyOnceWith(dummyCAAItemID, dummyImageID);
            expect(mockCache.putFileInfo).toHaveBeenCalledWith(dummyDirectFullSizeURL, dummyFileInfo);
        });

        it('loads on cache error', async () => {
            mockCache.getFileInfo.mockRejectedValue(new Error('test'));
            mockGetCAAInfo.mockResolvedValue(dummyFileInfo);
            const image = new CAAImage(dummyDirectFullSizeURL, mockCache);

            await expect(image.getFileInfo()).resolves.toStrictEqual(dummyFileInfo);
            expect(mockGetCAAInfo).toHaveBeenCalledExactlyOnceWith(dummyCAAItemID, dummyImageID);
            expect(mockCache.putFileInfo).toHaveBeenCalledWith(dummyDirectFullSizeURL, dummyFileInfo);
        });

        it('returns undefined when live loading fails', async () => {
            mockCache.getFileInfo.mockRejectedValue(new Error('test'));
            mockGetCAAInfo.mockRejectedValue(new Error('test'));
            const image = new CAAImage(dummyDirectFullSizeURL, mockCache);

            await expect(image.getFileInfo()).resolves.toBeUndefined();
            expect(mockGetCAAInfo).toHaveBeenCalledExactlyOnceWith(dummyCAAItemID, dummyImageID);
            expect(mockCache.putFileInfo).not.toHaveBeenCalled();
        });
    });

    describe('getting image info', () => {
        it('loads dimensions and file info', async () => {
            mockGetImageDimensions.mockResolvedValue(dummyDimensions);
            mockGetCAAInfo.mockResolvedValue(dummyFileInfo);
            const image = new CAAImage(dummyDirectFullSizeURL, mockCache);

            await expect(image.getImageInfo()).resolves.toStrictEqual(dummyImageInfo);
        });

        it('loads dimensions when file info fails', async () => {
            mockGetImageDimensions.mockResolvedValue(dummyDimensions);
            mockGetCAAInfo.mockRejectedValue(new Error('test'));
            const image = new CAAImage(dummyDirectFullSizeURL, mockCache);

            await expect(image.getImageInfo()).resolves.toStrictEqual({
                dimensions: dummyDimensions,
                size: undefined,
                fileType: undefined,
            });
        });

        it('loads file info when dimensions fail', async () => {
            mockGetImageDimensions.mockRejectedValue(new Error('test'));
            mockGetCAAInfo.mockResolvedValue(dummyFileInfo);
            const image = new CAAImage(dummyDirectFullSizeURL, mockCache);

            await expect(image.getImageInfo()).resolves.toStrictEqual({
                dimensions: undefined,
                ...dummyFileInfo,
            });
        });

        it('loads nothing when both fail', async () => {
            mockGetImageDimensions.mockRejectedValue(new Error('test'));
            mockGetCAAInfo.mockRejectedValue(new Error('test'));
            const image = new CAAImage(dummyDirectFullSizeURL, mockCache);

            await expect(image.getImageInfo()).resolves.toStrictEqual({
                dimensions: undefined,
                size: undefined,
                fileType: undefined,
            });
        });
    });

    describe('transforming URLs', () => {
        const cacheKeyCases: Array<[string, string, string | undefined, string]> = [
            // description, full-size URL, thumbnail URL, expected cache key
            ['direct full-size URLs', dummyDirectFullSizeURL, undefined, dummyDirectFullSizeURL],
            ['direct PDF URLs', dummyDirectPDFURL, undefined, dummyDirectPDFURL],
            ['CAA-redirected release URLs', dummyCAAReleaseFullSizeURL, undefined, dummyDirectFullSizeURL],
            ['CAA-redirected release group URLs', dummyCAAReleaseGroupURL, dummyDirectThumbnailURL, dummyDirectThumbnailURL],
            ['CAA-redirected PDF URLs', dummyCAAReleasePDFURL, undefined, dummyDirectPDFURL],
        ];

        it.each(cacheKeyCases)('extracts cache key from %s', async (_1, fullSizeURL, thumbnailURL, expectedCacheKey) => {
            const image = new CAAImage(fullSizeURL, mockCache, thumbnailURL);
            await image.getFileInfo(); // Needed so we can inspect the mocked function call to see whether the cache key was extracted correctly.

            expect(mockCache.getFileInfo).toHaveBeenCalledWith(expectedCacheKey);
        });

        const imageURLCases: Array<[string, string, string | undefined, string]> = [
            // description, input URL, thumbnail URL, expected image URL
            ['direct full-size URLs', dummyDirectFullSizeURL, undefined, dummyDirectFullSizeURL],
            ['direct PDF URLs', dummyDirectPDFURL, undefined, dummyPDFJP2URL],
            ['CAA-redirected release URLs', dummyCAAReleaseFullSizeURL, undefined, dummyDirectFullSizeURL],
            ['CAA-redirected release group URLs', dummyCAAReleaseGroupURL, dummyDirectThumbnailURL, dummyCAAReleaseGroupURL],
            ['CAA-redirected PDF URLs', dummyCAAReleasePDFURL, undefined, dummyPDFJP2URL],
        ];

        it.each(imageURLCases)('transforms URL for %s', async (_1, fullSizeURL, thumbnailURL, expectedImageURL) => {
            const image = new CAAImage(fullSizeURL, mockCache, thumbnailURL);
            await image.getDimensions();

            expect(mockGetImageDimensions).toHaveBeenCalledWith(expectedImageURL);
        });

        const caaIDCases: Array<[string, string, string | undefined]> = [
            // description, input URL, thumbnail URL. Expected release and image IDs are always the same.
            ['direct full-size URLs', dummyDirectFullSizeURL, undefined],
            ['direct full-size URLs with thumbnail', dummyDirectFullSizeURL, dummyDirectThumbnailURL],
            ['direct full-size URLs with redirected thumbnail', dummyDirectFullSizeURL, dummyCAAReleaseThumbnailURL],
            ['direct PDF URLs', dummyDirectPDFURL, undefined],
            ['direct PDF URLs with thumbnail', dummyDirectPDFURL, dummyDirectThumbnailURL],
            ['direct PDF URLs with redirected thumbnail', dummyDirectPDFURL, dummyCAAReleaseThumbnailURL],
            ['CAA-redirected release URLs', dummyCAAReleaseFullSizeURL, undefined],
            ['CAA-redirected release URLs with thumbnail', dummyCAAReleaseFullSizeURL, dummyDirectThumbnailURL],
            ['CAA-redirected release URLs with redirected thumbnail', dummyCAAReleaseFullSizeURL, dummyCAAReleaseThumbnailURL],
            ['CAA-redirected PDF URLs', dummyCAAReleasePDFURL, undefined],
            ['CAA-redirected PDF URLs with thumbnail', dummyCAAReleasePDFURL, dummyDirectThumbnailURL],
            ['CAA-redirected PDF URLs with redirected thumbnail', dummyCAAReleasePDFURL, dummyCAAReleaseThumbnailURL],
            // CAA-redirected RG URL without thumbnail should throw.
            ['CAA-redirected release group URLs with thumbnail', dummyCAAReleaseGroupURL, dummyDirectThumbnailURL],
            ['CAA-redirected release group URLs with redirected thumbnail', dummyCAAReleaseGroupURL, dummyCAAReleaseThumbnailURL],
        ];

        it.each(caaIDCases)('extracts correct item ID and image ID for %s', async (_1, fullSizeURL, thumbnailURL) => {
            const image = new CAAImage(fullSizeURL, mockCache, thumbnailURL);
            await image.getFileInfo();

            expect(mockGetCAAInfo).toHaveBeenCalledWith(dummyCAAItemID, dummyImageID);
        });

        it('throws on CAA-redirected release group URLs without thumbnails', () => {
            expect(() => new CAAImage(dummyCAAReleaseGroupURL, mockCache))
                .toThrowWithMessage(Error, 'Release group image requires a thumbnail URL');
        });

        it('throws on unsupported URLs', () => {
            expect(() => new CAAImage(`https://archive.org/download/mbid-${dummyReleaseID}/index.json`, mockCache))
                .toThrowWithMessage(Error, 'Invalid URL');
        });

        it('throws on URLs with unsupported domain', () => {
            expect(() => new CAAImage('https://example.com/test', mockCache))
                .toThrowWithMessage(Error, 'Unsupported URL');
        });
    });
});


describe('queued upload image', () => {
    let img: HTMLImageElement;
    let mockGetComplete: jest.SpiedFunction<() => boolean>;

    beforeEach(() => {
        img = document.createElement('img');
        jest.spyOn(img, 'naturalHeight', 'get').mockReturnValue(100);
        jest.spyOn(img, 'naturalWidth', 'get').mockReturnValue(200);
        mockGetComplete = jest.spyOn(img, 'complete', 'get');
        mockGetComplete.mockReturnValue(true);
    });

    it('loads dimensions', async () => {
        const queuedImage = new QueuedUploadImage(img);

        await expect(queuedImage.getDimensions()).resolves.toStrictEqual({
            height: 100,
            width: 200,
        });
    });

    it('waits until image is loaded', async () => {
        mockGetComplete.mockReturnValue(false);
        const onResolved = jest.fn();
        const queuedImage = new QueuedUploadImage(img);
        const dimProm = queuedImage.getDimensions().then(onResolved);

        expect(onResolved).not.toHaveBeenCalled();

        img.dispatchEvent(new Event('load'));

        await expect(dimProm).toResolve();
        expect(onResolved).toHaveBeenCalledExactlyOnceWith({
            height: 100,
            width: 200,
        });
    });

    it('has no file info', async () => {
        const queuedImage = new QueuedUploadImage(img);

        await expect(queuedImage.getFileInfo()).resolves.toBeUndefined();
    });
});
