import { CONFIG } from '@src/mb_enhanced_cover_art_uploads/config';
import { mockGMdeleteValue, mockGMgetValue, mockGMsetValue } from '@test-utils/gm-mocks';

beforeEach(() => {
    const mockStorage = new Map<string, unknown>();

    mockGMdeleteValue.mockImplementation((name: string) => {
        mockStorage.delete(name);
        return Promise.resolve();
    });

    mockGMgetValue.mockImplementation((name: string) => {
        return Promise.resolve(mockStorage.get(name));
    });

    mockGMsetValue.mockImplementation((name: string, value: GM.Value) => {
        mockStorage.set(name, value);
        return Promise.resolve();
    });
});

describe('ecau config', () => {
    describe('skip track images', () => {
        it.each([
            [true, true, true],
            [true, false, true],
            [false, true, true],
            [false, false, false],
        ])('is $2 when property set to $1 and only front is $0', async (onlyFrontValue, propertyValue, outcome) => {
            await CONFIG.fetchFrontOnly.set(onlyFrontValue);
            await CONFIG.skipTrackImagesProperty.set(propertyValue);

            await expect(CONFIG.skipTrackImages).resolves.toBe(outcome);
        });
    });

    describe.each(['bandcamp', 'soundcloud'] as const)('%s-specific skip track images', (provider: 'bandcamp' | 'soundcloud') => {
        it.each([
            [true, true, true],
            [true, false, true],
            [false, true, true],
            [false, false, false],
        ])('is $2 when property set to $1 and global property is $0', async (globalPropertyValue, propertyValue, outcome) => {
            await CONFIG.skipTrackImagesProperty.set(globalPropertyValue);
            await CONFIG[provider].skipTrackImagesProperty.set(propertyValue);

            await expect(CONFIG[provider].skipTrackImages).resolves.toBe(outcome);
        });
    });
});
