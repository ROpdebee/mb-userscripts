import { getFromPageContext } from '@lib/compat';

function hexEncode(buffer: ArrayBuffer): string {
    // https://stackoverflow.com/a/40031979
    const Uint8Array = getFromPageContext('Uint8Array');
    return [...new Uint8Array(buffer)]
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

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
