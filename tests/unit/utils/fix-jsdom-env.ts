// JSDom removes TextEncoder and TextDecoder from the node global env, restore them
import { TextDecoder, TextEncoder } from 'util';
// @ts-expect-error: Some incompatibilities between node and web.
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

// Same for crypto
import { webcrypto } from 'crypto';
// @ts-expect-error: Some incompatibilities between node and web.
global.crypto = webcrypto;
