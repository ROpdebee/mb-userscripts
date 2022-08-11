import { getItemMetadata } from '@lib/IA/ArchiveMetadata';
import { setupPolly } from '@test-utils/pollyjs';

// eslint-disable-next-line jest/require-hook
setupPolly();

describe('getting image metadata', () => {
    it('fetches IA metadata', async () => {
        const meta = await getItemMetadata('coverartarchive_audit_20210419');

        expect(meta).toHaveProperty('metadata.identifier', 'coverartarchive_audit_20210419');
        expect(meta).toHaveProperty('files[0].name', 'actionable_results.tar.xz');
    });

    it('throws on non-existent item', async () => {
        await expect(getItemMetadata('e3e23e23r32r32')).rejects.toThrowWithMessage(Error, 'Empty IA metadata, item might not exist');
    });

    it('throws on darkened item', async () => {
        await expect(getItemMetadata('mbid-3c556c47-110d-4782-a607-c93e486bccf8')).rejects.toThrowWithMessage(Error, 'Cannot access IA metadata: This item is darkened');
    });
});
