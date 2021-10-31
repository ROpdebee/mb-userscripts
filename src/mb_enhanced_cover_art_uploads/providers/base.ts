import { LOGGER } from '@lib/logging/logger';
import { filterNonNull, groupBy } from '@lib/util/array';
import { assertDefined } from '@lib/util/assert';
import { blobToDigest } from '@lib/util/blob';
import { parseDOM, qs } from '@lib/util/dom';
import { gmxhr } from '@lib/util/xhr';
import type { FetchedImage } from '../fetch';

export abstract class CoverArtProvider {
    /**
     * Domains supported by the provider, without www. Domains such as
     * `*.domain.tld` mean "any subdomain of domain.tld, including domain.tld
     * itself", whereas a bare `domain.tld` only matches `domain.tld`. Wildcard
     * must be the first part of the pattern. In case of multiple providers with
     * the same patterns, more specific takes precedence, e.g. for domain
     * `abc.example.xyz`, a provider with domain pattern `abc.example.xyz` wins
     * from one with `*.example.xyz`. Similarly, for domain `example.com`, a
     * provider with the pattern `example.com` wins from one with `*.example.com`.
     */
    abstract readonly supportedDomains: string[]
    /**
     * URL of the provider's favicon, for use in import buttons.
     */
    abstract get favicon(): string
    /**
     * Provider name, used in import buttons.
     */
    abstract readonly name: string

    /**
     * Regular expression used to both match supported URLs and extract ID
     * from the URL. Matched against the full URL.
     */
    abstract readonly urlRegex: RegExp | RegExp[]

    /**
     * Set to false to disallow placing provider buttons on cover art pages.
     */
    readonly allowButtons: boolean = true;

    /**
     * Find the provider's images.
     *
     * @param      {string}     url           The URL to the release. Guaranteed to have passed validation.
     * @param      {boolean}    onlyFront     True if we'll only enqueue the front image, can be used to skip expensive lookups. Providers can still return all images, they'll be filtered later.
     * @return     {Promise<CoverArt[]>}  List of cover arts that should be imported.
     */
    abstract findImages(url: URL, onlyFront: boolean): Promise<CoverArt[]>

    /**
     * Postprocess the fetched images. By default, does nothing, however,
     * subclasses can override this to e.g. filter out or merge images after
     * they've been fetched.
     */
    postprocessImages(images: Array<[CoverArt, FetchedImage]>): Promise<FetchedImage[]> {
        return Promise.resolve(images.map((res) => res[1]));
    }

    /**
     * Returns a clean version of the given URL.
     * This version should be used to match against `urlRegex`.
     */
    cleanUrl(url: URL): string {
        return url.host + url.pathname;
    }

    /**
     * Check whether the provider supports the given URL.
     *
     * @param      {URL}    url     The provider URL.
     * @return     {boolean}  Whether images can be extracted for this URL.
     */
    supportsUrl(url: URL): boolean {
        if (Array.isArray(this.urlRegex)) {
            return this.urlRegex.some((regex) => regex.test(this.cleanUrl(url)));
        }
        return this.urlRegex.test(this.cleanUrl(url));
    }

    /**
     * Extract ID from a release URL.
     */
    extractId(url: URL): string | undefined {
        if (!Array.isArray(this.urlRegex)) {
            return this.cleanUrl(url).match(this.urlRegex)?.[1];
        }

        return this.urlRegex
            .map((regex) => this.cleanUrl(url).match(regex)?.[1])
            .find((id) => typeof id !== 'undefined');
    }

    /**
     * Check whether a redirect is safe, i.e. both URLs point towards the same
     * release.
     */
    isSafeRedirect(originalUrl: URL, redirectedUrl: URL): boolean {
        const id = this.extractId(originalUrl);
        return !!id && id === this.extractId(redirectedUrl);
    }

    async fetchPage(url: URL): Promise<string> {
        const resp = await gmxhr(url);
        if (resp.finalUrl !== url.href && !this.isSafeRedirect(url, new URL(resp.finalUrl))) {
            throw new Error(`Refusing to extract images from ${this.name} provider because the original URL redirected to ${resp.finalUrl}, which may be a different release. If this redirected URL is correct, please retry with ${resp.finalUrl} directly.`);
        }

        return resp.responseText;
    }
}

export interface CoverArt {
    /**
     * URL to fetch.
     */
    url: URL;
    /**
     * Artwork types to set. May be empty or undefined.
     */
    types?: ArtworkTypeIDs[];
    /**
     * Comment to set. May be empty or undefined.
     */
    comment?: string;
    /**
     * Whether maximisation should be skipped for this image. If undefined,
     * interpreted as false.
     */
    skipMaximisation?: boolean;
}

export interface ParsedTrackImage {
    url: string;
    trackNumber?: string;
}

export enum ArtworkTypeIDs {
    Back = 2,
    Booklet = 3,
    Front = 1,
    Liner = 12,
    Medium = 4,
    Obi = 5,
    Other = 8,
    Poster = 11,
    Raw = 14,  // Raw/Unedited
    Spine = 6,
    Sticker = 10,
    Track = 7,
    Tray = 9,
    Watermark = 13,
}

export abstract class HeadMetaPropertyProvider extends CoverArtProvider {
    // Providers for which the cover art can be retrieved from the head
    // og:image property and maximised using maxurl

