import pRetry from 'p-retry';

import type { BlobResponse, ProgressEvent } from '@lib/util/request';
import { getFromPageContext } from '@lib/compat';
import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { enumerate } from '@lib/util/array';
import { blobToBuffer } from '@lib/util/blob';
import { HTTPResponseError, request } from '@lib/util/request';
import { urlBasename } from '@lib/util/urls';

import type { CoverArtProvider } from './providers/base';
import type { BareCoverArt, CoverArt, FetchedImage, ImageContents, QueuedImage, QueuedImageBatch } from './types';
import { CONFIG } from './config';
import { enqueueImage } from './form';
import { getMaximisedCandidates } from './maximise';
import { getProvider, getProviderByDomain } from './providers';

function getFilename(url: URL): string {
    return decodeURIComponent(urlBasename(url, 'image'));
}

/**
 * Hooks to observe fetcher state. URL is indicative and may change in between
 * calls, e.g. after maximisation.
 */
export interface FetcherHooks {
    /** Called when fetching an image has started. */
    onFetchStarted?(imageId: number, url: URL): void;
    /** Called to notify of progress of fetch. */
    onFetchProgress?(imageId: number, url: URL, progress: ProgressEvent): void;
    /** Called when fetching has finished, either successfully or failed. */
    onFetchFinished?(imageId: number): void;
}

export class ImageFetcher {
    private readonly doneImages: Set<string>;
    private readonly hooks: FetcherHooks;
    // Monotonically increasing ID to uniquely identify the image. We use this
    // so we can later set the image type.
    private lastId = 0;

    public constructor(hooks: FetcherHooks) {
        this.doneImages = new Set();
        this.hooks = hooks;
    }

    public async fetchImages(coverArt: BareCoverArt): Promise<QueuedImageBatch> {
        const { url } = coverArt;
        if (this.urlAlreadyAdded(url)) {
            LOGGER.warn(`${url} has already been added`);
            return {
                images: [],
            };
        }

        const provider = getProvider(url);
        if (provider) {
            return this.fetchImagesFromProvider(coverArt, provider);
        }

        const { types: defaultTypes, comment: defaultComment } = coverArt;
        const result = await this.fetchImageFromURL(url);
        if (!result) {
            return { images: [] };
        }

        await enqueueImage(result, defaultTypes, defaultComment);
        return {
            images: [result],
        };
    }

    private async fetchMaximisedImage(url: URL, id: number): Promise<ImageContents | undefined> {
        for await (const maxCandidate of getMaximisedCandidates(url)) {
            const candidateName = maxCandidate.filename || getFilename(maxCandidate.url);
            if (this.urlAlreadyAdded(maxCandidate.url)) {
                LOGGER.warn(`${maxCandidate.url} has already been added`);
                return;
            }

            try {
                const result = await this.fetchImageContents(maxCandidate.url, candidateName, id, maxCandidate.headers);
                // IMU might return the same URL as was inputted, no use in logging that.
                // istanbul ignore next: Logging
                if (maxCandidate.url.href !== url.href) {
                    LOGGER.info(`Maximised ${url.href} to ${maxCandidate.url.href}`);
                }
                return result;
            } catch (error) {
                // istanbul ignore if: Fine.
                if (maxCandidate.likely_broken) continue;
                LOGGER.warn(`Skipping maximised candidate ${maxCandidate.url}`, error);
            }
        }

        // If we couldn't fetch any maximised images, try the original URL
        return this.fetchImageContents(url, getFilename(url), id, {});
    }

    private async fetchImageFromURL(url: URL, skipMaximisation = false): Promise<FetchedImage | undefined> {
        const id = this.getImageId();
        this.hooks.onFetchStarted?.(id, url);
        // Attempt to maximise the image if necessary
        // Might throw, caller needs to catch
        try {
            const fetchResult = await (
                skipMaximisation
                    ? this.fetchImageContents(url, getFilename(url), id, {})
                    : this.fetchMaximisedImage(url, id)
            );

            // If result is undefined, the image was already added previously.
            if (!fetchResult) return;

            this.doneImages.add(fetchResult.fetchedUrl.href);
            this.doneImages.add(fetchResult.requestedUrl.href);
            this.doneImages.add(url.href);

            return {
                content: fetchResult.file,
                originalUrl: url,
                maximisedUrl: fetchResult.requestedUrl,
                fetchedUrl: fetchResult.fetchedUrl,
                wasMaximised: url.href !== fetchResult.requestedUrl.href,
                wasRedirected: fetchResult.wasRedirected,
                // We have no idea what the type or comment will be, so leave them
                // undefined so that a default, if any, can be inserted.
            };
        } finally {
            this.hooks.onFetchFinished?.(id);
        }
    }

