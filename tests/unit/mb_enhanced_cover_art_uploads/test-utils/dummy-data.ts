// Abstractions to create dummy data

import type { BlobResponse, Response, TextResponse } from '@lib/util/request';
import type { CoverArt, FetchedImage } from '@src/mb_enhanced_cover_art_uploads/types';
import { HTTPResponseError } from '@lib/util/request';

export interface DummyImageData {
    blob?: Blob;
    name?: string;
    mimeType?: string;
}

export function createBlob(): Blob {
    const randomString = Math.random()
        .toString()
        .slice(2, 8);
    return new Blob([randomString]);
}
export function createImageFile(data?: DummyImageData): File {
    data = data ?? {};
    return new File([data.blob ?? createBlob()], data.name ?? 'image', {
        type: data.mimeType ?? 'application/octet-stream',
    });
}

export function createRandomURL(): URL {
    const randomSuffix = Math.random()
        .toString()
        .slice(2, 8);
    return new URL(`https://example.com/${randomSuffix}`);
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

function createResponse(response?: Partial<Response>): Omit<BlobResponse, 'blob'> {
    response = response ?? {};
    return {
        url: response.url ?? createRandomURL().href,
        statusText: response.statusText ?? 'OK',
        status: response.status ?? 200,
        headers: response.headers ?? new Headers(),
        rawResponse: response.rawResponse ?? {},
    };
}

export function createBlobResponse(response?: Partial<BlobResponse>): BlobResponse {
    response = response ?? {};
    return {
        ...createResponse(response),
        blob: response.blob ?? createBlob(),
    };
}

export function createTextResponse(response?: Partial<TextResponse>): TextResponse {
    response = response ?? {};
    return {
        ...createResponse(response),
        text: response.text ?? '',
        json(): unknown {
            return JSON.parse(this.text);
        },
    };
}

export function createHttpError(response?: Partial<TextResponse>): HTTPResponseError {
    const fakeResponse = createTextResponse(response);
    const err = new HTTPResponseError(fakeResponse.url ?? createRandomURL(), fakeResponse);
    // If request module is mocked, the HTTP errors are too, so we need to
    // define these properties manually.
    Object.defineProperties(err, {
        response: { value: fakeResponse },
        statusCode: { value: fakeResponse.status },
        statusText: { value: fakeResponse.statusText },
    });
    return err;
}
