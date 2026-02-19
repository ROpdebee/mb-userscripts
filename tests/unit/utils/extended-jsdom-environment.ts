import { webcrypto } from 'node:crypto';
import { TextDecoder, TextEncoder } from 'node:util';

import JSDOMEnvironment from 'setup-polly-jest/jest-environment-jsdom';

export default class ExtendedJSDOMEnvironment extends JSDOMEnvironment {
    public constructor(...arguments_: ConstructorParameters<typeof JSDOMEnvironment>) {
        super(...arguments_);

        this.patchTextEncoder();
        this.patchCrypto();
        this.patchStructuredClone();
    }

    private patchTextEncoder(): void {
        // JSDom removes TextEncoder and TextDecoder from the node global env, restore them
        this.global.TextDecoder = TextDecoder;
        this.global.TextEncoder = TextEncoder;
    }

    private patchCrypto(): void {
        // Crypto has been patched by JSDOM, so needs to be restored too.

        // Reset ArrayBuffer to use Node's version over the JSDOM mock. The
        // crypto APIs expect a real ArrayBuffer instead.
        this.global.ArrayBuffer = ArrayBuffer;
        // @ts-expect-error: Some incompatibilities between node and web.
        this.global.crypto.subtle = webcrypto.subtle;
    }

    private patchStructuredClone(): void {
        // JSDOM also removes structuredClone, which is needed by fake-indexeddb.
        this.global.structuredClone = structuredClone;
    }
}
