// Common type definitions

import type { ArtworkTypeIDs } from '@lib/MB/cover-art';

export interface CoverArtOptions {
    /**
     * Artwork types to set. May be empty or undefined.
     */
    types?: ArtworkTypeIDs[];
    /**
     * Comment to set. May be empty or undefined.
     */
    comment?: string;
}

/** Cover art provided by a provider. */
export interface CoverArt extends CoverArtOptions {
    /**
     * URL to fetch.
     */
    url: URL;
    /**
     * Whether maximisation should be skipped for this image. If undefined,
     * interpreted as false.
     */
    skipMaximisation?: boolean;
}

/** Cover art that still needs to be checked before it can be fetched, i.e. URLs provided by the user. */
export interface BareCoverArt extends CoverArtOptions {
    url: URL;
}

/** Contents of a fetched image. */
export interface ImageContents {
    requestedUrl: URL;
    fetchedUrl: URL;
    wasRedirected: boolean;
    file: File;
}

interface BaseFetchedImage {
    originalUrl: URL;
    maximisedUrl: URL;
    fetchedUrl: URL;
    wasMaximised: boolean;
    wasRedirected: boolean;
}

/** Image that was fetched, but not yet queued. */
export interface FetchedImage extends BaseFetchedImage {
    content: File;
    // types and comment may be empty or undefined. If undefined, the value
    // will be replaced by the default, if any. If defined but empty, the
    // default will not be used.
    types?: ArtworkTypeIDs[];
    comment?: string; // Can be empty string
}

/** Image that was fetched and queued. */
export type QueuedImage = BaseFetchedImage;

/** Batch of images that were queued, possibly from a provider. */
export interface QueuedImageBatch {
    images: QueuedImage[];
    containerUrl?: URL;
}