    private async fetchImagesFromProvider({ url, types: defaultTypes, comment: defaultComment }: BareCoverArt, provider: CoverArtProvider): Promise<QueuedImageBatch> {
        LOGGER.info(`Searching for images in ${provider.name} release…`);

        // This could throw, assuming caller will catch.
        const images = await provider.findImages(url);
        const finalImages = (await CONFIG.fetchFrontOnly.get()) ? this.retainOnlyFront(images) : images;
        // FIXME: This may be broken for providers which skip checking track images.
        const hasMoreImages = images.length !== finalImages.length;

        // eslint-disable-next-line unicorn/explicit-length-check
        LOGGER.info(`Found ${finalImages.length || 'no'} image(s) in ${provider.name} release`);
        // We need to fetch each image sequentially because each one is checked
        // against any previously fetched images, to avoid adding duplicates.
        // Fetching in parallel would lead to race conditions.
        const queuedResults: QueuedImage[] = [];
        for (const [image, index] of enumerate(finalImages)) {
            if (this.urlAlreadyAdded(image.url)) {
                LOGGER.warn(`${image.url} has already been added`);
                continue;
            }

            LOGGER.info(`Fetching ${image.url} (${index + 1}/${finalImages.length})`);
            try {
                const result = await this.fetchImageFromURL(image.url, image.skipMaximisation);
                // Maximised image already added
                if (!result) continue;

                const fetchedImage = {
                    ...result,
                    types: image.types,
                    comment: image.comment,
                };

                const postprocessedImage = await provider.postprocessImage(fetchedImage);
                if (postprocessedImage) {
                    await enqueueImage(fetchedImage, defaultTypes, defaultComment);
                    queuedResults.push(postprocessedImage);
                }
            } catch (error) {
                LOGGER.warn(`Skipping ${image.url}`, error);
            }
        }

        if (!hasMoreImages && queuedResults.length === finalImages.length) {
            // Don't mark the whole provider URL as done if we haven't grabbed
            // all images or some images failed.
            this.doneImages.add(url.href);
        } else if (hasMoreImages) {
            LOGGER.warn(`Not all images were fetched: ${images.length - finalImages.length} covers were skipped.`);
        }

        return {
            containerUrl: url,
            images: queuedResults,
        };
    }

    private retainOnlyFront(images: CoverArt[]): CoverArt[] {
        // Return only the front images. If no image with Front type is found
        // in the array, assume the first image is the front one. If there are
        // multiple front images, return them all (e.g. Bandcamp original and
        // square crop).
        const filtered = images.filter((image) => image.types?.includes(ArtworkTypeIDs.Front));
        return filtered.length > 0 ? filtered : images.slice(0, 1);
    }

    private getImageId(): number {
        return this.lastId++;
    }

    private createUniqueFilename(filename: string, id: number, mimeType: string): string {
        const filenameWithoutExtension = filename.replace(/\.(?:png|jpe?g|gif|pdf)$/i, '');
        return `${filenameWithoutExtension}.${id}.${mimeType.split('/')[1]}`;
    }

