import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { assert, assertHasValue } from '@lib/util/assert';
import { safeParseJSON } from '@lib/util/json';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';
import { YoutubeProvider } from './youtube';

interface YTMusicPageParameters {
    browseId: string;
    browseEndpointContextSupportedConfigs: string;
}

interface YTMusicBrowseEndpointContextSupportedConfigs {
    browseEndpointContextMusicConfig: {
        pageType: string;
    };
}

interface YTMusicPageData {
    background?: {
        musicThumbnailRenderer: {
            thumbnail: {
                thumbnails: Array<{
                    url: string;
                    width: number;
                    height: number;
                }>;
            };
        };
    };
}

interface YTMusicPageInfo {
    parameters: YTMusicPageParameters;
    data: YTMusicPageData;
}

// Regular expression to parse page parameters and data from page source.
const YOUTUBE_MUSIC_DATA_REGEXP = /initialData\.push\({path: '\\\/browse', params: JSON\.parse\('(.+?)'\), data: '(.+?)'}\);/;

export class YoutubeMusicProvider extends CoverArtProvider {
    public readonly supportedDomains = ['music.youtube.com'];
    public readonly favicon = 'https://music.youtube.com/img/favicon_144.png';
    public readonly name = 'YouTube Music';
    // /browse/ URLs redirect to /playlist?list= URLs, but with different IDs,
    // so we need to support both of them.
    // However, not every /playlist?list= URL is a valid release, some are just
    // playlist.
    // The redirect seems to be implemented in JS, and not server-side, so we
    // do not need to change the `isSafeRedirect` function.
    protected readonly urlRegex = /\/(?:playlist\?list=|browse\/|watch\?v=)(\w+)/;

    protected override cleanUrl(url: URL): string {
        // Album ID is sometimes in the query params, base `cleanUrl` strips those away.
        return super.cleanUrl(url) + url.search;
    }

    public async findImages(url: URL): Promise<CoverArt[]> {
        if (url.pathname === '/watch') {
            // Dispatch to the main YouTube page for the video.
            const ytUrl = new URL(url.toString());
            ytUrl.host = 'www.youtube.com';
            return new YoutubeProvider().findImages(ytUrl);
        }

        const responseDocument = await this.fetchPage(url);
        const pageInfo = this.extractPageInfo(responseDocument);

        this.checkAlbumPage(pageInfo);

        return this.extractImages(pageInfo);
    }

    private extractPageInfo(document_: string): YTMusicPageInfo {
        const documentMatch = YOUTUBE_MUSIC_DATA_REGEXP.exec(document_);
        assertHasValue(documentMatch, 'Failed to extract page information, non-existent release?');

        const [stringParameters, stringData] = documentMatch.slice(1).map((string_) => this.unescapeJson(string_));

        return {
            parameters: safeParseJSON<YTMusicPageParameters>(stringParameters, 'Failed to parse `params` JSON data'),
            data: safeParseJSON<YTMusicPageData>(stringData, 'Failed to parse `data` JSON data'),
        };
    }

    /**
     * Unescape JSON data embedded in YouTube Music source pages.
     *
     * JSON data is escaped with hexadecimal escapes, e.g., \x22 for '{'. This
     * function unescapes it to a string readable by the JSON parser.
     */
    private unescapeJson(string_: string): string {
        // Transform hex escapes to Unicode escapes. These can be parsed by the JSON parser,
        // which we'll use to parse the entire string.
        // See https://stackoverflow.com/a/4209128
        const unicodeEscaped = string_.replaceAll('\\x', '\\u00');
        const stringified = `"${unicodeEscaped}"`;
        return safeParseJSON<string>(stringified, 'Could not decode YT Music JSON data');
    }

    /**
     * Check if the YT Music page is indeed an album, and raise an error otherwise.
     */
    private checkAlbumPage(pageInfo: YTMusicPageInfo): void {
        const config = safeParseJSON<YTMusicBrowseEndpointContextSupportedConfigs>(pageInfo.parameters.browseEndpointContextSupportedConfigs)!;
        const pageType = config.browseEndpointContextMusicConfig.pageType;
        const pageTypeReadable = /_([A-Z]+)$/.exec(pageType)?.[1].toLowerCase() ?? /* istanbul ignore next: Should not happen */ pageType;
        assert(pageType === 'MUSIC_PAGE_TYPE_ALBUM', `Expected an album, got ${pageTypeReadable} instead`);
    }

    private extractImages(pageInfo: YTMusicPageInfo): CoverArt[] {
        assert(pageInfo.data.background !== undefined, 'Failed to extract page information, non-existent release?');
        const thumbnails = pageInfo.data.background.musicThumbnailRenderer.thumbnail.thumbnails;
        const thumbnailUrl = thumbnails[thumbnails.length - 1].url;

        return [{
            url: new URL(thumbnailUrl),
            types: [ArtworkTypeIDs.Front],
        }];
    }
}
