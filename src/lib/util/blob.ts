/**
 * Utilities for working with binary data.
 */

import { getFromPageContext } from '@lib/compat';

/**
 * Encode a binary buffer to a hexadecimal string.
 *
 * @param      {ArrayBuffer}  buffer  The buffer.
 * @return     {string}       Hexadecimal representation of `buffer`.
 */
function hexEncode(buffer: ArrayBuffer): string {
    // https://stackoverflow.com/a/40031979
    const Uint8Array = getFromPageContext('Uint8Array');
    return [...new Uint8Array(buffer)]
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Create a digest of a given blob, such as a cryptographic hash or a checksum.
 *
 * Exact algorithm used to generate the digest, and the length and nature of
 * the resulting digest, are unspecified, but will be sufficiently unique to
 * distinguish different blobs from each other.
 *
 * @param      {Blob}             blob    The blob.
 * @return     {Promise<string>}  Unique digest of the blob.
 */
export function blobToDigest(blob: Blob): Promise<string> {
    async function onLoad(reader: FileReader): Promise<string> {
        const buffer = reader.result as ArrayBuffer;

        // Crypto API might be unavailable in older browsers, and on http://*
        // istanbul ignore next: Not available in node
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return hexEncode(await (crypto?.subtle?.digest?.('SHA-256', buffer) ?? buffer));
    }

    return new Promise((resolve, reject) => {
        // Can't use blob.arrayBuffer since it's very new and not polyfilled
        // by core-js (W3C, not ES)
        const reader = new FileReader();
        reader.addEventListener('error', reject);
        // `FileReader.addEventListener` expects a synchronous callback, but we
        // need to do asynchronous stuff to create the SHA-256 digest.
        // Therefore, we do the asynchronous stuff in `onLoad` and `.then()`
        // the result to resolve/reject the outer promise.
        reader.addEventListener('load', () => {
            onLoad(reader)
                .then(resolve)
                .catch(reject);
        });

        reader.readAsArrayBuffer(blob);
    });
}
