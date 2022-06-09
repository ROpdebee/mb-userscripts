import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { filterNonNull } from '@lib/util/array';
import { assert } from '@lib/util/assert';
import { safeParseJSON } from '@lib/util/json';
import { urlBasename } from '@lib/util/urls';

import type { CoverArt } from './base';
import { ProviderWithTrackImages } from './base';

// Incomplete, only what we need.
interface SCHydration {
    hydratable: string;
}

interface SCHydrationSound extends SCHydration {
    hydratable: 'sound';
    data: {
        artwork_url: string;
    };
}

interface SCHydrationPlaylist extends SCHydration {
    hydratable: 'playlist';
    data: {
        artwork_url: string;
        tracks: Array<{
            artwork_url: string;
        }>;
    };
}

export class SoundcloudProvider extends ProviderWithTrackImages {
    supportedDomains = ['soundcloud.com'];
    favicon = 'https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico';
    name = 'Soundcloud';
    // Soundcloud's URL scheme is a bit complicated, so instead of creating overly
    // complex regular expressions, we'll match URLs programmatically. However,
    // we still need to define this field, even though it'll never be used.
    urlRegex = [];

    static badArtistIDs = new Set([
        'you', 'discover', 'stream', 'upload', 'search',
    ]);
    static badSubpaths = new Set([
        'likes', 'followers', 'following', 'reposts', 'albums', 'tracks',
        'popular-tracks', 'comments', 'sets', 'recommended',
    ]);

    override supportsUrl(url: URL): boolean {
        const [artistId, ...pathParts] = url.pathname
            .trim()
            // Remove leading slash
            .slice(1)
            // Remove trailing slash, if any
            .replace(/\/$/, '')
            .split('/');

        return (!!pathParts.length
            && !SoundcloudProvider.badArtistIDs.has(artistId)
            // artist/likes, artist/track/recommended, artist/sets, ...
            // but not artist/sets/setname!
            && !SoundcloudProvider.badSubpaths.has(urlBasename(url)));
    }

    override extractId(url: URL): string | undefined {
        // We'll use the full path as the ID. This will allow us to distinguish
        // between sets and single tracks, artists, etc.
        // We should've filtered out all bad URLs already.
        // https://soundcloud.com/jonnypalding/sets/talk-21/s-Oeb9wlaKWyl
        // Not sure what the last path component means, but it's required to
        // open that set. Perhaps because it's private?
        return url.pathname.slice(1);  // Remove leading slash
    }

    async findImages(url: URL, onlyFront = false): Promise<CoverArt[]> {
        const pageContent = await this.fetchPage(url);
        const metadata = this.extractMetadataFromJS(pageContent)
            ?.find((data) => ['sound', 'playlist'].includes(data.hydratable));
        if (!metadata) {
            throw new Error('Could not extract metadata from Soundcloud page. The release may have been removed.');
        }

        if (metadata.hydratable === 'sound') {
            return this.extractCoverFromTrackMetadata(metadata as SCHydrationSound);
        } else {
            assert(metadata.hydratable === 'playlist');
            return this.extractCoversFromSetMetadata(metadata as SCHydrationPlaylist, onlyFront);
        }
    }

    private extractMetadataFromJS(pageContent: string): SCHydration[] | undefined {
        const jsonData = pageContent.match(/>window\.__sc_hydration = (.+);<\/script>/)?.[1];
        /* istanbul ignore if: Shouldn't happen */
        if (!jsonData) return;
        return safeParseJSON<SCHydration[]>(jsonData);
    }

    private extractCoverFromTrackMetadata(metadata: SCHydrationSound): CoverArt[] {
        if (!metadata.data.artwork_url) {
            return [];
        }

        return [{
            url: new URL(metadata.data.artwork_url),
            types: [ArtworkTypeIDs.Front],
        }];
    }

    private async extractCoversFromSetMetadata(metadata: SCHydrationPlaylist, onlyFront: boolean): Promise<CoverArt[]> {
        const covers: CoverArt[] = [];
        /* istanbul ignore else: Cannot find case */
        if (metadata.data.artwork_url) {
            covers.push({
                url: new URL(metadata.data.artwork_url),
                types: [ArtworkTypeIDs.Front],
            });
        }

        // Don't bother extracting track covers if they won't be used anyway
        if (onlyFront) return covers;

        const trackCovers = filterNonNull(metadata.data.tracks
            .flatMap((track, trackNumber) => {
                if (!track.artwork_url) return;
                return {
                    url: track.artwork_url,
                    trackNumber: (trackNumber + 1).toString(),
                };
            }));
        const mergedTrackCovers = await this.mergeTrackImages(trackCovers, metadata.data.artwork_url, true);

        return [...covers, ...mergedTrackCovers];
    }
}
