import pRetry from 'p-retry';

import type { memoize as mockMemoize } from '@lib/util/functions';
import { getImageDimensions } from '@src/mb_caa_dimensions/dimensions';

// Need to mock out `memoize` because otherwise the results in the tests will
// be cached, which we don't want to happen.
jest.mock<{ memoize: typeof mockMemoize }>('@lib/util/functions', () => ({
    memoize: ((function_) => function_) as typeof mockMemoize,
}));

jest.mock('p-retry');

const mockpRetry = pRetry as jest.MockedFunction<typeof pRetry>;

beforeAll(() => {
    mockpRetry.mockImplementation(((function_) => (function_(0))) as typeof pRetry);
});

describe('retrieving image dimensions', () => {
    // jsdom doesn't actually load the images, so we need to mock that behaviour
    const createElementSpy = jest.spyOn(document, 'createElement');

    beforeEach(() => {
        createElementSpy.mockClear();
        jest.useFakeTimers();
    });

    function mockImageDimensions(image: HTMLImageElement, height: number, width: number): void {
        jest.spyOn(image, 'naturalHeight', 'get').mockReturnValue(height);
        jest.spyOn(image, 'naturalWidth', 'get').mockReturnValue(width);
    }

    it('retrieves dimensions for image which loads immediately', async () => {
        const dimsProm = getImageDimensions('https://example.com/img');
        const imageElement = createElementSpy.mock.results[0].value as HTMLImageElement;
        mockImageDimensions(imageElement, 1200, 345);
        imageElement.dispatchEvent(new Event('load'));

        await expect(dimsProm)
            .resolves.toMatchObject({
                height: 1200,
                width: 345,
            });
    });

    it('retrieves dimensions for image which does not load immediately', async () => {
        const dimsProm = getImageDimensions('https://example.com/img');
        const imageElement = createElementSpy.mock.results[0].value as HTMLImageElement;
        mockImageDimensions(imageElement, 1200, 345);
        jest.advanceTimersByTime(100);

        await expect(dimsProm)
            .resolves.toMatchObject({
                height: 1200,
                width: 345,
            });
    });

    it('retrieves dimensions for image which does loads slowly', async () => {
        const dimsProm = getImageDimensions('https://example.com/img');
        const imageElement = createElementSpy.mock.results[0].value as HTMLImageElement;
        // Let the interval run a couple of times, shouldn't resolve yet.
        jest.advanceTimersByTime(100);
        mockImageDimensions(imageElement, 1200, 345);
        jest.advanceTimersByTime(100);

        await expect(dimsProm)
            .resolves.toMatchObject({
                height: 1200,
                width: 345,
            });
    });

    it('does not resolve the promise twice', async () => {
        const dimsProm = getImageDimensions('https://example.com/img');
        const imageElement = createElementSpy.mock.results[0].value as HTMLImageElement;
        mockImageDimensions(imageElement, 1200, 345);
        // Let the interval run so it can pick up on the dimensions
        jest.advanceTimersByTime(100);
        // Simulate the image loading. This should not resolve a second time.
        // There's no easy way to detect if the promise is resolved multiple
        // times, so we'll change its dimensions instead. If it uses these
        // dimensions, it's doing something wrong
        mockImageDimensions(imageElement, 100, 200);
        imageElement.dispatchEvent(new Event('load'));


        await expect(dimsProm)
            .resolves.toMatchObject({
                height: 1200,
                width: 345,
            });
    });

    it('rejects if the image fails to load', async () => {
        const dimsProm = getImageDimensions('https://example.com/img');
        const imageElement = createElementSpy.mock.results[0].value as HTMLImageElement;
        imageElement.dispatchEvent(new Event('error'));

        await expect(dimsProm).toReject();
    });

    it('does not reject if image dimensions are known before error', async () => {
        const dimsProm = getImageDimensions('https://example.com/img');
        const imageElement = createElementSpy.mock.results[0].value as HTMLImageElement;
        mockImageDimensions(imageElement, 1200, 345);
        jest.advanceTimersByTime(100);
        imageElement.dispatchEvent(new Event('error'));

        await expect(dimsProm)
            .resolves.toMatchObject({
                height: 1200,
                width: 345,
            });
    });
});
