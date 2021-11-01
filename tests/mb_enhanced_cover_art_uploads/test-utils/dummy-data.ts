// Abstractions to create dummy data

import type { FetchedImage } from '@src/mb_enhanced_cover_art_uploads/fetch';
import type { CoverArt } from '@src/mb_enhanced_cover_art_uploads/providers/base';

export interface DummyImageData {
    blobContent?: string;
    name?: string;
    mimeType?: string;
}
export function createImageFile(data?: DummyImageData): File {
    data = data ?? {};
    return new File([new Blob([data.blobContent ?? '1234'])], data.name ?? 'image', {
        type: data.mimeType ?? 'application/octet-stream',
    });
}

export function createRandomURL(): URL {
    return new URL('https://example.com/' + Math.random().toString().substring(2, 8));
}

export function createFetchedImage(data?: Partial<FetchedImage>): FetchedImage {
    data = data ?? {};
    const originalUrl = data.originalUrl ?? createRandomURL();
    const maximisedUrl = data.maximisedUrl ?? (data.wasMaximised ? createRandomURL() : originalUrl);
    const fetchedUrl = data.fetchedUrl ?? (data.wasRedirected ? createRandomURL() : maximisedUrl);

    return {
        content: data.content ?? createImageFile(),
        comment: data.comment,
        types: data.types,
        originalUrl,
        maximisedUrl,
        fetchedUrl,
        wasMaximised: maximisedUrl.href !== originalUrl.href,
        wasRedirected: fetchedUrl.href !== maximisedUrl.href,
    };
}

export function createCoverArt(data?: Partial<CoverArt> | string | URL): CoverArt {
    if (data instanceof URL) {
        data = {
            url: data,
        };
    } else if (typeof data === 'string') {
        data = {
            url: new URL(data),
        };
    } else {
        data = data ?? {};
    }

    return {
        url: data.url ?? createRandomURL(),
        types: data.types,
        comment: data.comment,
        skipMaximisation: data.skipMaximisation,
    };
}

export function createFetchedImageFromCoverArt(cover: CoverArt, data?: Partial<FetchedImage>): FetchedImage {
    return createFetchedImage({
        ...data,
        originalUrl: cover.url,
    });
}
