import type { TextResponse } from '@lib/util/request';
import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { collatedSort, filterNonNull } from '@lib/util/array';
import { assert } from '@lib/util/assert';
import { parseDOM, qsa } from '@lib/util/dom';
import { safeParseJSON } from '@lib/util/json';
import { HTTPResponseError, request } from '@lib/util/request';
import { urlBasename } from '@lib/util/urls';

import type { CoverArt } from '../types';
import { ProviderWithTrackImages } from './base';

// Incomplete, only what we need.
interface SCHydration {
    hydratable: string;
}

interface SCHydrationSound extends SCHydration {
    hydratable: 'sound';
    data: SCHydrationTrack;
}

interface SCHydrationPlaylist extends SCHydration {
    hydratable: 'playlist';
    data: {
        artwork_url: string;
        tracks: SCHydrationTrack[];
    };
}

interface LazyAPITrack {
    artwork_url: undefined;
    id: number;
    visuals: undefined;
}

interface LoadedAPITrack {
    artwork_url: string;
    id: number;
    visuals?: {
        visuals: Array<{
            visual_url: string;
        }>;
    };
}

type SCHydrationTrack = LazyAPITrack | LoadedAPITrack;

const SC_CLIENT_ID_REGEX = /client_id\s*:\s*"([a-zA-Z\d]{32})"/;
const SC_CLIENT_ID_CACHE_KEY = 'ROpdebee_ECAU_SC_ID';
const SC_HOMEPAGE = 'https://soundcloud.com/';

export class SoundcloudProvider extends ProviderWithTrackImages {
    public readonly supportedDomains = ['soundcloud.com'];
    public readonly favicon = 'https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico';
    public readonly name = 'Soundcloud';
    // Soundcloud's URL scheme is a bit complicated, so instead of creating overly
    // complex regular expressions, we'll match URLs programmatically. However,
    // we still need to define this field, even though it'll never be used.
    protected readonly urlRegex = [];

    private static readonly badArtistIDs = new Set([
        'you', 'discover', 'stream', 'upload', 'search',
    ]);

    private static readonly badSubpaths = new Set([
        'likes', 'followers', 'following', 'reposts', 'albums', 'tracks',
        'popular-tracks', 'comments', 'sets', 'recommended',
    ]);

    private static async loadClientID(): Promise<string> {
        const pageResp = await request.get(SC_HOMEPAGE);
        const pageDom = parseDOM(pageResp.text, SC_HOMEPAGE);

        const scriptUrls = qsa<HTMLScriptElement>('script', pageDom)
            .map((script) => script.src)
            .filter((src) => src.startsWith('https://a-v2.sndcdn.com/assets/'));
        collatedSort(scriptUrls);

        for (const scriptUrl of scriptUrls) {
            const contentResponse = await request.get(scriptUrl);
            const content = contentResponse.text;
            const clientId = content.match(SC_CLIENT_ID_REGEX);

            if (clientId?.[1]) {
                return clientId[1];
            }
        }

        throw new Error('Could not extract Soundcloud Client ID');
    }

    private static async getClientID(): Promise<string> {
        const cachedID = localStorage.getItem(SC_CLIENT_ID_CACHE_KEY);
        if (cachedID) {
            return cachedID;
        }

        const newID = await this.loadClientID();
        localStorage.setItem(SC_CLIENT_ID_CACHE_KEY, newID);
        return newID;
    }

    private static async refreshClientID(): Promise<void> {
        const oldId = await this.getClientID();
        const newId = await this.loadClientID();

        assert(oldId !== newId, 'Attempted to refresh Soundcloud Client ID but retrieved the same one.');
        localStorage.setItem(SC_CLIENT_ID_CACHE_KEY, newId);
    }

    public override supportsUrl(url: URL): boolean {
        const [artistId, ...pathParts] = url.pathname
            .trim()
            // Remove leading slash
            .slice(1)
            // Remove trailing slash, if any
            .replace(/\/$/, '')
            .split('/');

        return (pathParts.length > 0
            && !SoundcloudProvider.badArtistIDs.has(artistId)
            // artist/likes, artist/track/recommended, artist/sets, ...
            // but not artist/sets/setname!
            && !SoundcloudProvider.badSubpaths.has(urlBasename(url)));
    }

    public override extractId(url: URL): string | undefined {
        // We'll use the full path as the ID. This will allow us to distinguish
        // between sets and single tracks, artists, etc.
        // We should've filtered out all bad URLs already.
        // https://soundcloud.com/jonnypalding/sets/talk-21/s-Oeb9wlaKWyl
        // Not sure what the last path component means, but it's required to
        // open that set. Perhaps because it's private?
        return url.pathname.slice(1);  // Remove leading slash
    }

