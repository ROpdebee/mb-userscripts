// Utilities to mock GM functions

/* eslint-disable jest/unbound-method -- Fine */
export const mockGMgetResourceURL = GM.getResourceUrl as jest.MockedFunction<typeof GM.getResourceUrl>;
export const mockGMxmlHttpRequest = GM.xmlHttpRequest as jest.MockedFunction<typeof GM.xmlHttpRequest>;
/* eslint-enable jest/unbound-method */
