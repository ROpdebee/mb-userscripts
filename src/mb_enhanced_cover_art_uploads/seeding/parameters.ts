import { LOGGER } from '@lib/logging/logger';
import { safeParseJSON } from '@lib/util/json';

import type { BareCoverArt } from '../types';

function encodeValue(value: unknown): string {
    if (value instanceof URL) return value.href;
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
}

function decodeSingleKeyValue(key: string, value: string, images: BareCoverArt[]): void {
    const keyName = key.split('.').pop()!;
    const imageIndexString = key.match(/x_seed\.image\.(\d+)\./)?.[1];
    if (!imageIndexString || !['url', 'types', 'comment'].includes(keyName)) {
        throw new Error(`Unsupported seeded key: ${key}`);
    }

    const imageIndex = Number.parseInt(imageIndexString);

    if (!images[imageIndex]) {
        images[imageIndex] = {} as unknown as BareCoverArt;
    }

    if (keyName === 'url') {
        images[imageIndex].url = new URL(value);
    } else if (keyName === 'types') {
        const types = safeParseJSON(value);
        if (!Array.isArray(types) || types.some((type) => typeof type !== 'number')) {
            throw new Error(`Invalid 'types' parameter: ${value}`);
        }
        images[imageIndex].types = types;
    } else {
        images[imageIndex].comment = value;
    }
}

export class SeedParameters {
    private readonly _images: Array<Readonly<BareCoverArt>>;
    public readonly origin?: string;

    public constructor(images?: ReadonlyArray<Readonly<BareCoverArt>>, origin?: string) {
        this._images = [...(images ?? [])];
        this.origin = origin;
    }

    public get images(): ReadonlyArray<Readonly<BareCoverArt>> {
        return this._images;
    }

    public addImage(image: BareCoverArt): void {
        this._images.push(image);
    }

    public encode(): URLSearchParams {
        const seedParameters = new URLSearchParams(this.images.flatMap((image, index) =>
            Object.entries(image).map(([key, value]) => [`x_seed.image.${index}.${key}`, encodeValue(value)]),
        ));

        if (this.origin) {
            seedParameters.append('x_seed.origin', this.origin);
        }

        return seedParameters;
    }

    public createSeedURL(releaseId: string, domain = 'musicbrainz.org'): string {
        return `https://${domain}/release/${releaseId}/add-cover-art?${this.encode()}`;
    }

    public static decode(seedParameters: URLSearchParams): SeedParameters {
        let images: BareCoverArt[] = [];
        for (const [key, value] of seedParameters.entries()) {
            // only image parameters can be decoded to cover art images
            if (!key.startsWith('x_seed.image.')) continue;

            try {
                decodeSingleKeyValue(key, value, images);
            } catch (error) {
                LOGGER.error(`Invalid image seeding param ${key}=${value}`, error);
            }
        }

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

        const origin = seedParameters.get('x_seed.origin') ?? undefined;

        return new SeedParameters(images, origin);
    }
}
