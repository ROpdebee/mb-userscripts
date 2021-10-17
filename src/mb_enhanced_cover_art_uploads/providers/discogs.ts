import { assert, assertHasValue } from '@lib/util/assert';
import { gmxhr } from '@lib/util/xhr';
import type { CoverArt } from './base';
import { CoverArtProvider } from './base';

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

export class DiscogsProvider extends CoverArtProvider {
    supportedDomains = ['discogs.com']
    favicon = 'https://catalog-assets.discogs.com/e95f0cd9.png'
    name = 'Discogs'
    urlRegex = /\/release\/(\d+)/

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
        const resp = await gmxhr(`https://www.discogs.com/internal/release-page/api/graphql?operationName=ReleaseAllImages&variables=${variables}&extensions=${extensions}`);

        const metadata = JSON.parse(resp.responseText) as DiscogsImages;
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
            .find((img) => img.node.fullsize.sourceUrl.split('/').at(-1) === imageName);

        /* istanbul ignore if: Should never happen on valid image */
        if (!matchedImage) return url;
        return new URL(matchedImage.node.fullsize.sourceUrl);
    }
}
