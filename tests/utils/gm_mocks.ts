// Utilities to mock GM functions

export const mockGM_getResourceURL = jest.fn() as jest.MockedFunction<typeof GM_getResourceURL>;

global.GM_getResourceURL = mockGM_getResourceURL;
