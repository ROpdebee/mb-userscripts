import { blobToDigest } from '@lib/util/blob';

describe('converting blob to digest', () => {
    it('returns digest of blob', async () => {
        await expect(blobToDigest(new Blob(['test'])))
            // Normally, in node, this will return the hex content of the
            // response, not a SHA-256 digest, since the SubtleCrypto API
            // isn't available. However, we're polyfilling it in tests/util/fix-jsdom-env.ts
            .resolves.toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
    });
});
