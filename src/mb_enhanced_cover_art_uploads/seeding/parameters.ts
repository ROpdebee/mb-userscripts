import { LOGGER } from '@lib/logging/logger';
import { safeParseJSON } from '@lib/util/json';
import type { CoverArt } from '../providers/base';

function encodeValue(value: unknown): string {
    if (value instanceof URL) return value.href;
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
}

function decodeSingleKeyValue(key: string, value: string, images: CoverArt[]): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const keyName = key.split('.').pop()!;
    const imageIdxString = key.match(/x_seed\.image\.(\d+)\./)?.[1];
    if (!imageIdxString || !['url', 'types', 'comment'].includes(keyName)) {
        throw new Error(`Unsupported seeded key: ${key}`);
    }

    const imageIdx = parseInt(imageIdxString);

    if (!images[imageIdx]) {
        images[imageIdx] = {} as unknown as CoverArt;
    }

    if (keyName === 'url') {
        images[imageIdx].url = new URL(value);
    } else if (keyName === 'types') {
        const types = safeParseJSON(value);
        if (!Array.isArray(types) || types.some((type) => typeof type !== 'number')) {
            throw new Error(`Invalid 'types' parameter: ${value}`);
        }
        images[imageIdx].types = types;
    } else {
        images[imageIdx].comment = value;
    }
}

export class SeedParameters {
    readonly images: CoverArt[];
    readonly origin?: string;

    constructor(images?: CoverArt[], origin?: string) {
        this.images = images ?? [];
        this.origin = origin;
    }

    addImage(image: CoverArt): void {
        this.images.push(image);
    }

    encode(): URLSearchParams {
        const seedParams = new URLSearchParams(this.images.flatMap((image, index) =>
            Object.entries(image).map(([key, value]) => [`x_seed.image.${index}.${key}`, encodeValue(value)]),
        ));

        if (this.origin) {
            seedParams.append('x_seed.origin', this.origin);
        }

        return seedParams;
    }

    createSeedURL(releaseId: string): string {
        return `https://musicbrainz.org/release/${releaseId}/add-cover-art?${this.encode()}`;
    }

    static decode(seedParams: URLSearchParams): SeedParameters {
        let images: CoverArt[] = [];
        seedParams.forEach((value, key) => {
            // only image parameters can be decoded to cover art images
            if (!key.startsWith('x_seed.image.')) return;

            try {
                decodeSingleKeyValue(key, value, images);
            } catch (err) {
                LOGGER.error(`Invalid image seeding param ${key}=${value}`, err);
            }
        });

        // Sanity checks: Make sure all images have at least a URL, and condense
        // the array in case indices are missing.
        images = images.filter((image, index) => {
            // URL could be undefined if it either was never given as a param,
            // or if it was invalid.
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (image.url) {
                return true;
            } else {
                LOGGER.warn(`Ignoring seeded image ${index}: No URL provided`);
                return false;
            }
        });

        const origin = seedParams.get('x_seed.origin') ?? undefined;

        return new SeedParameters(images, origin);
    }
}
