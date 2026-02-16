import pRetry from 'p-retry';

import type { BlobResponse, ProgressEvent } from '@lib/util/request';
import { getFromPageContext } from '@lib/compat';
import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { enumerate } from '@lib/util/array';
import { blobToBuffer } from '@lib/util/blob';
import { identity } from '@lib/util/functions';
import { HTTPResponseError, request } from '@lib/util/request';
import { urlBasename } from '@lib/util/urls';

import type { CoverArtProvider } from '../providers/base';
import type { CoverArtBatch, CoverArtMetadata, FetchedImage, ImageContents, QueuedImage, QueuedImageBatch } from '../types';
import { CONFIG } from '../config';
import { enqueueImage } from '../form';
import { getProviderByDomain } from '../providers';

function getFilename(url: URL): string {
    return decodeURIComponent(urlBasename(url, 'image'));
}

/**
 * Hooks to observe downloader state. URL is indicative and may change in between
 * calls, e.g. after maximisation.
 */
export interface CoverArtDownloaderHooks {
    /** Called when an image download has started. */
    onDownloadStarted?(imageId: number, url: URL): void;
    /** Called to notify of progress of a download. */
    onDownloadProgress?(imageId: number, url: URL, progress: ProgressEvent): void;
    /** Called when a download has finished, either successfully or failed. */
    onDownloadFinished?(imageId: number): void;
}

/**
 * Functionality to take a set of images and to download them and queue them.
 */
export class CoverArtDownloader {
    private readonly doneImages: Set<string>;
    private readonly hooks: CoverArtDownloaderHooks;
    // Monotonically increasing ID to uniquely identify the image. We use this
    // so we can later set the image type.
    private lastId = 0;

    public constructor(hooks: CoverArtDownloaderHooks) {
        this.doneImages = new Set();
        this.hooks = hooks;
    }

    public async enqueueCoverArt(batch: CoverArtBatch): Promise<QueuedImageBatch> {
        if (batch.images.length === 0) return { ...batch, images: [] };
        if (this.urlAlreadyAdded(batch.jobUrl)) {
            LOGGER.warn(`${batch.jobUrl} has already been added`);
            return {
                ...batch,
                images: [],
            };
        }

        const finalImages = (await CONFIG.fetchFrontOnly.get()) ? this.retainOnlyFront(batch.images) : batch.images;
        // FIXME: This may be broken for providers which skip checking track images.
        const hasMoreImages = batch.images.length !== finalImages.length;
        if (hasMoreImages) {
            LOGGER.info(`Skipping ${batch.images.length - finalImages.length} non-front image(s)`);
        }

        LOGGER.info(`Fetching ${finalImages.length} image(s) for ${batch.jobUrl}…`);
        const queuedResults = await this.fetchAndEnqueue(finalImages, batch.provider?.postprocessImage.bind(batch.provider) ?? identity);

        // Don't mark the whole provider URL as done if we haven't grabbed all images or some images failed.
        if (!hasMoreImages && queuedResults.length === finalImages.length) {
            this.doneImages.add(batch.jobUrl.href);
        }

        // Only define a container URL if there's an actual container.
        const containerUrl = (
            (queuedResults.length === 1 && queuedResults[0].originalUrl.href === batch.jobUrl.href)
                ? undefined
                : batch.jobUrl);

        return {
            ...batch,
            containerUrl,
            images: queuedResults,
        };
    }

