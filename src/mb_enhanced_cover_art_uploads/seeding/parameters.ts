import { LOGGER } from '@lib/logging/logger';
import type { CoverArt } from '../providers/base';

function encodeValue(value: unknown): string {
    if (value instanceof URL) return value.href;
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
}

function decodeSingleKeyValue(key: string, value: string, images: CoverArt[]): void {
    const keyName = key.split('.').at(-1);
    const imageIdxString = key.match(/x_seed\.image\.(\d+)\./)?.[1];
    if (!imageIdxString || !['url', 'type', 'comment'].includes(keyName)) {
        throw new Error(`Unsupported seeded key: ${key}`);
    }

    const imageIdx = parseInt(imageIdxString);

    if (!images[imageIdx]) {
        images[imageIdx] = {} as unknown as CoverArt;
    }

    if (keyName === 'url') {
        images[imageIdx].url = new URL(value);
    } else if (keyName === 'type') {
        const types = JSON.parse(value);
        if (!Array.isArray(types) || types.some((type) => typeof type !== 'number')) {
            throw new Error(`Invalid 'type' parameter: ${value}`);
        }
        images[imageIdx].type = JSON.parse(value);
    } else {
        images[imageIdx].comment = value;
    }
}

export class SeedParameters {
    readonly images: CoverArt[]
    readonly origin?: string

    constructor(images?: CoverArt[], origin?: string) {
        this.images = images ?? [];
        this.origin = origin;
    }

    addImage(image: CoverArt): void {
        this.images.push(image);
    }

    encode(): string {
        const params = this.images.flatMap((image, index) =>
            Object.entries(image).map(([key, value]) => {
                return `x_seed.image.${index}.${key}=${encodeValue(value)}`;
            }));
        const imageParams = params.join('&');

        if (!this.origin) {
            return imageParams;
        }

        return imageParams + '&x_seed.origin=' + encodeURIComponent(this.origin);
    }

    createSeedURL(releaseId: string): string {
        return `https://musicbrainz.org/release/${releaseId}/add-cover-art?${this.encode()}`;
    }

    static decode(allParams: string): SeedParameters {
        const params = allParams.replace(/^\?/, '').split('&')
            .map((param) => param.split('='));
        const imageParams = params
            .filter(([k]) => k.startsWith('x_seed.image.'));

        const images: CoverArt[] = [];
        imageParams.forEach(([k, v]) => {
            try {
                decodeSingleKeyValue(k, decodeURIComponent(v), images);
            } catch (err) {
                LOGGER.error(`Invalid image seeding param ${k}=${v}`, err);
            }
        });

        // Sanity checks: Make sure all images have at least a URL, and condense
        // the array in case indices are missing. We'll condense by looping
        // through the array and pushing any valid image to a new one.
        const imagesCleaned: CoverArt[] = [];
        images.forEach((image, index) => {
            // URL could be undefined if it either was never given as a param,
            // or if it was invalid.
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (image.url) {
                imagesCleaned.push(image);
            } else {
                LOGGER.warn(`Ignoring seeded image ${index}: No URL provided`);
            }
        });

        const origin = params.find(([k]) => k === 'x_seed.origin')?.[1];

        return new SeedParameters(imagesCleaned, origin ? decodeURIComponent(origin) : undefined);
    }
}