    public async findImages(url: URL, onlyFront = false): Promise<CoverArt[]> {
        const pageContent = await this.fetchPage(url);
        const metadata = this.extractMetadataFromJS(pageContent)
            ?.find((data) => ['sound', 'playlist'].includes(data.hydratable));
        if (!metadata) {
            throw new Error('Could not extract metadata from Soundcloud page. The release may have been removed.');
        }

        if (metadata.hydratable === 'sound') {
            return this.extractCoverFromTrackMetadata(metadata as SCHydrationSound, onlyFront);
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

    private extractCoverFromTrackMetadata(metadata: SCHydrationSound, onlyFront: boolean): CoverArt[] {
        if (!metadata.data.artwork_url) {
            return [];
        }

        const covers = [{
            url: new URL(metadata.data.artwork_url),
            types: [ArtworkTypeIDs.Front],
        }];

        if (!onlyFront) {
            // Check for backdrop images.
            const backdrops = this.extractVisuals(metadata.data);
            covers.push(...backdrops.map((backdropUrl) => ({
                url: new URL(backdropUrl),
                types: [ArtworkTypeIDs.Other],
                comment: 'Soundcloud backdrop',
            })));
        }

        return covers;
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

        // Soundcloud page only contains data for the first 5 tracks at first,
        // we need to load the rest of the tracks.
        const tracks = await this.lazyLoadTracks(metadata.data.tracks);

        const trackCovers = filterNonNull(tracks
            .flatMap((track, trackNumber) => {
                const trackImages = [];
                if (!track.artwork_url) {
                    LOGGER.warn(`Track #${trackNumber} has no track image?`);
                } else {
                    trackImages.push({
                        url: track.artwork_url,
                        trackNumber: (trackNumber + 1).toString(),
                    });
                }

                const visuals = this.extractVisuals(track);
                trackImages.push(...visuals.map((visualUrl) => ({
                    url: visualUrl,
                    trackNumber: (trackNumber + 1).toString(),
                    customCommentPrefix: ['Soundcloud backdrop for track', 'Soundcloud backdrop for tracks'] as [string, string],
                })));

                return trackImages;
            }));
        const mergedTrackCovers = await this.mergeTrackImages(trackCovers, metadata.data.artwork_url, true);

        return [...covers, ...mergedTrackCovers];
    }

    private async lazyLoadTracks(tracks: SCHydrationTrack[]): Promise<SCHydrationTrack[]> {
        const lazyTrackIDs = tracks
            .filter((track) => track.artwork_url === undefined)
            .map((track) => track.id);
        if (lazyTrackIDs.length === 0) return tracks;

        let trackData: SCHydrationTrack[] | undefined;
        try {
            trackData = await this.getTrackData(lazyTrackIDs);
        } catch (err) {
            LOGGER.error('Failed to load Soundcloud track data, some track images may be missed', err);
            // We'll still return the tracks that we couldn't load, otherwise
            // the track indices will be wrong.
            return tracks;
        }

        const trackIdToLoadedTrack = new Map(trackData
            .map((track) => [track.id, track]));

        // Need to take care to retain all tracks and retain their original
        // order, since the order is used to infer track numbers.
        return tracks.map((track) => {
            // Was already loaded, no need in doing it again
            if (track.artwork_url !== undefined) return track;

            const loadedTrack = trackIdToLoadedTrack.get(track.id);
            if (!loadedTrack) {
                LOGGER.error(`Could not load track data for track ${track.id}, some track images may be missed`);
                return track;
            }
            return loadedTrack;
        });
    }

    private async getTrackData(lazyTrackIDs: number[], firstTry = true): Promise<SCHydrationTrack[]> {
        LOGGER.info('Loading Soundcloud track data');
        const clientId = await SoundcloudProvider.getClientID();

        // TODO: Does this work still work if we pass a large list of IDs?
        const params = new URLSearchParams({
            ids: lazyTrackIDs.join(','),
            client_id: clientId,
        });

        let trackDataResponse: TextResponse;
        try {
            trackDataResponse = await request.get(`https://api-v2.soundcloud.com/tracks?${params}`);
        } catch (err) {
            if (!(firstTry && err instanceof HTTPResponseError && err.statusCode === 401)) {
                throw err;
            }

            LOGGER.debug('Attempting to refresh client ID');
            await SoundcloudProvider.refreshClientID();
            return this.getTrackData(lazyTrackIDs, firstTry = false);
        }

        return safeParseJSON<LoadedAPITrack[]>(trackDataResponse.text, 'Failed to parse Soundcloud API response');
    }

    private extractVisuals(track: SCHydrationTrack): string[] {
        return track.visuals?.visuals.map((visual) => visual.visual_url) ?? [];
    }
}
