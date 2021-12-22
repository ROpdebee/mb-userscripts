import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { assert, assertHasValue } from '@lib/util/assert';
import { safeParseJSON } from '@lib/util/json';
import { gmxhr } from '@lib/util/xhr';

import type { CoverArt } from './base';
import { CoverArtProvider } from './base';

// Extracted from listen.tidal.com JS. There seem to be at least 10 different
// API keys, I guess they might depend on the user type and/or country?
// Also not sure whether these may change often or not. If they do, we might
// need to switch to extracting them from the JS.
// However, seeing as this key has been present in their JS code for at least
// 3 years already, I doubt this will stop working any time soon.
// https://web.archive.org/web/20181015184006/https://listen.tidal.com/app.9dbb572e8121f8755b73.js
const APP_ID = 'CzET4vdadNUFQ5JU';

// Incomplete and not entirely correct, but good enough for our purposes.
interface AlbumMetadata {
    rows: Array<{
        modules: Array<{
            album: {
                id: number;
                cover: string;
            };
        }>;
    }>;
}

export class TidalProvider extends CoverArtProvider {
    supportedDomains = ['tidal.com', 'listen.tidal.com', 'store.tidal.com'];
    favicon = 'https://listen.tidal.com/favicon.ico';
    name = 'Tidal';
    urlRegex = /\/album\/(\d+)/;

    #countryCode: string | null = null;

    async getCountryCode(): Promise<string> {
        if (!this.#countryCode) {
            const resp = await gmxhr('https://listen.tidal.com/v1/country/context?countryCode=WW&locale=en_US&deviceType=BROWSER', {
                headers: {
                    'x-tidal-token': APP_ID,
                },
            });
            const codeResponse = safeParseJSON<{ countryCode: string }>(resp.responseText, 'Invalid JSON response from Tidal API for country code');
            this.#countryCode = codeResponse.countryCode;
        }
        assertHasValue(this.#countryCode, 'Cannot determine Tidal country');
        return this.#countryCode;
    }

    async getCoverUrlFromMetadata(albumId: string): Promise<string> {
        const countryCode = await this.getCountryCode();
        // Not sure whether it's strictly necessary to ping, but let's impersonate
        // the browser as much as we can to avoid getting accidentally blocked.
        await gmxhr('https://listen.tidal.com/v1/ping');
        const apiUrl = `https://listen.tidal.com/v1/pages/album?albumId=${albumId}&countryCode=${countryCode}&deviceType=BROWSER`;
        const resp = await gmxhr(apiUrl, {
            headers: {
                'x-tidal-token': APP_ID,
            },
        });
        const metadata = safeParseJSON<AlbumMetadata>(resp.responseText, 'Invalid response from Tidal API');
        const albumMetadata = metadata.rows[0]?.modules?.[0]?.album;
        assertHasValue(albumMetadata, 'Tidal API returned no album, 404?');
        assert(albumMetadata.id.toString() === albumId, `Tidal returned wrong release: Requested ${albumId}, got ${albumMetadata.id}`);

        const coverId = albumMetadata.cover;
        assertHasValue(coverId, 'Could not find cover in Tidal metadata');
        return `https://resources.tidal.com/images/${coverId.replace(/-/g, '/')}/origin.jpg`;
    }

    async findImages(url: URL): Promise<CoverArt[]> {
        // Rewrite the URL to point to the main page
        // Both listen.tidal.com and store.tidal.com load metadata through an
        // API. Bare tidal.com returns the image in a <meta> property.
        const albumId = this.extractId(url);
        assertHasValue(albumId);
        const coverUrl = await this.getCoverUrlFromMetadata(albumId);
        return [{
            url: new URL(coverUrl),
            types: [ArtworkTypeIDs.Front],
        }];
    }
}