// Utilities to mock GM functions

export const mockGM_getResourceURL = jest.fn() as jest.MockedFunction<typeof GM.getResourceUrl>;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
global.GM = global.GM ?? {};
global.GM.getResourceUrl = mockGM_getResourceURL;