    /**
     * Template method to be used by subclasses to check whether the document
     * indicates a missing release. This only needs to be implemented if the
     * provider returns success codes for releases which are 404.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected is404Page(_document: Document): boolean {
        return false;
    }

    async findImages(url: URL): Promise<CoverArt[]> {
        // Find an image link from a HTML head meta property, maxurl will
        // maximize it for us. Don't want to use the API because of OAuth.
        const respDocument = parseDOM(await this.fetchPage(url), url.href);
        if (this.is404Page(respDocument)) {
            throw new Error(this.name + ' release does not exist');
        }

        const coverElmt = qs<HTMLMetaElement>('head > meta[property="og:image"]', respDocument);
        return [{
            url: new URL(coverElmt.content),
            types: [ArtworkTypeIDs.Front],
        }];
    }
}

export abstract class ProviderWithTrackImages extends CoverArtProvider {
    // Providers that provide track images which need to be deduplicated. The
    // base class supports deduping by URL and thumbnail content.
    //
    // Some providers, like Soundcloud and sometimes Bandcamp, use unique URLs
    // for each track image, so deduplicating based on URL won't work. They may
    // also not return any headers that uniquely identify the image (like a
    // Digest or an ETag), so we need to load the image and compare its data
    // ourselves. Thankfully, most of these providers generate thumbnails whose
    // payload is identical if the source images are identical, so then we don't
    // have to load the full image.

    #groupIdenticalImages<T extends { url: string }>(images: T[], mainUrl?: string): Map<string, T[]> {
        const uniqueImages = images.filter((img) => img.url !== mainUrl);
        return groupBy(uniqueImages, (img) => img.url, (img) => img);
    }

    async #urlToDigest(imageUrl: string): Promise<string> {
        const resp = await gmxhr(this.imageToThumbnailUrl(imageUrl), {
            responseType: 'blob',
        });

        return blobToDigest(resp.response);
    }

    override postprocessImages(images: Array<[CoverArt, FetchedImage]>): Promise<FetchedImage[]> {
        // Although some duplicate images may have already been filtered out
        // via thumbnails, there may be some cases where the thumbnail differs
        // even though the full-size image is the same. Merge those now.
        const sameDigest = groupBy(images, (img) => img[1].digest, (img) => img);
        const results: FetchedImage[] = [];

        for (const sameImages of sameDigest.values()) {
            if (sameImages.length <= 1) {
                results.push(sameImages[0][1]);
                continue;
            }

            // If one of them is the front cover, we can just skip all track images
            const frontCover = sameImages.find((pair) => pair[0].types?.includes(ArtworkTypeIDs.Front));
            if (frontCover) {
                results.push(frontCover[1]);
                continue;
            }

            // Need to merge the images. We still have access to all track
            // numbers, so we can create a new comment.
            const allTrackNumbers = sameImages
                .map((pair) => pair[0].comment?.match(/Tracks? ([\d\s,]+)/)?.[1] ?? '')
                .flatMap((commentedTrackNos) => commentedTrackNos.split(',').map((num) => num.trim()))
                .filter((num) => !!num);
            const newComment = (allTrackNumbers.length > 1 ? 'Tracks ' : 'Track ') + allTrackNumbers.sort().join(', ');
            const mainImage = sameImages[0][1];
            results.push({
                ...mainImage,
                comment: mainImage.comment?.replace(/Tracks? [\d\s,]*\d/, newComment) ?? newComment,
            });
        }

        return Promise.resolve(results);
    }

    protected imageToThumbnailUrl(imageUrl: string): string {
        // To be overridden by subclass if necessary.
        return imageUrl;
    }

    protected async mergeTrackImages(trackImages: Array<ParsedTrackImage | undefined>, mainUrl: string | undefined, byContent: boolean): Promise<CoverArt[]> {
        const allTrackImages = filterNonNull(trackImages);
        // First pass: URL only
        const groupedImages = this.#groupIdenticalImages(allTrackImages, mainUrl);

        if (groupedImages.size > 1 && byContent) {
            // Second pass: Thumbnail content
            LOGGER.info('Deduplicating track images by content, this may take a while…');
            const mainDigest = mainUrl ? await this.#urlToDigest(mainUrl) : /* istanbul ignore next: Difficult to cover */ '';
            const dataToOriginal: Map<string, string> = new Map();
            // Convert all track URLs to digests describing their content.
            const trackDigests = await Promise.all([...groupedImages.entries()]
                .map(async ([coverUrl, trackCovers]) => {
                    const digest = await this.#urlToDigest(coverUrl);
                    // This will overwrite any previous entry if the digest is the same.
                    // However, that's not a problem, since we're intentionally deduping
                    // images with the same payload anyway. It doesn't matter which digest
                    // we use in the end, all of those digests return the same data.
                    dataToOriginal.set(digest, coverUrl);
                    return trackCovers.map((cover) => {
                        return {
                            ...cover,
                            url: digest,
                        };
                    });
                }));

            const groupedThumbnails = this.#groupIdenticalImages(trackDigests.flat(), mainDigest);
            // Transform digests back into original URLs
            groupedImages.clear();
            for (const [digest, trackImages] of groupedThumbnails.entries()) {
                const origUrl = dataToOriginal.get(digest);
                assertDefined(origUrl);
                groupedImages.set(origUrl, trackImages);
            }
        }

        const results: CoverArt[] = [];
        groupedImages.forEach((trackImages, imgUrl) => {
            results.push({
                url: new URL(imgUrl),
                types: [ArtworkTypeIDs.Track],
                // Use comment to indicate which tracks this applies to.
                comment: this.#createTrackImageComment(trackImages),
            });
        });

        return results;
    }

    #createTrackImageComment(trackImages: ParsedTrackImage[]): string | undefined {
        const definedTrackNumbers = filterNonNull(trackImages.map((trackImage) => trackImage.trackNumber));
        if (!definedTrackNumbers.length) return;

        const prefix = definedTrackNumbers.length === 1 ? 'Track' : 'Tracks';
        return `${prefix} ${definedTrackNumbers.join(', ')}`;
    }
}
