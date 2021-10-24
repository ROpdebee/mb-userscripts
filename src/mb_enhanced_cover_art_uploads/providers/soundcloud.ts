import { filterNonNull } from '@lib/util/array';
import { ArtworkTypeIDs, CoverArtProvider } from './base';
import type { CoverArt, ParsedTrackImage } from './base';
import { safeParseJSON } from '@lib/util/json';
import { assert } from '@lib/util/assert';
import { gmxhr } from '@lib/util/xhr';
import { LOGGER } from '@lib/logging/logger';

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

async function urlToDataUri(url: string): Promise<string> {
    const resp = await gmxhr(url, {
        responseType: 'blob',
    });

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            resolve(reader.result as string);
        });
        reader.addEventListener('abort', reject);
        reader.addEventListener('error', reject);
        reader.readAsDataURL(resp.response);
    });
}


export class SoundcloudProvider extends CoverArtProvider {
    supportedDomains = ['soundcloud.com'];
    favicon = 'https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico';
    name = 'Soundcloud';
    // Soundcloud's URL scheme is a bit complicated, so instead of creating overly
    // complex regular expressions, we'll match URLs programmatically. However,
    // we still need to define this field, even though it'll never be used.
    urlRegex = [];

    static badArtistIDs = new Set([
        'you', 'discover', 'stream', 'upload', 'search'
    ]);
    static badSubpaths = new Set([
        'likes', 'followers', 'following', 'reposts', 'albums', 'tracks',
        'popular-tracks', 'comments', 'sets', 'recommended'
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
            && !SoundcloudProvider.badSubpaths.has(pathParts.at(-1)));
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

    async findImages(url: URL): Promise<CoverArt[]> {
        const pageContent = await this.fetchPage(url);
        const metadata = this.extractMetadataFromJS(pageContent)
            ?.find((data) => ['sound', 'playlist'].includes(data.hydratable));
        if (!metadata) {
            throw new Error('Could not extract metadata from Soundcloud page');
        }

        if (metadata.hydratable === 'sound') {
            return this.#extractCoverFromTrackMetadata(metadata as SCHydrationSound);
        } else {
            assert(metadata.hydratable === 'playlist');
            return this.#extractCoversFromSetMetadata(metadata as SCHydrationPlaylist);
        }
    }

    extractMetadataFromJS(pageContent: string): SCHydration[] | undefined {
        const jsonData = pageContent.match(/>window\.__sc_hydration = (.+);<\/script>/)?.[1];
        /* istanbul ignore if: Shouldn't happen */
        if (!jsonData) return;
        return safeParseJSON<SCHydration[]>(jsonData);
    }

    #extractCoverFromTrackMetadata(metadata: SCHydrationSound): CoverArt[] {
        if (!metadata.data.artwork_url) {
            return [];
        }

        return [{
            url: new URL(metadata.data.artwork_url),
            types: [ArtworkTypeIDs.Front],
        }];
    }

    async #extractCoversFromSetMetadata(metadata: SCHydrationPlaylist): Promise<CoverArt[]> {
        const covers: CoverArt[] = [];
        /* istanbul ignore else: Cannot find case */
        if (metadata.data.artwork_url) {
            covers.push({
                url: new URL(metadata.data.artwork_url),
                types: [ArtworkTypeIDs.Front],
            });
        }

        const trackCovers = filterNonNull(metadata.data.tracks
            .flatMap((track, trackNumber) => {
                if (!track.artwork_url) return;
                return {
                    url: track.artwork_url,
                    trackNumber: (trackNumber + 1).toString(),
                };
            }));
        const mergedTrackCovers = await this.mergeTrackImagesByData(trackCovers, metadata.data.artwork_url);

        return covers.concat(mergedTrackCovers);
    }

    async mergeTrackImagesByData(trackCovers: ParsedTrackImage[], mainCover: string): Promise<CoverArt[]> {
        // Soundcloud uses unique URLs for each track image, so deduplicating
        // based on URL, as is done in the base class, won't work. Because
        // Soundcloud is awful, they also don't return any headers that uniquely
        // identify the image (like a Digest or an ETag). So... We have to load
        // the image and compare its data ourselves. Thankfully, it seems like
        // the thumbnails are identical if the originals are identical, so at
        // least we don't have to load the full image... We'll still grab the
        // "large" thumbnail instead of the small one, because the small one is
        // so tiny that I fear that if there are minute differences, the track
        // image will still have the same small thumbnail. The "large" thumbnail
        // isn't large at all (100x100), so loading it should be fairly quick.

        // We'll reuse the base class implementation by converting the images
        // into data URLs of the thumbnails, then later transforming the data
        // URLs back to the original URLs. Bit of a hack, but it works.
        LOGGER.info('Finding track covers, this may take a while…');
        const mainDataUri = await urlToDataUri(mainCover);
        const dataToOriginal: Map<string, string> = new Map();
        const trackDataUris = await Promise.all(trackCovers.map(async (trackCover) => {
            const dataUri = await urlToDataUri(trackCover.url);
            // This will overwrite any previous URL if the data URI is the same.
            // However, that's not a problem, since we're intentionally deduping
            // images with the same payload anyway. It doesn't matter which URL
            // we use in the end, all of those URLs return the same data.
            dataToOriginal.set(dataUri, trackCover.url);
            return {
                ...trackCover,
                url: dataUri,
            };
        }));

        const mergedDataUris = this.mergeTrackImages(trackDataUris, mainDataUri);
        return mergedDataUris.map((mergedTrackCover) => {
            return {
                ...mergedTrackCover,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                url: new URL(dataToOriginal.get(mergedTrackCover.url.href)!)
            };
        });
    }
}
