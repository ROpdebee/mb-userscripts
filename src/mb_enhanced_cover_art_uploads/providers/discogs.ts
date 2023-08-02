import { assert, assertHasValue } from '@lib/util/assert';
import { safeParseJSON } from '@lib/util/json';
import { request } from '@lib/util/request';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

// Not sure if this changes often. If it does, we might have to parse it from the
// JS sources somehow.
const QUERY_SHA256 = '13e41f41a02b02d0a7e855a71e1a02478fd2fb0a2d104b54931d649e1d7c6ecd';

interface ImageInfo {
    sourceUrl: string;
    webpUrl: string;
    width: number;
    height: number;
    __typename: 'ImageInfo';
}

interface DiscogsImages {
    data: {
        release: {
            __typename: 'Release';
            discogsId: number;
            images: {
                __typename: 'ImagesConnection';
                totalCount: number;
                edges: Array<{
                    __typename: 'ImagesEdge';
                    node: {
                        __typename: 'Image';
                        id: string;
                        fullsize: ImageInfo;
                        thumbnail: ImageInfo;
                    };
                }>;
            };
        };
    };
}

export class DiscogsProvider extends CoverArtProvider {
    public readonly supportedDomains = ['discogs.com'];
    public readonly favicon = 'https://catalog-assets.discogs.com/e95f0cd9.png';
    public readonly name = 'Discogs';
    protected readonly urlRegex = /\/release\/(\d+)/;

    // Map of Discogs IDs to promises which will resolve to API responses.
    // We're using promises so we can make an entry as soon as we create a
    // request to the API, to prevent multiple concurrent requests in async
    // code.
    private static readonly apiResponseCache = new Map<string, Promise<DiscogsImages>>();

    public async findImages(url: URL): Promise<CoverArt[]> {
        // Loading the full HTML and parsing the metadata JSON embedded within
        // it.
        const releaseId = this.extractId(url);
        assertHasValue(releaseId);

        const data = await DiscogsProvider.getReleaseImages(releaseId);

        return data.data.release.images.edges.map((edge) => {
            return { url: new URL(edge.node.fullsize.sourceUrl) };
        });
    }

    private static getReleaseImages(releaseId: string): Promise<DiscogsImages> {
        let respProm = this.apiResponseCache.get(releaseId);
        if (respProm === undefined) {
            respProm = this.actuallyGetReleaseImages(releaseId);
            this.apiResponseCache.set(releaseId, respProm);
        }

        // Evict the promise from the cache if it rejects, so that we can retry
        // later. If we don't evict it, later retries will reuse the failing
        // promise. Only remove if it hasn't been replaced yet. It may have
        // already been replaced by another call, since this is asynchronous code
        respProm.catch(() => {
            if (this.apiResponseCache.get(releaseId) === respProm) {
                this.apiResponseCache.delete(releaseId);
            }
        });

        return respProm;
    }

    private static async actuallyGetReleaseImages(releaseId: string): Promise<DiscogsImages> {
        const graphqlParams = new URLSearchParams({
            operationName: 'ReleaseAllImages',
            variables: JSON.stringify({
                discogsId: parseInt(releaseId),
                count: 500,
            }),
            extensions: JSON.stringify({
                persistedQuery: {
                    version: 1,
                    sha256Hash: QUERY_SHA256,
                },
            }),
        });
        const resp = await request.get(`https://www.discogs.com/internal/release-page/api/graphql?${graphqlParams}`);

        const metadata = safeParseJSON<DiscogsImages>(resp.text, 'Invalid response from Discogs API');
        assertHasValue(metadata.data.release, 'Discogs release does not exist');
        const responseId = metadata.data.release.discogsId.toString();
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        assert(responseId === undefined || responseId === releaseId, `Discogs returned wrong release: Requested ${releaseId}, got ${responseId}`);

        return metadata;
    }

    public static getFilenameFromUrl(url: URL): string {
        // E.g. https://i.discogs.com/aRe2RbRXu0g4PvRjrPgQKb_YmFWO3Y0CYc098S8Q1go/rs:fit/g:sm/q:90/h:600/w:576/czM6Ly9kaXNjb2dz/LWltYWdlcy9SLTk4/OTI5MTItMTU3OTQ1/NjcwNy0yMzIwLmpw/ZWc.jpeg
        // First part is signature, everything following containing colon is param.
        // Last part is base64-encoded S3 URL, split with slashes.
        const urlParts = url.pathname.split('/');
        const firstFilenameIdx = urlParts.slice(2).findIndex((urlPart) => !/^\w+:/.test(urlPart)) + 2;
        const s3Url = urlParts.slice(firstFilenameIdx).join('');

        // Cut off the extension added by Discogs, this leads to decoding errors.
        // eslint-disable-next-line deprecation/deprecation -- Incorrect environment
        const s3UrlDecoded = atob(s3Url.slice(0, s3Url.indexOf('.')));
        return s3UrlDecoded.split('/').pop()!;
    }

    public static async maximiseImage(url: URL): Promise<URL> {
        // Maximising by querying the API for all images of the release, finding
        // the right one, and extracting the "full size" (i.e., 600x600 JPEG) URL.
        const imageName = this.getFilenameFromUrl(url);
        const releaseId = imageName.match(/^R-(\d+)/)?.[1];

        /* istanbul ignore if: Should never happen on valid image */
        if (!releaseId) return url;
        const releaseData = await this.getReleaseImages(releaseId);
        const matchedImage = releaseData.data.release.images.edges
            .find((img) => this.getFilenameFromUrl(new URL(img.node.fullsize.sourceUrl)) === imageName);

        /* istanbul ignore if: Should never happen on valid image */
        if (!matchedImage) return url;
        return new URL(matchedImage.node.fullsize.sourceUrl);
    }
}
