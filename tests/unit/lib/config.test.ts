import { GMsetValue } from '@lib/compat';
import { ConfigProperty } from '@lib/config';
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

describe('configuration properties', () => {
    const property = new ConfigProperty<string>('testProperty', 'Test property', 'default');

    it('gets the default value if no value is set', async () => {
        await expect(property.get()).resolves.toBe('default');
    });

    it('gets the set value if one is set', async () => {
        await expect(property.set('test123')).toResolve();

        await expect(property.get()).resolves.toBe('test123');
    });

    it('supports complex types', async () => {
        const property = new ConfigProperty<{ test: number }>('testProperty', 'Test property', { test: 123 });

        await expect(property.get()).resolves.toStrictEqual({ test: 123 });
        await expect(property.set({ test: 456 })).toResolve();
        await expect(property.get()).resolves.toStrictEqual({ test: 456 });
    });

    it('gets the default value if a non-string value is stored', async () => {
        await GMsetValue('testProperty', 123);

        await expect(property.get()).resolves.toBe('default');
    });

    it('gets the default value if an invalid value is stored', async () => {
        await GMsetValue('testProperty', '"dde');

        await expect(property.get()).resolves.toBe('default');
    });
});
