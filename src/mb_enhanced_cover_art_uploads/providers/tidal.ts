import type { TextResponse } from '@lib/util/request';
import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { assert, assertHasValue } from '@lib/util/assert';
import { safeParseJSON } from '@lib/util/json';
import { request } from '@lib/util/request';

import type { CoverArt } from '../types';
import { CONFIG } from '../config';
import { CoverArtProvider } from './base';

// Extracted from listen.tidal.com JS. There seem to be at least 10 different
// API keys, I guess they might depend on the user type and/or country?
// Also not sure whether these may change often or not. If they do, we might
// need to switch to extracting them from the JS.
// However, seeing as this key has been present in their JS code for at least
// 3 years already, I doubt this will stop working any time soon.
// https://web.archive.org/web/20181015184006/https://listen.tidal.com/app.9dbb572e8121f8755b73.js
const APP_ID = 'CzET4vdadNUFQ5JU';

// Country list from https://xythium.github.io/tidal.html
const COUNTRIES = ['NZ', 'US', 'CA', 'GB', 'NL', 'JP', 'IT', 'DE'];

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
    public readonly supportedDomains = ['tidal.com', 'listen.tidal.com', 'store.tidal.com'];
    public readonly favicon = 'https://listen.tidal.com/favicon.ico';
    public readonly name = 'Tidal';
    protected readonly urlRegex = /\/album\/(\d+)/;

    private countryCode: string | null = null;

    private async getCountryCode(): Promise<string> {
        if (!this.countryCode) {
            const response = await request.get('https://listen.tidal.com/v1/country/context?countryCode=WW&locale=en_US&deviceType=BROWSER', {
                headers: {
                    'x-tidal-token': APP_ID,
                },
            });
            const codeResponse = safeParseJSON<{ countryCode: string }>(response.text, 'Invalid JSON response from Tidal API for country code');
            this.countryCode = codeResponse.countryCode;
        }
        assertHasValue(this.countryCode, 'Cannot determine Tidal country');
        return this.countryCode;
    }

    private async getCoverUrlFromMetadata(albumId: string): Promise<string> {
        const metadata = await this.getMetadata(albumId);
        const albumMetadata = metadata.rows[0]?.modules?.[0]?.album;
        assertHasValue(albumMetadata, 'Tidal API returned no album, 404?');
        assert(albumMetadata.id.toString() === albumId, `Tidal returned wrong release: Requested ${albumId}, got ${albumMetadata.id}`);

        const coverId = albumMetadata.cover;
        assertHasValue(coverId, 'Could not find cover in Tidal metadata');
        return `https://resources.tidal.com/images/${coverId.replaceAll('-', '/')}/origin.jpg`;
    }

    private async getMetadata(albumId: string): Promise<AlbumMetadata> {
        const countryCode = await this.getCountryCode();
        // Not sure whether it's strictly necessary to ping, but let's impersonate
        // the browser as much as we can to avoid getting accidentally blocked.
        await request.get('https://listen.tidal.com/v1/ping');

        const countries = [countryCode];
        if (await CONFIG.tidal.checkAllCountries.get()) {
            countries.push(...COUNTRIES);
        }

        const response = await this.getMetadataFromCountries(albumId, countries);
        return safeParseJSON<AlbumMetadata>(response.text, 'Invalid response from Tidal API');
    }

    private async getMetadataFromCountries(albumId: string, countries: string[]): Promise<TextResponse> {
        let lastError: unknown;

        for (const countryCode of countries) {
            const apiUrl = `https://listen.tidal.com/v1/pages/album?albumId=${albumId}&countryCode=${countryCode}&deviceType=BROWSER`;
            try {
                const response = await request.get(apiUrl, {
                    headers: {
                        'x-tidal-token': APP_ID,
                    },
                    httpErrorMessages: {
                        404: 'Tidal release does not exist or is not available in your country',
                    },
                });
                return response;
            } catch (error) {
                lastError = error;
                LOGGER.warn(`Could not load Tidal album ${albumId} from ${countryCode} API`);
            }
        }

        throw lastError;
    }

    public async findImages(url: URL): Promise<CoverArt[]> {
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
