import type { InfoCache } from '@src/mb_caa_dimensions/info-cache';

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

export const dummyReleaseID = '944da2ca-47fc-422c-af26-c3e54845ff65';
export const dummyCAAItemID = `mbid-${dummyReleaseID}`;
export const dummyImageID = '15603614015';
const archivePrefix = 'https://archive.org/download';
const caaPrefix = 'https://coverartarchive.org';

export const dummyDirectThumbnailURL = `${archivePrefix}/${dummyCAAItemID}/${dummyCAAItemID}-${dummyImageID}_thumb500.jpg`;
export const dummyDirectFullSizeURL = `${archivePrefix}/${dummyCAAItemID}/${dummyCAAItemID}-${dummyImageID}.png`;
export const dummyCAAReleaseThumbnailURL = `${caaPrefix}/release/${dummyReleaseID}/${dummyImageID}-500.jpg`;
export const dummyCAAReleaseFullSizeURL = `${caaPrefix}/release/${dummyReleaseID}/${dummyImageID}.png`;

export const dummyDirectPDFURL = `${archivePrefix}/${dummyCAAItemID}/${dummyCAAItemID}-${dummyImageID}.pdf`;
export const dummyCAAReleasePDFURL = `${caaPrefix}/release/${dummyReleaseID}/${dummyImageID}.pdf`;
export const dummyPDFJP2URL = `${archivePrefix}/${dummyCAAItemID}/${dummyCAAItemID}-${dummyImageID}_jp2.zip/${dummyCAAItemID}-${dummyImageID}_jp2%2F${dummyCAAItemID}-${dummyImageID}_0000.jp2?ext=jpg`;

export const dummyCAAReleaseGroupURL = `${caaPrefix}/release-group/db4ebf13-42b0-3c47-8a06-374b6a49b645/front`;
