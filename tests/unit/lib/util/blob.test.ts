import { blobToDigest } from '@lib/util/blob';

describe('converting blob to digest', () => {
    it('returns digest of blob', async () => {
        await expect(blobToDigest(new Blob(['test'])))
            // in node, this will return the hex content of the response, not a SHA-256
            // digest, since the SubtleCrypto API isn't available.
            .resolves.toBe('74657374');
    });
});
