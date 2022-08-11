import { request } from '@lib/util/request';

import type { ReleaseAdvRel, URLAdvRel } from './advanced-relationships';

interface ReleaseMetadataWithARs {
    relations?: Array<URLAdvRel & ReleaseAdvRel>;
}

export async function getReleaseUrlARs(releaseId: string): Promise<Array<URLAdvRel & ReleaseAdvRel>> {
    // TODO: Interacting with the ws/ endpoint should probably be factored out
    const resp = await request.get(`https://musicbrainz.org/ws/2/release/${releaseId}?inc=url-rels&fmt=json`);
    const metadata = await resp.json() as ReleaseMetadataWithARs;
    return metadata.relations ?? /* istanbul ignore next: Likely won't happen */ [];
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
    const resp = await request.get(`https://musicbrainz.org/ws/2/url?resource=${encodeURIComponent(url)}&inc=release-rels&fmt=json`, {
        throwForStatus: false,
    });
    const metadata = await resp.json() as ReleaseMetadataWithARs;
    return metadata.relations?.map((rel) => rel.release.id) ?? [];
}
