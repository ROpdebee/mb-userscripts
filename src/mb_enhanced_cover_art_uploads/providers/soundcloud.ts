import type { TextResponse } from '@lib/util/request';
import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { collatedSort, filterNonNull, splitChunks } from '@lib/util/array';
import { assert } from '@lib/util/assert';
import { parseDOM, qsa } from '@lib/util/dom';
import { safeParseJSON } from '@lib/util/json';
import { HTTPResponseError, request } from '@lib/util/request';
import { urlBasename } from '@lib/util/urls';

import type { CoverArt } from '../types';
import { CONFIG } from '../config';
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
const SC_MAX_TRACK_BATCH_SIZE = 50; // Maximum number of track IDs that can be provided to the API.

export class SoundCloudProvider extends ProviderWithTrackImages {
    public readonly supportedDomains = ['soundcloud.com'];
    public readonly favicon = 'https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico';
    public readonly name = 'SoundCloud';
    // SoundCloud's URL scheme is a bit complicated, so instead of creating overly
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
        const pageResponse = await request.get(SC_HOMEPAGE);
        const pageDom = parseDOM(pageResponse.text, SC_HOMEPAGE);

        const scriptUrls = qsa<HTMLScriptElement>('script', pageDom)
            .map((script) => script.src)
            .filter((source) => source.startsWith('https://a-v2.sndcdn.com/assets/'));
        collatedSort(scriptUrls);

        for (const scriptUrl of scriptUrls) {
            const contentResponse = await request.get(scriptUrl);
            const content = contentResponse.text;
            const clientId = SC_CLIENT_ID_REGEX.exec(content);

            if (clientId?.[1]) {
                return clientId[1];
            }
        }

        throw new Error('Could not extract SoundCloud Client ID');
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

        assert(oldId !== newId, 'Attempted to refresh SoundCloud Client ID but retrieved the same one.');
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
            && !SoundCloudProvider.badArtistIDs.has(artistId)
            // artist/likes, artist/track/recommended, artist/sets, ...
            // but not artist/sets/setname!
            && !SoundCloudProvider.badSubpaths.has(urlBasename(url)));
    }

    public override extractId(url: URL): string | undefined {
        // We'll use the full path as the ID. This will allow us to distinguish
        // between sets and single tracks, artists, etc.
        // We should've filtered out all bad URLs already.
        // https://soundcloud.com/jonnypalding/sets/talk-21/s-Oeb9wlaKWyl
        // Not sure what the last path component means, but it's required to
        // open that set. Perhaps because it's private?
        return url.pathname.slice(1); // Remove leading slash
    }

    public async findImages(url: URL): Promise<CoverArt[]> {
        const pageContent = await this.fetchPage(url);
        const metadata = this.extractMetadataFromJS(pageContent)
            ?.find((data) => ['sound', 'playlist'].includes(data.hydratable));
        if (!metadata) {
            throw new Error('Could not extract metadata from SoundCloud page. The release may have been removed.');
        }

        if (metadata.hydratable === 'sound') {
            return this.extractCoverFromTrackMetadata(metadata as SCHydrationSound);
        } else {
            assert(metadata.hydratable === 'playlist');
            return this.extractCoversFromSetMetadata(metadata as SCHydrationPlaylist);
        }
    }

    private extractMetadataFromJS(pageContent: string): SCHydration[] | undefined {
        const jsonData = />window\.__sc_hydration = (.+);<\/script>/.exec(pageContent)?.[1];
        /* istanbul ignore if: Shouldn't happen */
        if (!jsonData) return;
        return safeParseJSON<SCHydration[]>(jsonData);
    }

    private extractCoverFromTrackMetadata(metadata: SCHydrationSound): CoverArt[] {
        if (!metadata.data.artwork_url) {
            return [];
        }

        const covers = [{
            url: new URL(metadata.data.artwork_url),
            types: [ArtworkTypeIDs.Front],
        }];

        // Check for backdrop images. They may be filtered out later if undesired
        // (e.g., because `fetchOnlyFront` is set).
        const backdrops = this.extractVisuals(metadata.data);
        covers.push(...backdrops.map((backdropUrl) => ({
            url: new URL(backdropUrl),
            types: [ArtworkTypeIDs.Other],
            comment: 'SoundCloud backdrop',
        })));

        return covers;
    }

    private async extractCoversFromSetMetadata(metadata: SCHydrationPlaylist): Promise<CoverArt[]> {
        const covers: CoverArt[] = [];
        /* istanbul ignore else: Cannot find case */
        if (metadata.data.artwork_url) {
            covers.push({
                url: new URL(metadata.data.artwork_url),
                types: [ArtworkTypeIDs.Front],
            });
        }

        // Don't bother extracting track covers if they won't be used anyway
        if (await CONFIG.soundcloud.skipTrackImages) return covers;

        // SoundCloud page only contains data for the first 5 tracks at first,
        // we need to load the rest of the tracks.
        const tracks = await this.lazyLoadTracks(metadata.data.tracks);

        const trackCovers = filterNonNull(tracks
            .flatMap((track, trackNumber) => {
                const trackImages = [];
                if (!track.artwork_url) {
                    LOGGER.warn(`Track #${trackNumber + 1} has no track image?`);
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
                    customCommentPrefix: ['SoundCloud backdrop for track', 'SoundCloud backdrop for tracks'] as [string, string],
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
        } catch (error) {
            LOGGER.error('Failed to load SoundCloud track data, some track images may be missed', error);
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

    private async getTrackData(lazyTrackIDs: number[]): Promise<SCHydrationTrack[]> {
        LOGGER.info('Loading SoundCloud track data');
        const batches = splitChunks(lazyTrackIDs, SC_MAX_TRACK_BATCH_SIZE);

        const batchInfos = [];
        // For loop so that all API requests happen in sequence instead of potentially in parallel.
        for (const batch of batches) {
            batchInfos.push(await this.getTrackDataBatch(batch));
        }

        return batchInfos.flat();
    }

    private async getTrackDataBatch(lazyTrackIDs: number[], firstTry = true): Promise<SCHydrationTrack[]> {
        assert(lazyTrackIDs.length <= SC_MAX_TRACK_BATCH_SIZE, 'Too many tracks to process');

        LOGGER.debug('Loading batch of SoundCloud track data');
        const clientId = await SoundCloudProvider.getClientID();

        const parameters = new URLSearchParams({
            ids: lazyTrackIDs.join(','),
            client_id: clientId,
        });

        let trackDataResponse: TextResponse;
        try {
            trackDataResponse = await request.get(`https://api-v2.soundcloud.com/tracks?${parameters}`);
        } catch (error) {
            if (!(firstTry && error instanceof HTTPResponseError && error.statusCode === 401)) {
                throw error;
            }

            LOGGER.debug('Attempting to refresh client ID');
            await SoundCloudProvider.refreshClientID();
            return this.getTrackDataBatch(lazyTrackIDs, false);
        }

        return safeParseJSON<LoadedAPITrack[]>(trackDataResponse.text, 'Failed to parse SoundCloud API response');
    }

    private extractVisuals(track: SCHydrationTrack): string[] {
        return track.visuals?.visuals.map((visual) => visual.visual_url) ?? [];
    }
}
