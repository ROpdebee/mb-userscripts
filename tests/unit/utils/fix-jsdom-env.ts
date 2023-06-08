// JSDom removes TextEncoder and TextDecoder from the node global env, restore them
import { TextDecoder, TextEncoder } from 'node:util';
// @ts-expect-error: Some incompatibilities between node and web.
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

// Same for crypto
import { webcrypto } from 'node:crypto';
const cryptoDigest = webcrypto.subtle.digest.bind(webcrypto.subtle);
// @ts-expect-error: Some incompatibilities between node and web.
crypto.subtle = webcrypto.subtle;
crypto.subtle.digest = (algorithm, data): Promise<ArrayBuffer> => {
    if (data instanceof ArrayBuffer) {
        // Need to copy the given data, otherwise node's webcrypto digest function
        // throws an error stating that the data isn't an ArrayBuffer. This
        // probably has something to do with the FileReader that's polyfilled by
        // jest, used in lib/util/blob.
        data = new Uint8Array(data);
    }
    return cryptoDigest(algorithm, data);
};
