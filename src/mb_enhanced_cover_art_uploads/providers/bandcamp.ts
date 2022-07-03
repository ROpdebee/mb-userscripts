import pThrottle from 'p-throttle';

import type { Dimensions } from '@src/mb_caa_dimensions/ImageInfo';
import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { filterNonNull } from '@lib/util/array';
import { parseDOM, qs, qsa, qsMaybe } from '@lib/util/dom';
import { getImageDimensions } from '@src/mb_caa_dimensions/dimensions';

import type { CoverArt, ParsedTrackImage } from './base';
import { ProviderWithTrackImages } from './base';

export class BandcampProvider extends ProviderWithTrackImages {
    public readonly supportedDomains = ['*.bandcamp.com'];
    public readonly favicon = 'https://s4.bcbits.com/img/favicon/favicon-32x32.png';
    public readonly name = 'Bandcamp';
    protected readonly urlRegex = /^(.+)\.bandcamp\.com\/(track|album)\/([^/]+)(?:\/|$)/;

    public override extractId(url: URL): string | undefined {
        return this.cleanUrl(url)
            .match(this.urlRegex)
            ?.slice(1)
            ?.join('/');
    }

    public async findImages(url: URL, onlyFront = false): Promise<CoverArt[]> {
        const respDocument = parseDOM(await this.fetchPage(url), url.href);
        const albumCoverUrl = this.extractCover(respDocument);

        const covers: CoverArt[] = [];
        if (albumCoverUrl) {
            covers.push({
                url: new URL(albumCoverUrl),
                types: [ArtworkTypeIDs.Front],
            });
        } else {
            // Release has no images. May still have track covers though.
            LOGGER.warn('Bandcamp release has no cover');
        }

        // Don't bother extracting track images if we only need the front cover
        const trackImages = onlyFront ? [] : await this.findTrackImages(respDocument, albumCoverUrl);

        return this.amendSquareThumbnails([...covers, ...trackImages]);
    }

    private extractCover(doc: Document): string | undefined {
        if (qsMaybe('#missing-tralbum-art', doc) !== null) {
            // No images
            return;
        }

        return qs<HTMLAnchorElement>('#tralbumArt > .popupImage', doc).href;
    }

    private async findTrackImages(doc: Document, mainUrl?: string): Promise<CoverArt[]> {
        // Unfortunately it doesn't seem like they can be extracted from the
        // album page itself, so we have to load each of the tracks separately.
        // Deliberately throttling these requests as to not flood Bandcamp and
        // potentially get banned.
        // It appears that they used to have an API which returned all track
        // images in one request, but that API has been locked down :(
        // https://michaelherger.github.io/Bandcamp-API/#/Albums/get_api_album_2_info
        const trackRows = qsa<HTMLTableRowElement>('#track_table .track_row_view', doc);
        if (trackRows.length === 0) return [];
        LOGGER.info('Checking for Bandcamp track images, this may take a few seconds…');

        // Max 5 requests per second
        const throttledFetchPage = pThrottle({
            interval: 1000,
            limit: 5,
        })(this.fetchPage.bind(this));

        // This isn't the most efficient, as it'll have to request all tracks
        // before it even returns the main album cover. Although fixable by
        // e.g. using an async generator, it might lead to issues with users
        // submitting the upload form before all track images are fetched...
        let numProcessed = 0;
        const trackImages = await Promise.all(trackRows
            .map(async (trackRow) => {
                const trackImage = await this.findTrackImage(trackRow, throttledFetchPage);
                // Cannot use `map`'s index argument since this is asynchronous
                // and might resolve out of order.
                numProcessed++;
                LOGGER.info(`Checking for Bandcamp track images, this may take a few seconds… (${numProcessed}/${trackRows.length})`);
                return trackImage;
            }));
        const mergedTrackImages = await this.mergeTrackImages(trackImages, mainUrl, true);
        if (mergedTrackImages.length > 0) {
            LOGGER.info(`Found ${mergedTrackImages.length} unique track images`);
        } else {
            LOGGER.info('Found no unique track images this time');
        }

        return mergedTrackImages;
    }

    private async findTrackImage(trackRow: HTMLTableRowElement, fetchPage: (url: URL) => Promise<string>): Promise<ParsedTrackImage | undefined> {
        // Account for alphabetical track numbers too
        const trackNum = trackRow.getAttribute('rel')?.match(/tracknum=(\w+)/)?.[1];
        const trackUrl = qsMaybe<HTMLAnchorElement>('.title > a', trackRow)?.href;

        /* istanbul ignore if: Cannot immediately find a release where a track is not linked */
        if (!trackUrl) {
            LOGGER.warn(`Could not check track ${trackNum} for track images`);
            return;
        }

        try {
            const trackPage = parseDOM(await fetchPage(new URL(trackUrl)), trackUrl);
            const imageUrl = this.extractCover(trackPage);
            /* istanbul ignore if: Cannot find example */
            if (!imageUrl) {
                // Track has no cover
                return;
            }

            return {
                url: imageUrl,
                trackNumber: trackNum,
            };
        } catch (err) /* istanbul ignore next: Difficult to test */ {
            LOGGER.error(`Could not check track ${trackNum} for track images`, err);
            return;
        }
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
            } catch (err) {
                LOGGER.warn(`Could not retrieve image dimensions for ${cover.url}, square thumbnail will not be added`, err);
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

            // Queue originals before the thumbnail
            return [{
                ...cover,
                comment: filterNonNull([cover.comment, 'Bandcamp full-sized cover']).join(' - '),
            }, {
                types: cover.types,
                // *_16.jpg URLs are the largest square crop available, always 700x700
                url: new URL(cover.url.href.replace(/_\d+\.(\w+)$/, '_16.$1')),
                comment: filterNonNull([cover.comment, 'Bandcamp square crop']).join(' - '),
                skipMaximisation: true,
            }];
        })).then((nestedCovers) => nestedCovers.flat());
    }

    protected override imageToThumbnailUrl(imageUrl: string): string {
        // 150x150
        return imageUrl.replace(/_\d+\.(\w+)$/, '_7.$1');
    }
}
