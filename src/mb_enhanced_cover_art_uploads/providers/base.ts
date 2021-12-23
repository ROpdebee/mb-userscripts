import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { collatedSort, filterNonNull, groupBy } from '@lib/util/array';
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
    abstract get favicon(): string | Promise<string>
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
    postprocessImages(images: FetchedImage[]): FetchedImage[] {
        return images;
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

    #groupIdenticalImages<T>(images: T[], getImageUniqueId: (img: T) => string, mainUniqueId?: string): Map<string, T[]> {
        const uniqueImages = images.filter((img) => getImageUniqueId(img) !== mainUniqueId);
        return groupBy(uniqueImages, getImageUniqueId, (img) => img);
    }

    async #urlToDigest(imageUrl: string): Promise<string> {
        const resp = await gmxhr(this.imageToThumbnailUrl(imageUrl), {
            responseType: 'blob',
        });

        return blobToDigest(resp.response as Blob);
    }

    protected imageToThumbnailUrl(imageUrl: string): string {
        // To be overridden by subclass if necessary.
        return imageUrl;
    }

    protected async mergeTrackImages(parsedTrackImages: Array<ParsedTrackImage | undefined>, mainUrl: string | undefined, byContent: boolean): Promise<CoverArt[]> {
        const allTrackImages = filterNonNull(parsedTrackImages);

        // First pass: URL only
        const groupedImages = this.#groupIdenticalImages(allTrackImages, (img) => img.url, mainUrl);

        // Second pass: Thumbnail content
        // We do not need to deduplicate by content if there's only one track
        // image and there's no main URL to compare to.
        if (byContent && groupedImages.size && !(groupedImages.size === 1 && !mainUrl)) {
            LOGGER.info('Deduplicating track images by content, this may take a while…');

            // Compute unique digests of all thumbnail images. We'll use these
            // digests in `#groupIdenticalImages` to group by thumbnail content.
            const mainDigest = mainUrl ? await this.#urlToDigest(mainUrl) : '';

            // Extend the track image with the track's unique digest. We compute
            // this digest once for each unique URL.
            const tracksWithDigest = await Promise.all([...groupedImages.entries()]
                .map(async ([coverUrl, trackImages]) => {
                    const digest = await this.#urlToDigest(coverUrl);
                    return trackImages.map((trackImage) => {
                        return {
                            ...trackImage,
                            digest,
                        };
                    });
                }));

            const groupedThumbnails = this.#groupIdenticalImages(tracksWithDigest.flat(), (trackWithDigest) => trackWithDigest.digest, mainDigest);
            // The previous `groupedImages` map groups images by URL. Overwrite
            // this to group images by thumbnail content. Keys will remain URLs,
            // we'll use the URL of the first image in the group. It doesn't
            // really matter which URL we use, as we've already asserted that
            // the images behind all these URLs in the group are identical.
            groupedImages.clear();
            for (const trackImages of groupedThumbnails.values()) {
                const representativeUrl = trackImages[0].url;
                groupedImages.set(representativeUrl, trackImages);
            }
        }

        // Queue one item for each group of track images. We'll create a comment
        // to indicate which tracks this image belongs to.
        const results: CoverArt[] = [];
        groupedImages.forEach((trackImages, imgUrl) => {
            results.push({
                url: new URL(imgUrl),
                types: [ArtworkTypeIDs.Track],
                comment: this.#createTrackImageComment(trackImages.map((trackImage) => trackImage.trackNumber)) || undefined,
            });
        });

        return results;
    }

    #createTrackImageComment(trackNumbers: Array<string | undefined>): string {
        const definedTrackNumbers = filterNonNull(trackNumbers);
        if (!definedTrackNumbers.length) return '';

        const prefix = definedTrackNumbers.length === 1 ? 'Track' : 'Tracks';
        // Use a collated sort here to make sure we keep numeric ordering.
        // We can't just parse track numbers to actual numbers here, as the
        // tracks may reasonably be numbered as strings (e.g. Vinyl sides)
        return `${prefix} ${collatedSort(definedTrackNumbers).join(', ')}`;
    }
}
