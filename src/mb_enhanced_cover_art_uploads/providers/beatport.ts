import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { parseDOM, qs } from '@lib/util/dom';
import { safeParseJSON } from '@lib/util/json';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

interface HydratedData {
    props: {
        pageProps: {
            release: {
                image: {
                    uri: string;
                };
            };
        };
    };
}

export class BeatportProvider extends CoverArtProvider {
    public readonly supportedDomains = ['beatport.com'];
    public readonly favicon = 'https://www.beatport.com/images/favicon-48x48.png';
    public readonly name = 'Beatport';
    protected readonly urlRegex = /release\/[^/]+\/(\d+)(?:\/|$)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        const responseDocument = parseDOM(await this.fetchPage(url), url.href);
        const releaseDataText = qs<HTMLScriptElement>('script#__NEXT_DATA__', responseDocument).textContent!;
        const releaseData = safeParseJSON<HydratedData>(releaseDataText, 'Failed to parse Beatport release data');
        const cover = releaseData.props.pageProps.release.image;

        return [{
            url: new URL(cover.uri),
            types: [ArtworkTypeIDs.Front],
        }];
    }
}
