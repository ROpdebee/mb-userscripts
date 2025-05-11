// Utilities to mock GM functions

export const mockGMgetResourceURL = jest.mocked(GM.getResourceUrl);
export const mockGMxmlHttpRequest = jest.mocked(GM.xmlHttpRequest);
export const mockGMgetValue = jest.mocked(GM.getValue);
export const mockGMsetValue = jest.mocked(GM.setValue);
export const mockGMdeleteValue = jest.mocked(GM.deleteValue);
