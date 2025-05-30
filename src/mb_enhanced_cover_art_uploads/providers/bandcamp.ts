import type { Dimensions } from '@src/mb_caa_dimensions/image-info';
import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { filterNonNull } from '@lib/util/array';
import { assert, assertDefined } from '@lib/util/assert';
import { parseDOM, qs, qsMaybe } from '@lib/util/dom';
import { safeParseJSON } from '@lib/util/json';
import { getImageDimensions } from '@src/mb_caa_dimensions/dimensions';

import type { CoverArt } from '../types';
import { CONFIG } from '../config';
import { ProviderWithTrackImages } from './base';

// JSON type definitions adapted from Kellnerd, released under MIT license.
// https://github.com/kellnerd/harmony/blob/eeafbd6244f358f68debc74cd8a1ee240d49ede0/providers/Bandcamp/json_types.ts
interface TrAlbum {
    art_id: number | null;
    item_type: 'album' | 'track';
    id: number;
    /** Relative URL of the release this track is part of (`null` for standalone tracks), not present for album type. */
    album_url?: string | null;
}

interface PlayerData {
    album_art_id: number;
    tracks: Array<{
        /** ID of the track art. */
        art_id: number | null;
        /** Number of the track (zero-based index). */
        tracknum: number;
    }>;
}

export class BandcampProvider extends ProviderWithTrackImages {
    public readonly supportedDomains = ['*.bandcamp.com'];
    public readonly favicon = 'https://s4.bcbits.com/img/favicon/favicon-32x32.png';
    public readonly name = 'Bandcamp';
    protected readonly urlRegex = /^(.+)\.bandcamp\.com\/(track|album)\/([^/]+)(?:\/|$)/;

    public override extractId(url: URL): string | undefined {
        return this.urlRegex.exec(this.cleanUrl(url))
            ?.slice(1)
            .join('/');
    }

    public async findImages(url: URL): Promise<CoverArt[]> {
        const tralbum = await this.extractAlbumData(url);

        const albumArtId = tralbum.art_id;
        const isAlbum = tralbum.item_type === 'album';

        if (!isAlbum && tralbum.album_url) {
            LOGGER.warn('This Bandcamp track is part of an album rather than a standalone release');
        }

        const covers: CoverArt[] = [];
        if (albumArtId) {
            covers.push({
                url: new URL(this.constructArtUrl(albumArtId)),
                types: [ArtworkTypeIDs.Front],
            });
        } else {
            // Release has no images. May still have track covers though.
            LOGGER.warn('Bandcamp release has no cover');
        }

        const shouldExtractTrackImages = isAlbum && !(await CONFIG.bandcamp.skipTrackImages);
        const trackImages = shouldExtractTrackImages ? await this.findTrackImages(tralbum.id, albumArtId) : [];

        return this.amendSquareThumbnails([...covers, ...trackImages]);
    }

    private constructArtUrl(artId: number): string {
        return `https://f4.bcbits.com/img/a${artId}_10.jpg`;
    }

    private async findTrackImages(albumId: number, frontArtId: number | null): Promise<CoverArt[]> {
        // It's possible to load all track image artwork from the embedded player
        // https://github.com/ROpdebee/mb-userscripts/issues/765
        const playerData = await this.extractPlayerData(albumId);
        if (playerData === undefined) {
            LOGGER.warn('Failed to extract track images: Player data could not be loaded. This may happen when tracks cannot be played (e.g., subscriber-only releases).');
            return [];
        }
        assert(playerData.album_art_id === frontArtId, 'Mismatching front album art between Bandcamp embedded player and release page');

        const trackImages = playerData.tracks.map((track) => {
            if (track.art_id) {
                return {
                    url: this.constructArtUrl(track.art_id),
                    trackNumber: (track.tracknum + 1).toString(),
                };
            }
            return undefined;
        });

        /* istanbul ignore next: Cannot find negative case. */
        const frontArtUrl = frontArtId ? this.constructArtUrl(frontArtId) : undefined;
        const mergedTrackImages = await this.mergeTrackImages(trackImages, frontArtUrl, true);

        if (mergedTrackImages.length > 0) {
            LOGGER.info(`Found ${mergedTrackImages.length} unique track images`);
        } else {
            LOGGER.info('Found no unique track images this time');
        }

        return mergedTrackImages;
    }