    private async fetchAndEnqueue(images: CoverArtMetadata[], postprocessImage: CoverArtProvider['postprocessImage']): Promise<QueuedImage[]> {
        const queuedResults: QueuedImage[] = [];

        // We need to fetch each image sequentially because each one is checked
        // against any previously fetched images, to avoid adding duplicates.
        // Fetching in parallel would lead to race conditions.
        for (const [image, index] of enumerate(images)) {
            if (this.urlAlreadyAdded(image.originalUrl)) {
                LOGGER.warn(`${image.originalUrl} has already been added`);
                continue;
            }

            LOGGER.info(`Fetching ${image.originalUrl} (${index + 1}/${images.length})`);

            try {
                const fetchedImage = await this.downloadImage(image);

                const postprocessedImage = fetchedImage && await postprocessImage(fetchedImage);
                if (postprocessedImage) {
                    const queuedImage = {
                        types: image.types,
                        comment: image.comment,
                        ...fetchedImage,
                    };
                    await enqueueImage(queuedImage);
                    queuedResults.push(queuedImage);
                }
            } catch (error) {
                LOGGER.warn(`Skipping ${image.originalUrl}`, error);
            }
        }

        return queuedResults;
    }

    private async downloadImage(image: CoverArtMetadata): Promise<FetchedImage | null> {
        const { originalUrl } = image;
        const id = this.getImageId();
        this.hooks.onDownloadStarted?.(id, originalUrl);

        try {
            const fetchResult = await this.downloadMaxImage(image, id);
            if (fetchResult === null) return null;

            this.doneImages.add(fetchResult.fetchedUrl.href);
            this.doneImages.add(fetchResult.requestedUrl.href);
            this.doneImages.add(originalUrl.href);

            return {
                content: fetchResult.file,
                originalUrl: originalUrl,
                maximisedUrl: fetchResult.requestedUrl,
                finalUrl: fetchResult.fetchedUrl,
                wasMaximised: originalUrl.href !== fetchResult.requestedUrl.href,
                wasRedirected: fetchResult.wasRedirected,
            };
        } finally {
            this.hooks.onDownloadFinished?.(id);
        }
    }

    private async downloadMaxImage(image: CoverArtMetadata, id: number): Promise<ImageContents | null> {
        const { originalUrl, maximisedUrlCandidates } = image;

        for (const maxCandidate of maximisedUrlCandidates) {
            const candidateName = maxCandidate.filename || getFilename(maxCandidate.url);
            if (this.urlAlreadyAdded(maxCandidate.url)) {
                LOGGER.warn(`${maxCandidate.url} has already been added`);
                return null;
            }

            try {
                const result = await this.downloadImageContents(maxCandidate.url, candidateName, id, maxCandidate.headers);
                // IMU might return the same URL as was inputted, no use in logging that.
                // istanbul ignore next: Logging
                if (maxCandidate.url.href !== originalUrl.href) {
                    LOGGER.info(`Maximised ${originalUrl.href} to ${maxCandidate.url.href}`);
                }
                return result;
            } catch (error) {
                // istanbul ignore if: Fine.
                if (maxCandidate.likely_broken) continue;
                LOGGER.warn(`Skipping maximised candidate ${maxCandidate.url}`, error);
            }
        }

        // If we couldn't fetch any maximised images, try the original URL
        return this.downloadImageContents(originalUrl, getFilename(originalUrl), id, {});
    }

    private getImageId(): number {
        return this.lastId++;
    }

    private createUniqueFilename(filename: string, id: number, mimeType: string): string {
        const filenameWithoutExtension = filename.replace(/\.(?:png|jpe?g|gif|pdf)$/i, '');
        return `${filenameWithoutExtension}.${id}.${mimeType.split('/')[1]}`;
    }

    private async downloadImageContents(url: URL, fileName: string, id: number, headers: Record<string, string>): Promise<ImageContents> {
        const xhrOptions = {
            responseType: 'blob',
            headers: headers,
            onProgress: this.hooks.onDownloadProgress?.bind(this.hooks, id, url),
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

    private retainOnlyFront(images: CoverArtMetadata[]): CoverArtMetadata[] {
        // Return only the front images. If no image with Front type is found
        // in the array, assume the first image is the front one. If there are
        // multiple front images, return them all (e.g. Bandcamp original and
        // square crop).
        const filtered = images.filter((image) => image.types.includes(ArtworkTypeIDs.Front));
        return filtered.length > 0 ? filtered : images.slice(0, 1);
    }
}
