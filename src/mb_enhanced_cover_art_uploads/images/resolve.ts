import { LOGGER } from '@lib/logging/logger';

import type { CoverArtProvider } from '../providers/base';
import type { CoverArt, CoverArtBatch, CoverArtJob, CoverArtMetadata } from '../types';
import { getProvider } from '../providers';
import { getMaximisedCandidates } from './maximise';

/**
 * Functionality to take an input URL and resolve it to a set of images and their metadata.
 */
export class CoverArtResolver {
    private readonly cache = new Map<string, CoverArtBatch>();

    public async resolveImages(job: CoverArtJob): Promise<CoverArtBatch> {
        const { url } = job;
        if (this.cache.has(url.href)) {
            return this.cache.get(url.href)!;
        }

        let result: CoverArtBatch;

        const provider = getProvider(url);
        if (provider) {
            result = await this.resolveImagesFromProvider(job, provider);
        } else {
            const coverArt = await this.augmentCoverArt({ url: job.url }, job);
            result = {
                jobUrl: url,
                images: [coverArt],
            };
        }

        this.cache.set(url.href, result);
        return result;
    }

    protected async resolveImagesFromProvider(job: CoverArtJob, provider: CoverArtProvider): Promise<CoverArtBatch> {
        LOGGER.info(`Searching for images in ${provider.name} release…`);
        const { url } = job;

        // This could throw, assuming caller will catch.
        const bareImages = await provider.findImages(url);
        const images = await Promise.all(bareImages.map((image) => this.augmentCoverArt(image, job)));

        // eslint-disable-next-line unicorn/explicit-length-check
        LOGGER.info(`Found ${bareImages.length || 'no'} image(s) in ${provider.name} release`);

        return {
            provider,
            jobUrl: url,
            images,
        };
    }

    private async augmentCoverArt(image: CoverArt, job: CoverArtJob): Promise<CoverArtMetadata> {
        const { types: defaultTypes, comment: defaultComment } = job;

        return {
            ...image,
            types: image.types ?? defaultTypes ?? [],
            comment: image.comment ?? defaultComment ?? '',
            originalUrl: image.url,
            maximisedUrlCandidates: await getMaximisedCandidates(image.url),
        };
    }
}
