import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { parseDOM, qs, qsMaybe } from '@lib/util/dom';
import { safeParseJSON } from '@lib/util/json';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

interface TrackInfo {
    // incomplete.
    id: number;
    albumTitle: string;
}

export class FreeMusicArchiveProvider extends CoverArtProvider {
    public readonly supportedDomains = ['freemusicarchive.org'];
    public readonly favicon = 'https://freemusicarchive.org/img/favicon.svg';
    public readonly name = 'Free Music Archive';
    protected readonly urlRegex = /music\/([^/]+(?:\/[^/]+){1,2})(\/?$|\?)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        const responseDocument = parseDOM(await this.fetchPage(url), url.href);
        // .object-cover.hidden is the blurred backdrop, .object-cover without .hidden is the actual cover art.
        const coverImage = qs<HTMLImageElement>('.object-cover:not(.hidden)', responseDocument);

        this.checkStandaloneTracks(responseDocument);

        return [{
            url: new URL(coverImage.src),
            types: [ArtworkTypeIDs.Front],
        }];
    }

    // Check and warn about track pages that are part of a larger album rather
    // than standalone.
    private checkStandaloneTracks(responseDocument: Document): void {
        if (qsMaybe('h1 span', responseDocument)?.textContent?.trim() !== 'Track') {
            // Not a track page.
            return;
        }

        const trackInfoJson = qsMaybe<HTMLDivElement>('[data-track-info]', responseDocument)?.dataset.trackInfo;

        /* istanbul ignore next: Should not happen */
        if (trackInfoJson === undefined) {
            LOGGER.warn('Could not process FMA track information');
            return;
        }

        const trackInfo = safeParseJSON<TrackInfo>(trackInfoJson);
        if (trackInfo !== undefined && trackInfo.albumTitle !== '-') {
            LOGGER.warn('This FMA track is part of an album rather than a standalone release');
        }
    }
}
