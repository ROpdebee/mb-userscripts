import { LOGGER } from '@lib/logging/logger';
import { gmxhr } from '@lib/util/xhr';
import { getMaximisedCandidates } from './maximise';
import { getProvider } from './providers';
import { ArtworkTypeIDs } from './providers/base';
import type { CoverArt, CoverArtProvider } from './providers/base';

interface ImageContents {
    requestedUrl: URL;
    fetchedUrl: URL;
    wasRedirected: boolean;
    file: File;
}

export interface FetchedImage {
    content: File;
    originalUrl: URL;
    maximisedUrl: URL;
    fetchedUrl: URL;
    wasMaximised: boolean;
    wasRedirected: boolean;
    // types and comment may be empty or undefined. If undefined, the value
    // will be replaced by the default, if any. If defined but empty, the
    // default will not be used.
    types?: ArtworkTypeIDs[];
    comment?: string;  // Can be empty string
}

export interface FetchedImages {
    images: FetchedImage[];
    containerUrl?: URL;
}

function getFilename(url: URL): string {
    return decodeURIComponent(url.pathname.split('/').at(-1)) || 'image';
}

export class ImageFetcher {
    #doneImages: Set<string>;
    // Monotonically increasing ID to uniquely identify the image. We use this
    // so we can later set the image type.
    #lastId = 0;

    constructor() {
        this.#doneImages = new Set();
    }

    async fetchImages(url: URL, onlyFront: boolean): Promise<FetchedImages> {
        if (this.#urlAlreadyAdded(url)) {
            LOGGER.warn(`${getFilename(url)} has already been added`);
            return {
                images: [],
            };
        }

        const provider = getProvider(url);
        if (provider) {
            return this.fetchImagesFromProvider(url, provider, onlyFront);
        }

        const result = await this.fetchImageFromURL(url);
        if (!result) {
            return { images: [] };
        }

        return {
            images: [result],
        };
    }

    async fetchImageFromURL(url: URL, skipMaximisation = false): Promise<FetchedImage | undefined> {
        // Attempt to maximise the image
        let fetchResult: ImageContents | null = null;

        if (!skipMaximisation) {
            for await (const maxCandidate of getMaximisedCandidates(url)) {
                const candidateName = maxCandidate.filename || getFilename(maxCandidate.url);
                if (this.#urlAlreadyAdded(maxCandidate.url)) {
                    LOGGER.warn(`${candidateName} has already been added`);
                    return;
                }

                try {
                    fetchResult = await this.fetchImageContents(maxCandidate.url, candidateName, maxCandidate.headers);
                    LOGGER.debug(`Maximised ${url.href} to ${maxCandidate.url.href}`);
                    break;
                } catch (err) {
                    LOGGER.warn(`Skipping maximised candidate ${candidateName}`, err);
                }
            }
        }

        // If we couldn't fetch any maximised images, try the original URL
        if (!fetchResult) {
            // Might throw, caller needs to catch
            fetchResult = await this.fetchImageContents(url, getFilename(url), {});
        }

        this.#doneImages.add(fetchResult.fetchedUrl.href);
        this.#doneImages.add(fetchResult.requestedUrl.href);
        this.#doneImages.add(url.href);

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
    }

    async fetchImagesFromProvider(url: URL, provider: CoverArtProvider, onlyFront: boolean): Promise<FetchedImages> {
        LOGGER.info(`Searching for images in ${provider.name} release…`);

        // This could throw, assuming caller will catch.
        const images = await provider.findImages(url, onlyFront);
        const finalImages = onlyFront ? this.#retainOnlyFront(images) : images;
        const hasMoreImages = onlyFront && images.length !== finalImages.length;

        LOGGER.info(`Found ${finalImages.length || 'no'} images in ${provider.name} release`);
        const fetchResults: FetchedImage[] = [];
        for (const img of finalImages) {
            if (this.#urlAlreadyAdded(img.url)) {
                LOGGER.warn(`${getFilename(img.url)} has already been added`);
                continue;
            }

            try {
                const result = await this.fetchImageFromURL(img.url, img.skipMaximisation);
                // Maximised image already added
                if (!result) continue;

                fetchResults.push({
                    ...result,
                    types: img.types,
                    comment: img.comment,
                });
            } catch (err) {
                LOGGER.warn(`Skipping ${getFilename(img.url)}`, err);
            }
        }

        if (!hasMoreImages && !onlyFront) {
            // Don't mark the whole provider URL as done if we haven't grabbed
            // all images.
            this.#doneImages.add(url.href);
        }

        if (hasMoreImages) {
            LOGGER.warn(`Not all images were fetched: ${images.length - finalImages.length} covers were skipped.`);
        }

        return {
            containerUrl: url,
            images: fetchResults,
        };
    }

    #retainOnlyFront(images: CoverArt[]): CoverArt[] {
        // Return only the front images. If no image with Front type is found
        // in the array, assume the first image is the front one. If there are
        // multiple front images, return them all (e.g. Bandcamp original and
        // square crop).
        const filtered = images.filter((img) => img.types?.includes(ArtworkTypeIDs.Front));
        return filtered.length ? filtered : images.slice(0, 1);
    }

    #createUniqueFilename(filename: string, mimeType: string): string {
        const filenameWithoutExt = filename.replace(/\.(?:png|jpe?g|gif)$/i, '');
        return `${filenameWithoutExt}.${this.#lastId++}.${mimeType.split('/')[1]}`;
    }

    async fetchImageContents(url: URL, fileName: string, headers: Record<string, unknown>): Promise<ImageContents> {
        const resp = await gmxhr(url, {
            responseType: 'blob',
            headers: headers,
        });
        const fetchedUrl = new URL(resp.finalUrl);
        const wasRedirected = resp.finalUrl !== url.href;

        if (wasRedirected) {
            LOGGER.warn(`Followed redirect of ${url.href} -> ${resp.finalUrl} while fetching image contents`);
        }

        const rawFile = new File([resp.response], fileName);

        return new Promise((resolve, reject) => {
            MB.CoverArt.validate_file(rawFile)
                .fail(() => {
                    reject(new Error(`${fileName} has an unsupported file type`));
                })
                .done((mimeType) => {
                    resolve({
                        requestedUrl: url,
                        fetchedUrl,
                        wasRedirected,
                        file: new File(
                            [resp.response],
                            this.#createUniqueFilename(fileName, mimeType),
                            { type: mimeType }),
                    });
                });
        });
    }

    #urlAlreadyAdded(url: URL): boolean {
        return this.#doneImages.has(url.href);
    }
}
