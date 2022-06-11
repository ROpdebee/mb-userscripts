global.GM = {
    xmlHttpRequest: jest.fn(),
    getResourceUrl: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    info: {} as GM.ScriptInfo,
} as unknown as typeof GM;
