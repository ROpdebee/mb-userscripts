import type { InfoCache } from '@src/mb_caa_dimensions/InfoCache';

export const dummyDimensions = {
    width: 100,
    height: 100,
};

export const dummyFileInfo = {
    size: 100,
    fileType: 'PNG',
};

export const dummyImageInfo = {
    dimensions: dummyDimensions,
    ...dummyFileInfo,
};

export const mockCache = {
    getDimensions: jest.fn<ReturnType<InfoCache['getDimensions']>, Parameters<InfoCache['getDimensions']>>(),
    putDimensions: jest.fn<ReturnType<InfoCache['putDimensions']>, Parameters<InfoCache['putDimensions']>>(),
    getFileInfo: jest.fn<ReturnType<InfoCache['getFileInfo']>, Parameters<InfoCache['getFileInfo']>>(),
    putFileInfo: jest.fn<ReturnType<InfoCache['putFileInfo']>, Parameters<InfoCache['putFileInfo']>>(),
};

export const dummyThumbnail = 'https://archive.org/download/mbid-944da2ca-47fc-422c-af26-c3e54845ff65/mbid-944da2ca-47fc-422c-af26-c3e54845ff65-15603614015_thumb500.jpg';
export const dummyFullSizeURL = 'https://archive.org/download/mbid-944da2ca-47fc-422c-af26-c3e54845ff65/mbid-944da2ca-47fc-422c-af26-c3e54845ff65-15603614015.jpg';
export const dummyPDFURL = 'https://archive.org/download/mbid-82af81c4-0cfa-4382-abc6-2ec08a79b431/mbid-82af81c4-0cfa-4382-abc6-2ec08a79b431-29531260255.pdf';
export const dummyPDFJP2URL = 'https://archive.org/download/mbid-82af81c4-0cfa-4382-abc6-2ec08a79b431/mbid-82af81c4-0cfa-4382-abc6-2ec08a79b431-29531260255_jp2.zip/mbid-82af81c4-0cfa-4382-abc6-2ec08a79b431-29531260255_jp2%2Fmbid-82af81c4-0cfa-4382-abc6-2ec08a79b431-29531260255_0000.jp2?ext=jpg';
export const dummyReleaseGroupURL = 'https://coverartarchive.org/release-group/db4ebf13-42b0-3c47-8a06-374b6a49b645/front';
export const dummyCAAReleaseThumbnailURL = 'https://coverartarchive.org/release/944da2ca-47fc-422c-af26-c3e54845ff65/15603614015-500.jpg';
export const dummyCAAReleaseFullSizeURL = 'https://coverartarchive.org/release/944da2ca-47fc-422c-af26-c3e54845ff65/15603614015.jpg';
export const dummyCAAItemID = 'mbid-944da2ca-47fc-422c-af26-c3e54845ff65';
export const dummyImageID = '15603614015';
