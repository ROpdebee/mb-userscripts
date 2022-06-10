import { getCAAInfo } from '@src/mb_caa_dimensions/caa_info';
import { getImageDimensions } from '@src/mb_caa_dimensions/dimensions';
import { CAAImage, QueuedUploadImage } from '@src/mb_caa_dimensions/Image';

import { dummyCAAItemID, dummyCAAReleaseFullSizeURL, dummyCAAReleaseThumbnailURL, dummyDimensions, dummyFileInfo, dummyFullSizeURL, dummyImageID, dummyImageInfo, dummyPDFURL, dummyReleaseGroupURL, dummyThumbnail, mockCache } from './test-utils/mock-data';

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
            const image = new CAAImage(dummyFullSizeURL, mockCache);

            await expect(image.getDimensions()).resolves.toStrictEqual(dummyDimensions);
            expect(mockGetImageDimensions).not.toHaveBeenCalled();
        });

        it('loads on cache miss', async () => {
            mockCache.getDimensions.mockResolvedValue(undefined);
            mockGetImageDimensions.mockResolvedValue(dummyDimensions);
            const image = new CAAImage(dummyFullSizeURL, mockCache);

            await expect(image.getDimensions()).resolves.toStrictEqual(dummyDimensions);
            expect(mockGetImageDimensions).toHaveBeenCalledOnce();
            expect(mockGetImageDimensions).toHaveBeenCalledWith(dummyFullSizeURL);
            expect(mockCache.putDimensions).toHaveBeenCalledOnce();
            expect(mockCache.putDimensions).toHaveBeenCalledWith(dummyFullSizeURL, dummyDimensions);
        });

        it('loads on cache error', async () => {
            mockCache.getDimensions.mockRejectedValue(new Error('test'));
            mockGetImageDimensions.mockResolvedValue(dummyDimensions);
            const image = new CAAImage(dummyFullSizeURL, mockCache);

            await expect(image.getDimensions()).resolves.toStrictEqual(dummyDimensions);
            expect(mockGetImageDimensions).toHaveBeenCalledOnce();
            expect(mockGetImageDimensions).toHaveBeenCalledWith(dummyFullSizeURL);
            expect(mockCache.putDimensions).toHaveBeenCalledOnce();
            expect(mockCache.putDimensions).toHaveBeenCalledWith(dummyFullSizeURL, dummyDimensions);
        });

        it('returns undefined when live loading fails', async () => {
            mockCache.getDimensions.mockRejectedValue(new Error('test'));
            mockGetImageDimensions.mockRejectedValue(new Error('test'));
            const image = new CAAImage(dummyFullSizeURL, mockCache);

            await expect(image.getDimensions()).resolves.toBeUndefined();
            expect(mockGetImageDimensions).toHaveBeenCalledOnce();
            expect(mockGetImageDimensions).toHaveBeenCalledWith(dummyFullSizeURL);
            expect(mockCache.putDimensions).not.toHaveBeenCalled();
        });

        it('does not attempt to load PDF dimensions', async () => {
            const image = new CAAImage(dummyPDFURL, mockCache);

            await expect(image.getDimensions()).resolves.toBeUndefined();
            expect(mockGetImageDimensions).not.toHaveBeenCalled();
        });
    });

    describe('getting file info', () => {
        it('retrieves from cache if available', async () => {
            mockCache.getFileInfo.mockResolvedValue(dummyFileInfo);
            const image = new CAAImage(dummyFullSizeURL, mockCache);

            await expect(image.getFileInfo()).resolves.toStrictEqual(dummyFileInfo);
            expect(mockGetCAAInfo).not.toHaveBeenCalled();
        });

        it('loads on cache miss', async () => {
            mockCache.getFileInfo.mockResolvedValue(undefined);
            mockGetCAAInfo.mockResolvedValue(dummyFileInfo);
            const image = new CAAImage(dummyFullSizeURL, mockCache);

            await expect(image.getFileInfo()).resolves.toStrictEqual(dummyFileInfo);
            expect(mockGetCAAInfo).toHaveBeenCalledOnce();
            expect(mockGetCAAInfo).toHaveBeenCalledWith(dummyCAAItemID, dummyImageID);
            expect(mockCache.putFileInfo).toHaveBeenCalledWith(dummyFullSizeURL, dummyFileInfo);
        });

        it('loads on cache error', async () => {
            mockCache.getFileInfo.mockRejectedValue(new Error('test'));
            mockGetCAAInfo.mockResolvedValue(dummyFileInfo);
            const image = new CAAImage(dummyFullSizeURL, mockCache);

            await expect(image.getFileInfo()).resolves.toStrictEqual(dummyFileInfo);
            expect(mockGetCAAInfo).toHaveBeenCalledOnce();
            expect(mockGetCAAInfo).toHaveBeenCalledWith(dummyCAAItemID, dummyImageID);
            expect(mockCache.putFileInfo).toHaveBeenCalledWith(dummyFullSizeURL, dummyFileInfo);
        });

        it('returns undefined when live loading fails', async () => {
            mockCache.getFileInfo.mockRejectedValue(new Error('test'));
            mockGetCAAInfo.mockRejectedValue(new Error('test'));
            const image = new CAAImage(dummyFullSizeURL, mockCache);

            await expect(image.getFileInfo()).resolves.toBeUndefined();
            expect(mockGetCAAInfo).toHaveBeenCalledOnce();
            expect(mockGetCAAInfo).toHaveBeenCalledWith(dummyCAAItemID, dummyImageID);
            expect(mockCache.putFileInfo).not.toHaveBeenCalled();
        });
    });

    describe('getting image info', () => {
        it('loads dimensions and file info', async () => {
            mockGetImageDimensions.mockResolvedValue(dummyDimensions);
            mockGetCAAInfo.mockResolvedValue(dummyFileInfo);
            const image = new CAAImage(dummyFullSizeURL, mockCache);

            await expect(image.getImageInfo()).resolves.toStrictEqual(dummyImageInfo);
        });

        it('loads dimensions when file info fails', async () => {
            mockGetImageDimensions.mockResolvedValue(dummyDimensions);
            mockGetCAAInfo.mockRejectedValue(new Error('test'));
            const image = new CAAImage(dummyFullSizeURL, mockCache);

            await expect(image.getImageInfo()).resolves.toStrictEqual({
                dimensions: dummyDimensions,
                size: undefined,
                fileType: undefined,
            });
        });

        it('loads file info when dimensions fail', async () => {
            mockGetImageDimensions.mockRejectedValue(new Error('test'));
            mockGetCAAInfo.mockResolvedValue(dummyFileInfo);
            const image = new CAAImage(dummyFullSizeURL, mockCache);

            await expect(image.getImageInfo()).resolves.toStrictEqual({
                dimensions: undefined,
                ...dummyFileInfo,
            });
        });

        it('loads nothing when both fail', async () => {
            mockGetImageDimensions.mockRejectedValue(new Error('test'));
            mockGetCAAInfo.mockRejectedValue(new Error('test'));
            const image = new CAAImage(dummyFullSizeURL, mockCache);

            await expect(image.getImageInfo()).resolves.toStrictEqual({
                dimensions: undefined,
                size: undefined,
                fileType: undefined,
            });
        });
    });

    describe('parsing CAA URLs', () => {
        it('extracts correct item ID and image ID', async () => {
            const image = new CAAImage(dummyFullSizeURL, mockCache);
            await image.getFileInfo(); // Needed so we can inspect the mocked function call to see whether URL was parsed correctly.

            expect(mockGetCAAInfo).toHaveBeenCalledWith(dummyCAAItemID, dummyImageID);
        });

        it('extracts correct item ID and image ID from coverartarchive.org release URLs', async () => {
            const image = new CAAImage(dummyCAAReleaseThumbnailURL, mockCache, dummyCAAReleaseThumbnailURL);
            await image.getFileInfo();

            expect(mockGetCAAInfo).toHaveBeenCalledWith(dummyCAAItemID, dummyImageID);
        });

        it('does not parse CAA RG URLs', async () => {
            // These don't have the image ID.
            expect(() => new CAAImage(dummyReleaseGroupURL, mockCache)).toThrowWithMessage(Error, 'Unsupported URL');
        });

        it('throws if URL is not supported', async () => {
            expect(() => new CAAImage('https://archive.org/download/mbid-e276296d-0e1a-40bb-ac14-7a95f1ca7ff0/index.json', mockCache)).toThrowWithMessage(Error, 'Invalid URL');
        });

        it('only supports CAA or IA URLs', async () => {
            expect(() => new CAAImage('https://example.com/test', mockCache)).toThrowWithMessage(Error, 'Unsupported URL');
        });

        it('uses thumbnail URL if available', async () => {
            const image = new CAAImage(dummyReleaseGroupURL, mockCache, dummyThumbnail);
            await image.getFileInfo();

            expect(mockGetCAAInfo).toHaveBeenCalledWith(dummyCAAItemID, dummyImageID);
        });

        it('transforms full-size release coverartarchive.org URLs', async () => {
            const image = new CAAImage(dummyCAAReleaseFullSizeURL, mockCache);
            await image.getDimensions();

            expect(mockGetImageDimensions).toHaveBeenCalledWith(dummyFullSizeURL);
        });

        it('does not transform full-size RG coverartarchive.org URLs', async () => {
            const image = new CAAImage(dummyReleaseGroupURL, mockCache, dummyThumbnail);
            await image.getDimensions();

            expect(mockGetImageDimensions).toHaveBeenCalledWith(dummyReleaseGroupURL);
        });
    });
});


describe('queued upload image', () => {
    const img = document.createElement('img');

    beforeEach(() => {
        jest.spyOn(img, 'naturalHeight', 'get').mockReturnValue(100);
        jest.spyOn(img, 'naturalWidth', 'get').mockReturnValue(200);
    });

    it('loads dimensions', async () => {
        const queuedImage = new QueuedUploadImage(img);

        await expect(queuedImage.getDimensions()).resolves.toStrictEqual({
            height: 100,
            width: 200,
        });
    });

    it('has no file info', async () => {
        const queuedImage = new QueuedUploadImage(img);

        await expect(queuedImage.getFileInfo()).resolves.toBeUndefined();
    });
});
