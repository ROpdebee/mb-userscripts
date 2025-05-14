import type { Promisable } from 'type-fest';

import type { RequestOptions, TextResponse } from '@lib/util/request';
import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { collatedSort, deduplicate, filterNonNull, groupBy, splitChunks } from '@lib/util/array';
import { assertDefined } from '@lib/util/assert';
import { blobToDigest } from '@lib/util/blob';
import { parseDOM, qs } from '@lib/util/dom';
import { request } from '@lib/util/request';

import type { CoverArt, FetchedImage } from '../types';

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
    public abstract readonly supportedDomains: string[];
    /**
     * URL of the provider's favicon, for use in import buttons.
     */
    public abstract get favicon(): Promise<string> | string;
    /**
     * Provider name, used in import buttons.
     */
    public abstract readonly name: string;

    /**
     * Regular expression used to both match supported URLs and extract ID
     * from the URL. Matched against the full URL.
     */
    protected abstract readonly urlRegex: RegExp | RegExp[];

    /**
     * Set to false to disallow placing provider buttons on cover art pages.
     */
    public readonly allowButtons: boolean = true;

    /**
     * Find the provider's images.
     *
     * @param      {string}     url           The URL to the release. Guaranteed to have passed validation.
     * @return     {Promise<CoverArt[]>}  List of cover arts that should be imported.
     */
    public abstract findImages(url: URL): Promisable<CoverArt[]>;

    /**
     * Postprocess a fetched image. By default, does nothing, however,
     * subclasses can override this to e.g. filter out an image after it has
     * been fetched.
     */
    public postprocessImage(image: FetchedImage): Promisable<FetchedImage | null> {
        return Promise.resolve(image);
    }

    /**
     * Returns a clean version of the given URL.
     * This version should be used to match against `urlRegex`.
     */
    protected cleanUrl(url: URL): string {
        return url.host + url.pathname;
    }

    /**
     * Check whether the provider supports the given URL.
     *
     * @param      {URL}    url     The provider URL.
     * @return     {boolean}  Whether images can be extracted for this URL.
     */
    public supportsUrl(url: URL): boolean {
        if (Array.isArray(this.urlRegex)) {
            return this.urlRegex.some((regex) => regex.test(this.cleanUrl(url)));
        }
        return this.urlRegex.test(this.cleanUrl(url));
    }

    /**
     * Extract ID from a release URL.
     */
    public extractId(url: URL): string | undefined {
        if (!Array.isArray(this.urlRegex)) {
            return this.urlRegex.exec(this.cleanUrl(url))?.[1];
        }

        return this.urlRegex
            .map((regex) => regex.exec(this.cleanUrl(url))?.[1])
            .find((id) => id !== undefined);
    }

    /**
     * Check whether a redirect is safe, i.e. both URLs point towards the same
     * release.
     */
    protected isSafeRedirect(originalUrl: URL, redirectedUrl: URL): boolean {
        const id = this.extractId(originalUrl);
        return !!id && id === this.extractId(redirectedUrl);
    }

    protected async fetchPage(url: URL, options?: RequestOptions): Promise<string> {
        const response = await request.get(url, {
            // Standardise error messages for 404 pages, otherwise the HTTP error
            // will be shown in the UI.
            httpErrorMessages: {
                404: `${this.name} release does not exist`,
                // 410: Gone used on e.g. Juno Download
                410: `${this.name} release does not exist`,
                // 403: Check for Captchas.
                403: (errorResponse) => {
                    // Check for Cloudflare Captcha pages. Solving the challenge manually sets the required cookies.
                    const hasCaptcha = Object.hasOwn(errorResponse, 'text') && (errorResponse as TextResponse).text.includes('<title>Just a moment...</title>');
                    /* istanbul ignore next: Difficult to cover, default behaviour */
                    return hasCaptcha ? 'Cloudflare captcha page detected. Please navigate to the page, solve the challenge, and try again.' : undefined;
                },
            },
            ...options,
        });

        if (response.url === undefined) {
            LOGGER.warn(`Could not detect if ${url.href} caused a redirect`);
        } else if (response.url !== url.href && !this.isSafeRedirect(url, new URL(response.url))) {
            throw new Error(`Refusing to extract images from ${this.name} provider because the original URL redirected to ${response.url}, which may be a different release. If this redirected URL is correct, please retry with ${response.url} directly.`);
        }

        return response.text;
    }
}

export interface ParsedTrackImage {
    url: string;
    trackNumber?: string;
    customCommentPrefix?: [string, string]; // singular, plural
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

    public async findImages(url: URL): Promise<CoverArt[]> {
        const responseDocument = parseDOM(await this.fetchPage(url), url.href);
        if (this.is404Page(responseDocument)) {
            throw new Error(`${this.name} release does not exist`);
        }

        const coverElement = qs<HTMLMetaElement>('head > meta[property="og:image"]', responseDocument);
        return [{
            url: new URL(coverElement.content, url),
            types: [ArtworkTypeIDs.Front],
        }];
    }
}

// All URLs in a URL group are expected to be equivalent.
type URLGroup = string[];

