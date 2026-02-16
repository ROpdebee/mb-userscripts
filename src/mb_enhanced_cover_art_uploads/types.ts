// Common type definitions

import type { ArtworkTypeIDs } from '@lib/MB/cover-art';

import type { MaximisedImage } from './images/maximise';
import type { CoverArtProvider } from './providers/base';

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
export interface CoverArtJob extends CoverArtOptions {
    url: URL;
}

/** Contents of a fetched image. */
export interface ImageContents {
    requestedUrl: URL;
    fetchedUrl: URL;
    wasRedirected: boolean;
    file: File;
}

export interface CoverArtMetadata extends Required<CoverArtOptions> {
    originalUrl: URL;
    maximisedUrlCandidates: MaximisedImage[];
}

/** Image that was fetched, but not yet queued. */
export interface FetchedImage {
    originalUrl: URL;
    maximisedUrl: URL;
    wasMaximised: boolean;
    finalUrl: URL;
    wasRedirected: boolean;

    content: File;
}

interface Batch<ImageType> {
    jobUrl: URL;
    provider?: CoverArtProvider;
    images: ImageType[];
}

export type CoverArtBatch = Batch<CoverArtMetadata>;

/** Image that was fetched and queued. */
export type QueuedImage = FetchedImage & Required<CoverArtOptions>;

/** Batch of images that were queued, possibly from a provider. */
export interface QueuedImageBatch extends Batch<QueuedImage> {
    containerUrl?: URL;
};
