import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { assertDefined, assertHasValue } from '@lib/util/assert';
import { safeParseJSON } from '@lib/util/json';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

interface AudiomackState {
    // For one of these two, the info property will be null, depending on the
    // URL.
    musicAlbum: {
        info: null | {
            image: string;
        };
    };
    musicSong: {
        info: null | {
            image: string;
        };
    };
}

export class AudiomackProvider extends CoverArtProvider {
    public readonly supportedDomains = ['audiomack.com'];
    public readonly name = 'Audiomack';
    public readonly favicon = 'https://audiomack.com/static/favicon-32x32.png';
    // /song/ URLs may or may not be singles. We'll include song or album in the
    // ID to prevent unsafe redirects from one to the other.
    protected readonly urlRegex = /\.com\/([^/]+\/(?:song|album)\/[^/?#]+)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        const pageContent = await this.fetchPage(url, {
            headers: {
                // Audiomack loads all of the info dynamically when in a browser,
                // and those requests require OAuth.
                // However, it returns all info statically for CLI tools like
                // curl and wget, and for crawlers like Google. Impersonate one
                // so we don't have to deal with OAuth.
                'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            },
        });
        const initialStateText = pageContent.match(/window\.__INITIAL_STATE__ = (.+);\s*$/m)?.[1];
        assertDefined(initialStateText, 'Could not parse Audiomack state from page');
        const initialState = safeParseJSON<AudiomackState>(initialStateText);

        const info = initialState?.musicAlbum.info ?? initialState?.musicSong.info;
        assertHasValue(info, 'Could not retrieve music information from state');

        // Albums can have track images, but those tracks could be singles, so
        // we won't extract them.
        return [{
            url: new URL(info.image),
            types: [ArtworkTypeIDs.Front],
        }];
    }
}
