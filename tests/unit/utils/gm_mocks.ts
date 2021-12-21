// Utilities to mock GM functions
import * as compat from '@lib/compat';

export const mockGMgetResourceURL = compat.GMgetResourceUrl as jest.MockedFunction<typeof compat.GMgetResourceUrl>;
export const mockGMxmlHttpRequest = compat.GMxmlHttpRequest as jest.MockedFunction<typeof compat.GMxmlHttpRequest>;