    private async fetchImageContents(url: URL, fileName: string, id: number, headers: Record<string, string>): Promise<ImageContents> {
        const xhrOptions = {
            responseType: 'blob',
            headers: headers,
            onProgress: this.hooks.onFetchProgress?.bind(this.hooks, id, url),
        } as const;

        // Need to retry image loading because some services, like Discogs, may
        // return 429 HTTP errors.
        // TODO: Copied from seeding/atisket/dimensions.ts, should be put in lib.
        const response = await pRetry(() => request.get(url, xhrOptions), {
            retries: 10,
            onFailedAttempt: (error) => {
                // Don't retry on 4xx status codes except for 429. Anything below 400 doesn't throw a HTTPResponseError.
                if (!(error instanceof HTTPResponseError) || (error.statusCode < 500 && error.statusCode !== 429)) {
                    throw error;
                }

                LOGGER.info(`Failed to retrieve image contents after ${error.attemptNumber} attempt(s): ${error.message}. Retrying (${error.retriesLeft} attempt(s) left)…`);
            },
        });

        if (response.url === undefined) {
            LOGGER.warn(`Could not detect if URL ${url.href} caused a redirect`);
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Could be empty string.
        const fetchedUrl = new URL(response.url || url);
        const wasRedirected = fetchedUrl.href !== url.href;

        if (wasRedirected) {
            LOGGER.warn(`Followed redirect of ${url.href} -> ${fetchedUrl.href} while fetching image contents`);
        }

        const { mimeType, isImage } = await this.determineMimeType(response);

        if (!isImage) {
            if (!mimeType?.startsWith('text/')) {
                throw new Error(`Expected "${fileName}" to be an image, but received ${mimeType ?? 'unknown file type'}.`);
            }

            // Check for wrong provider URL, e.g. artist URLs. We need to delay
            // this check until now as we cannot check for unsupported provider
            // URLs in the top-level `fetchImages`, because the URL given there
            // could still point to an actual image.
            const candidateProvider = getProviderByDomain(url);
            if (candidateProvider !== undefined) {
                throw new Error(`This page is not (yet) supported by the ${candidateProvider.name} provider, are you sure this page corresponds to a MusicBrainz release?`);
            }

            throw new Error('Expected to receive an image, but received text. Perhaps this provider is not supported yet?');
        }

        // Convert and copy the response blob to a buffer.
        // We copy the content to make sure the contents do not get unloaded
        // before the image is uploaded. See https://github.com/ROpdebee/mb-userscripts/issues/582
        const contentBuffer = await blobToBuffer(response.blob);

        return {
            requestedUrl: url,
            fetchedUrl,
            wasRedirected,
            file: new File(
                [contentBuffer],
                this.createUniqueFilename(fileName, id, mimeType),
                { type: mimeType }),
        };
    }

    private async determineMimeType(response: BlobResponse): Promise<{ isImage: false; mimeType: string | undefined } | { isImage: true; mimeType: string }> {
        const rawFile = new File([response.blob], 'image');
        return new Promise((resolve) => {
            // Adapted from https://github.com/metabrainz/musicbrainz-server/blob/2b00b844f3fe4293fc4ccb9de1c30e3c2ddc95c1/root/static/scripts/edit/MB/CoverArt.js#L139
            // We can't use MB.CoverArt.validate_file since it's not available
            // in Greasemonkey unless we use unsafeWindow. However, if we use
            // unsafeWindow, we get permission errors (probably because we're
            // sending our functions into another context).
            const reader = new FileReader();
            // istanbul ignore next: Copied from MB.
            reader.addEventListener('load', () => {
                // eslint-disable-next-line sonarjs/no-globals-shadowing
                const Uint32Array = getFromPageContext('Uint32Array');
                const uint32view = new Uint32Array(reader.result as ArrayBuffer);
                if ((uint32view[0] & 0x00FFFFFF) === 0x00FFD8FF) {
                    resolve({ mimeType: 'image/jpeg', isImage: true });
                } else {
                    switch (uint32view[0]) {
                        case 0x38464947:
                            resolve({ mimeType: 'image/gif', isImage: true });
                            break;

                        case 0x474E5089:
                            resolve({ mimeType: 'image/png', isImage: true });
                            break;

                        case 0x46445025:
                            resolve({ mimeType: 'application/pdf', isImage: true });
                            break;

                        default:
                            resolve({
                                mimeType: response.headers.get('Content-Type')?.match(/[^;\s]+/)?.[0],
                                isImage: false,
                            });
                    }
                }
            });
            reader.readAsArrayBuffer(rawFile.slice(0, 4));
        });
    }

    private urlAlreadyAdded(url: URL): boolean {
        return this.doneImages.has(url.href);
    }
}
