import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
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
    public readonly favicon = 'https://geo-pro.beatport.com/static/ea225b5168059ba412818496089481eb.png';
    public readonly name = 'Beatport';
    protected readonly urlRegex = /release\/[^/]+\/(\d+)(?:\/|$)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        const respDocument = parseDOM(await this.fetchPage(url), url.href);
        const releaseDataText = qs<HTMLScriptElement>('script#__NEXT_DATA__', respDocument).textContent!;
        const releaseData = safeParseJSON<HydratedData>(releaseDataText, 'Failed to parse Beatport release data');
        const cover = releaseData.props.pageProps.release.image;

        return [{
            url: new URL(cover.uri),
            types: [ArtworkTypeIDs.Front],
        }];
    }
}
