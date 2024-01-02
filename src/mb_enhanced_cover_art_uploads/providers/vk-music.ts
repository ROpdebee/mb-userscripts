import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { assertHasValue } from '@lib/util/assert';
import { parseDOM, qs } from '@lib/util/dom';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

export class VKMusicProvider extends CoverArtProvider {
    public readonly supportedDomains = ['*.vk.com'];
    public readonly favicon = 'https://vk.com/images/icons/favicons/fav_logo_2x.ico';
    public readonly name = 'VK Music';
    protected readonly urlRegex = [
        /music\/album\/-(\d+_\d+)/,
        /audio\?act=audio_playlist-(\d+_\d+)/,
    ];

    protected override cleanUrl(url: URL): string {
        return url.host + url.pathname + url.search;
    }

    public async findImages(url: URL): Promise<CoverArt[]> {
        const page = parseDOM(await this.fetchPage(url), url.href);
        // AudioPlaylistSnippet: Browser site; audioPlaylist: mobile site.
        const coverElem = qs('.AudioPlaylistSnippet__cover, .audioPlaylist__cover', page);
        const coverUrl = coverElem.getAttribute('style')?.match(/background-image:\s*url\('(.+)'\);/)?.[1];

        assertHasValue(coverUrl, 'Could not extract cover URL');

        return [{
            url: new URL(coverUrl, url),
            types: [ArtworkTypeIDs.Front],
        }];
    }
}
