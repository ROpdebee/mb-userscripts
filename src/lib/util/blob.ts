import { getFromPageContext } from '@lib/compat';

function hexEncode(buffer: ArrayBuffer): string {
    // https://stackoverflow.com/a/40031979
    const Uint8Array = getFromPageContext('Uint8Array');
    return [...new Uint8Array(buffer)]
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

export async function blobToDigest(blob: Blob): Promise<string> {
    const buffer = await blobToBuffer(blob);
    // Crypto API might be unavailable in older browsers, and on http://*
    // istanbul ignore next: Not available in node
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return hexEncode(await (crypto?.subtle?.digest?.('SHA-256', buffer) ?? buffer));
}

export function blobToBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        // Can't use blob.arrayBuffer since it's very new and not polyfilled
        // by core-js (W3C, not ES)
        const reader = new FileReader();
        reader.addEventListener('error', reject);
        reader.addEventListener('load', () => {
            resolve(reader.result as ArrayBuffer);
        });

        reader.readAsArrayBuffer(blob);
    });
}
