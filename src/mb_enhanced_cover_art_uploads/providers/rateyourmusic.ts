import { LOGGER } from '@lib/logging/logger';
import { assertHasValue } from '@lib/util/assert';

import type { CoverArt } from '../types';
import { HeadMetaPropertyProvider } from './base';

// The meta property in the HTML <head> provides a 1200px image. Full-resolution
// images can only be accessed on `/buy` pages and require submitting a Captcha.
export class RateYourMusicProvider extends HeadMetaPropertyProvider {
    public readonly supportedDomains = ['rateyourmusic.com'];
    public readonly favicon = 'https://e.snmc.io/2.5/img/sonemic.png';
    public readonly name = 'RateYourMusic';
    // Include release type in the ID to make sure it doesn't redirect a single
    // to an album and vice versa, and also to simplify the URL transformation
    // below. Release type can be "single", "album", "ep", "musicvideo", etc.
    protected readonly urlRegex = /\/release\/(\w+(?:\/[^/]+){2})(?:\/|$)/;

    public override async findImages(url: URL): Promise<CoverArt[]> {
        const releaseId = this.extractId(url);
        assertHasValue(releaseId);
        const coverArtUrl = `https://rateyourmusic.com/release/${releaseId}/coverart/`;

        LOGGER.warn(`Fetched RateYourMusic images are limited to 1200px. Better quality images can be accessed at ${coverArtUrl} but require solving a captcha.`);

        return super.findImages(url);
    }
}
