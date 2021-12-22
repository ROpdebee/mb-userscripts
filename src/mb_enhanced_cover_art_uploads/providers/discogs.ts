import { assert, assertHasValue } from '@lib/util/assert';
import { safeParseJSON } from '@lib/util/json';
import { urlBasename } from '@lib/util/urls';
import { gmxhr } from '@lib/util/xhr';
import type { CoverArt } from './base';
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
    supportedDomains = ['discogs.com'];
    favicon = 'https://catalog-assets.discogs.com/e95f0cd9.png';
    name = 'Discogs';
    urlRegex = /\/release\/(\d+)/;

    // Map of Discogs IDs to promises which will resolve to API responses.
    // We're using promises so we can make an entry as soon as we create a
    // request to the API, to prevent multiple concurrent requests in async
    // code.
    static apiResponseCache: Map<string, Promise<DiscogsImages>> = new Map();

    async findImages(url: URL): Promise<CoverArt[]> {
        // Loading the full HTML and parsing the metadata JSON embedded within
        // it.
        const releaseId = this.extractId(url);
        assertHasValue(releaseId);

        const data = await DiscogsProvider.getReleaseImages(releaseId);

        return data.data.release.images.edges.map((edge) => {
            return { url: new URL(edge.node.fullsize.sourceUrl) };
        });
    }

    static getReleaseImages(releaseId: string): Promise<DiscogsImages> {
        let respProm = this.apiResponseCache.get(releaseId);
        if (typeof respProm === 'undefined') {
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

    static async actuallyGetReleaseImages(releaseId: string): Promise<DiscogsImages> {
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
        const resp = await gmxhr(`https://www.discogs.com/internal/release-page/api/graphql?${graphqlParams}`);

        const metadata = safeParseJSON<DiscogsImages>(resp.responseText, 'Invalid response from Discogs API');
        assertHasValue(metadata.data.release, 'Discogs release does not exist');
        const responseId = metadata.data.release.discogsId.toString();
        assert(typeof responseId === 'undefined' || responseId === releaseId, `Discogs returned wrong release: Requested ${releaseId}, got ${responseId}`);

        return metadata;
    }

    static async maximiseImage(url: URL): Promise<URL> {
        // Maximising by querying the API for all images of the release, finding
        // the right one, and extracting the "full size" (i.e., 600x600 JPEG) URL.
        const imageName = url.pathname.match(/discogs-images\/(R-.+)$/)?.[1];
        const releaseId = imageName?.match(/^R-(\d+)/)?.[1];

        /* istanbul ignore if: Should never happen on valid image */
        if (!releaseId) return url;
        const releaseData = await this.getReleaseImages(releaseId);
        const matchedImage = releaseData.data.release.images.edges
            .find((img) => urlBasename(img.node.fullsize.sourceUrl) === imageName);

        /* istanbul ignore if: Should never happen on valid image */
        if (!matchedImage) return url;
        return new URL(matchedImage.node.fullsize.sourceUrl);
    }
}