export abstract class ProviderWithTrackImages extends CoverArtProvider {
    // Providers that provide track images which need to be deduplicated. The
    // base class supports deduping by URL and thumbnail content.
    //
    // Some providers, like SoundCloud and sometimes Bandcamp, use unique URLs
    // for each track image, so deduplicating based on URL won't work. They may
    // also not return any headers that uniquely identify the image (like a
    // Digest or an ETag), so we need to load the image and compare its data
    // ourselves. Thankfully, most of these providers generate thumbnails whose
    // payload is identical if the source images are identical, so then we don't
    // have to load the full image.

    protected imageToThumbnailUrl(imageUrl: string): string {
        // To be overridden by subclass if necessary.
        return imageUrl;
    }

    /**
     * Create groups of image URLs.
     *
     * Effectively, this just removes duplicates and creates singleton groups
     * for each URL.
     */
    private groupImageUrls(imageUrls: string[]): URLGroup[] {
        return splitChunks(deduplicate(imageUrls), 1);
    }

    private async groupImageUrlsByContent(imageGroups: URLGroup[]): Promise<URLGroup[]> {
        LOGGER.info('Deduplicating track images by content, this may take a while…');

        // Extend the track image with the track's unique digest. We compute
        // this digest once for each unique URL.
        let numberProcessed = 0;
        const imagesWithDigest = await Promise.all(imageGroups.map(async (group) => {
            const digest = await urlToDigest(group[0]);
            // Cannot use `map`'s index argument since this is asynchronous
            // and might resolve out of order.
            numberProcessed++;
            LOGGER.info(`Deduplicating track images by content, this may take a while… (${numberProcessed}/${imageGroups.length})`);
            return {
                group,
                digest,
            };
        }));
        const groupedByContent = groupBy(imagesWithDigest, (image) => image.digest, (image) => image.group);

        return [...groupedByContent.values()].map((groups) => groups.flat());
    }

    protected async mergeTrackImages(parsedTrackImages: Array<ParsedTrackImage | undefined>, mainUrl: string | undefined, byContent: boolean): Promise<CoverArt[]> {
        const allTrackImages = filterNonNull(parsedTrackImages);
        const urlToTrackImages = groupBy(
            allTrackImages,
            // Convert URLs to consistent URLs already.
            (image) => this.imageToThumbnailUrl(image.url),
            (image) => image,
        );

        let allTrackImageUrls = allTrackImages.map((image) => image.url);
        if (mainUrl) {
            allTrackImageUrls.push(this.imageToThumbnailUrl(mainUrl));
        }
        // Convert URLs to consistent URLs.
        allTrackImageUrls = allTrackImageUrls.map((url) => this.imageToThumbnailUrl(url));

        // First pass: URL only
        let imageGroups = this.groupImageUrls(allTrackImageUrls);

        // Second pass: By content. Two images may have a different URL but the
        // same content. Only bother doing this if there are multiple groups.
        if (byContent && imageGroups.length > 1) {
            imageGroups = await this.groupImageUrlsByContent(imageGroups);
        }

        return createCoverArtForTrackImageGroups(imageGroups, urlToTrackImages, mainUrl);
    }
}

async function urlToDigest(imageUrl: string): Promise<string> {
    const response = await request.get(imageUrl, {
        responseType: 'blob',
    });

    return blobToDigest(response.blob);
}

function createCoverArtForTrackImageGroups(imageGroups: string[][], urlToTrackImages: Map<string, ParsedTrackImage[]>, mainUrl?: string): CoverArt[] {
    // Queue one item for each group of track images. We'll create a comment
    // to indicate which tracks this image belongs to.
    const covers = imageGroups.map((group) => {
        // Don't queue the main URL again.
        if (mainUrl && group.includes(mainUrl)) {
            return null;
        }

        const trackImages = filterNonNull(group.flatMap((url) => {
            const tracks = urlToTrackImages.get(url);
            assertDefined(tracks, 'Could not map URL back to track images!');
            return tracks;
        }));

        // We can just use the first URL as the source, we've already established
        // that all URLs are identical.
        const imageUrl = group[0];
        return {
            url: new URL(imageUrl),
            types: [ArtworkTypeIDs.Track],
            comment: createTrackImageComment(trackImages) || undefined,
        };
    });

    // One of them could be null if a group contained the main image.
    return filterNonNull(covers);
}

function createTrackImageComment(tracks: ParsedTrackImage[]): string {
    const definedTrackNumbers = tracks.filter((track) => Boolean(track.trackNumber));
    if (definedTrackNumbers.length === 0) return '';

    const commentBins = groupBy(definedTrackNumbers, (track) => track.customCommentPrefix?.[0] ?? 'Track', (track) => track);
    const commentChunks = [...commentBins.values()].map((bin) => {
        const prefixes = bin[0].customCommentPrefix ?? ['Track', 'Tracks'];
        const prefix = prefixes[bin.length === 1 ? 0 : 1];
        const trackNumbers = bin.map((track) => track.trackNumber!);
        // Use a collated sort here to make sure we keep numeric ordering.
        // We can't just parse track numbers to actual numbers here, as the
        // tracks may reasonably be numbered as strings (e.g. Vinyl sides)
        return `${prefix} ${collatedSort(trackNumbers).join(', ')}`;
    });

    return commentChunks.join('; ');
}
