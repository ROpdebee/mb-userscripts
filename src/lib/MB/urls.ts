import { request } from '@lib/util/request';

import type { ReleaseAdvancedRelationship, URLAdvancedRelationship } from './advanced-relationships';

interface ReleaseMetadataWithARs {
    relations?: Array<ReleaseAdvancedRelationship & URLAdvancedRelationship>;
}

export async function getReleaseUrlARs(releaseId: string): Promise<Array<ReleaseAdvancedRelationship & URLAdvancedRelationship>> {
    // TODO: Interacting with the ws/ endpoint should probably be factored out
    const response = await request.get(`https://musicbrainz.org/ws/2/release/${releaseId}?inc=url-rels&fmt=json`);
    const metadata = await response.json() as ReleaseMetadataWithARs;
    return metadata.relations ?? /* istanbul ignore next: Likely won't happen */[];
}

export async function getURLsForRelease(releaseId: string, options?: { excludeEnded?: boolean; excludeDuplicates?: boolean }): Promise<URL[]> {
    const { excludeEnded, excludeDuplicates } = options ?? {};
    let urlARs = await getReleaseUrlARs(releaseId);
    if (excludeEnded) {
        urlARs = urlARs.filter((ar) => !ar.ended);
    }
    let urls = urlARs.map((ar) => ar.url.resource);
    if (excludeDuplicates) {
        urls = [...new Set(urls)];
    }

    return urls.flatMap((url) => {
        try {
            return [new URL(url)];
        } catch /* istanbul ignore next: Likely won't happen */ {
            // Bad URL
            console.warn(`Found malformed URL linked to release: ${url}`);
            return [];
        }
    });
}

export async function getReleaseIDsForURL(url: string): Promise<string[]> {
    const response = await request.get(`https://musicbrainz.org/ws/2/url?resource=${encodeURIComponent(url)}&inc=release-rels&fmt=json`, {
        throwForStatus: false,
    });
    const metadata = await response.json() as ReleaseMetadataWithARs;
    return metadata.relations?.map((relationship) => relationship.release.id) ?? [];
}
