import { assertHasValue } from '../../lib/util/assert';
import { gmxhr } from '../../lib/util/xhr';
import type { CoverArt, CoverArtProvider } from './base';

// Not sure if this changes often. If it does, we might have to parse it from the
// JS sources somehow.
const QUERY_SHA256 = '13e41f41a02b02d0a7e855a71e1a02478fd2fb0a2d104b54931d649e1d7c6ecd';

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

        const data = JSON.parse(resp.responseText);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.data.release.images.edges.map((edge: Record<string, any>) => {
            return { url: edge.node.fullsize.sourceUrl };
        });
    }
}
