// Abstractions to create dummy data

import type { FetchedImage } from '@src/mb_enhanced_cover_art_uploads/fetch';
import type { CoverArt } from '@src/mb_enhanced_cover_art_uploads/providers/base';

export interface DummyImageData {
    blob?: Blob;
    name?: string;
    mimeType?: string;
}

export function createBlob(): Blob {
    return new Blob([Math.random().toString().slice(2, 8)]);
}
export function createImageFile(data?: DummyImageData): File {
    data = data ?? {};
    return new File([data.blob ?? createBlob()], data.name ?? 'image', {
        type: data.mimeType ?? 'application/octet-stream',
    });
}

export function createRandomURL(): URL {
    return new URL('https://example.com/' + Math.random().toString().slice(2, 8));
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
        ...cover,
        ...data,
        originalUrl: cover.url,
    });
}

export function createXhrResponse(response?: Partial<GM.Response<never>>): GM.Response<never> {
    response = response ?? {};
    return {
        context: response.context,
        finalUrl: response.finalUrl ?? createRandomURL().href,
        statusText: response.statusText ?? 'OK',
        status: response.status ?? 200,
        readyState: response.readyState ?? 4,
        responseHeaders: response.responseHeaders ?? '',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Target is also any
        response: response.response ?? createBlob(),
        responseText: response.responseText ?? '',
        responseXML: response.responseXML ?? false,
    };
}
