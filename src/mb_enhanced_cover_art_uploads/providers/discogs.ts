import { assertHasValue } from '../../lib/util/assert';
import { gmxhr } from '../../lib/util/xhr';
import type { CoverArt, CoverArtProvider } from './base';

// Not sure if this changes often. If it does, we might have to parse it from the
// JS sources somehow.
const QUERY_SHA256 = '13e41f41a02b02d0a7e855a71e1a02478fd2fb0a2d104b54931d649e1d7c6ecd';

interface ImageInfo {
    sourceUrl: string
    webpUrl: string
    width: number
    height: number
    __typename: 'ImageInfo'
}

interface DiscogsImages {
    data: {
        release: {
            __typename: 'Release'
            discogsId: number
            images: {
                __typename: 'ImagesConnection'
                totalCount: number
                edges: Array<{
                    __typename: 'ImagesEdge'
                    node: {
                        __typename: 'Image'
                        id: string
                        fullsize: ImageInfo
                        thumbnail: ImageInfo
                    }
                }>
            }
        }
    }
}

export class DiscogsProvider implements CoverArtProvider {
    supportedDomains = ['discogs.com']
    favicon = 'https://catalog-assets.discogs.com/e95f0cd9.png'
    name = 'Discogs'

    supportsUrl(url: URL): boolean {
        return /\/release\/\d+/.test(url.pathname);
    }

    async findImages(url: string): Promise<CoverArt[]> {
        // Loading the full HTML and parsing the metadata JSON embedded within
        // it.
        const releaseId = url.match(/\/release\/(\d+)/)?.[1];
        assertHasValue(releaseId);

        const data = await DiscogsProvider.getReleaseImages(releaseId);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.data.release.images.edges.map((edge: Record<string, any>) => {
            return { url: edge.node.fullsize.sourceUrl };
        });
    }

    static async getReleaseImages(releaseId: string): Promise<DiscogsImages> {
        const variables = encodeURIComponent(JSON.stringify({
            discogsId: parseInt(releaseId),
            count: 500,
        }));
        const extensions = encodeURIComponent(JSON.stringify({
            persistedQuery: {
                version: 1,
                sha256Hash: QUERY_SHA256,
            },
        }));
        const resp = await gmxhr({
            url: `https://www.discogs.com/internal/release-page/api/graphql?operationName=ReleaseAllImages&variables=${variables}&extensions=${extensions}`,
            method: 'GET',
        });

        return JSON.parse(resp.responseText);
    }

    static async maximiseImage(url: string): Promise<string> {
        // Maximising by querying the API for all images of the release, finding
        // the right one, and extracting the "full size" (i.e., 600x600 JPEG) URL.
        const imageName = url.match(/discogs-images\/(R-.+)$/)?.[1];
        const releaseId = imageName?.match(/^R-(\d+)/)?.[1];
        if (!releaseId) return url;
        const releaseData = await this.getReleaseImages(releaseId);
        const matchedImage = releaseData.data.release.images.edges
            .find((img) => img.node.fullsize.sourceUrl.split('/').at(-1) === imageName);
        if (!matchedImage) return url;
        return matchedImage.node.fullsize.sourceUrl;
    }
}
