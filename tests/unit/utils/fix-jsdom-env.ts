// JSDom removes TextEncoder and TextDecoder from the node global env, restore them
import { TextDecoder, TextEncoder } from 'node:util';
// @ts-expect-error: Some incompatibilities between node and web.
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

// Same for crypto
import { webcrypto } from 'node:crypto';
// @ts-expect-error: Some incompatibilities between node and web.
global.crypto = webcrypto;
