// Utilities to mock GM functions

/* eslint-disable jest/unbound-method -- Fine */
export const mockGMgetResourceURL = GM.getResourceUrl as jest.MockedFunction<typeof GM.getResourceUrl>;
export const mockGMxmlHttpRequest = GM.xmlHttpRequest as jest.MockedFunction<typeof GM.xmlHttpRequest>;
export const mockGMgetValue = GM.getValue as jest.MockedFunction<typeof GM.getValue>;
export const mockGMsetValue = GM.setValue as jest.MockedFunction<typeof GM.setValue>;
export const mockGMdeleteValue = GM.deleteValue as jest.MockedFunction<typeof GM.deleteValue>;
/* eslint-enable jest/unbound-method */