    private async extractAlbumData(url: URL): Promise<TrAlbum> {
        const responseDocument = parseDOM(await this.fetchPage(url), url.href);
        const tralbum = safeParseJSON<TrAlbum>(qs<HTMLScriptElement>('[data-tralbum]', responseDocument).dataset.tralbum!);
        assertDefined(tralbum, 'Could not extract Bandcamp tralbum JSON info');
        return tralbum;
    }

    private async extractPlayerData(albumId: number): Promise<PlayerData | undefined> {
        const playerUrl = `https://bandcamp.com/EmbeddedPlayer/album=${albumId}`;
        const responseDocument = parseDOM(await this.fetchPage(new URL(playerUrl)), playerUrl);

        const playerDataJson = qsMaybe<HTMLScriptElement>('[data-player-data]', responseDocument)?.dataset.playerData;
        if (playerDataJson === undefined) {
            LOGGER.warn('Could not extract player data from page');
            return undefined;
        }
        const playerData = safeParseJSON<PlayerData>(playerDataJson);
        /* istanbul ignore next: Should not happen. */
        if (playerData === undefined) {
            LOGGER.warn('Could not parse player data from page');
        }
        return playerData;
    }

    private async amendSquareThumbnails(covers: CoverArt[]): Promise<CoverArt[]> {
        return Promise.all(covers.map(async (cover) => {
            // To figure out the original image's dimensions, we need to fetch
            // the cover itself, preferably the full-sized one. This means that
            // we're actually fetching the cover twice: Here, and in the fetcher
            // after we return our results. However, this isn't a big problem,
            // since to compute dimensions, typically only a very small portion
            // of the data is loaded, and besides, the second time the content
            // is fetched, browsers can reuse the data they already loaded
            // previously.
            let coverDims: Dimensions;
            try {
                coverDims = await getImageDimensions(cover.url.href.replace(/_\d+\.(\w+)$/, '_0.$1'));
            } catch (error) {
                LOGGER.warn(`Could not retrieve image dimensions for ${cover.url}, square thumbnail will not be added`, error);
                return [cover];
            }

            // Prevent zero-division errors
            /* istanbul ignore if: Should not happen */
            if (!coverDims.width || !coverDims.height) {
                return [cover];
            }

            const ratio = coverDims.width / coverDims.height;
            if (0.95 <= ratio && ratio <= 1.05) {
                // Consider anything between ratios of 95% and 105% to still be
                // square.
                return [cover];
            }

            const originalCover: CoverArt = {
                ...cover,
                comment: filterNonNull([cover.comment, 'Bandcamp full-sized cover']).join(' - '),
            };
            const squareCrop: CoverArt = {
                types: cover.types,
                // *_16.jpg URLs are the largest square crop available, always 700x700
                url: new URL(cover.url.href.replace(/_\d+\.(\w+)$/, '_16.$1')),
                comment: filterNonNull([cover.comment, 'Bandcamp square crop']).join(' - '),
                skipMaximisation: true,
            };

            const squareCropFirst = await CONFIG.bandcamp.squareCropFirst.get();
            return squareCropFirst ? [squareCrop, originalCover] : [originalCover, squareCrop];
        })).then((nestedCovers) => nestedCovers.flat());
    }

    protected override imageToThumbnailUrl(imageUrl: string): string {
        // Need to use slightly larger thumbnails, `_7` somehow has differences
        // even though the source images are identical.
        return imageUrl.replace(/_\d+\.(\w+)$/, '_10.$1');
    }
}
