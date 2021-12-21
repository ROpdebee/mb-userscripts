import { getFromPageContext } from '@lib/compat';

function hexEncode(buffer: ArrayBuffer): string {
    // https://stackoverflow.com/a/40031979
    const Uint8Array = getFromPageContext('Uint8Array');
    return [...new Uint8Array(buffer)]
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

export function blobToDigest(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        // Can't use blob.arrayBuffer since it's very new and not polyfilled
        // by core-js (W3C, not ES)
        const reader = new FileReader();
        reader.addEventListener('error', reject);
        reader.addEventListener('load', async () => {
            const buffer = reader.result as ArrayBuffer;
            // Crypto API might be unavailable in older browsers, and on http://*
            // istanbul ignore next: Not available in node, second part will never be covered.
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            const hasCrypto = typeof crypto !== 'undefined' && typeof crypto.subtle?.digest !== 'undefined';

            // istanbul ignore else: Not available in node
            if (hasCrypto) {
                resolve(hexEncode(await crypto.subtle.digest('SHA-256', buffer)));
            } else {
                resolve(hexEncode(buffer));
            }
        });

        reader.readAsArrayBuffer(blob);
    });
}
