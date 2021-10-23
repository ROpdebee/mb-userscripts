import { DispatchMap } from '@lib/util/domain_dispatch';

import type { CoverArtProvider } from './base';
import { AppleMusicProvider } from './apple_music';
import { DeezerProvider } from './deezer';
import { DiscogsProvider } from './discogs';
import { SpotifyProvider } from './spotify';
import { TidalProvider } from './tidal';
import { BandcampProvider } from './bandcamp';
import { AmazonProvider } from './amazon';
import { AmazonMusicProvider } from './amazon_music';
import { QobuzProvider } from './qobuz';
import { VGMdbProvider } from './vgmdb';
import { QubMusiqueProvider } from './qub_musique';

const PROVIDER_DISPATCH = new DispatchMap<CoverArtProvider>();

function addProvider(provider: CoverArtProvider): void {
    provider.supportedDomains
        .forEach((domain) => PROVIDER_DISPATCH.set(domain, provider));
}

addProvider(new AmazonProvider());
addProvider(new AmazonMusicProvider());
addProvider(new AppleMusicProvider());
addProvider(new BandcampProvider());
addProvider(new DeezerProvider());
addProvider(new DiscogsProvider());
addProvider(new QobuzProvider());
addProvider(new QubMusiqueProvider());
addProvider(new SpotifyProvider());
addProvider(new TidalProvider());
addProvider(new VGMdbProvider());

function extractDomain(url: URL): string {
    return url.hostname.replace(/^www\./, '');
}

export function getProvider(url: URL): CoverArtProvider | undefined {
    const provider = PROVIDER_DISPATCH.get(extractDomain(url));
    return provider?.supportsUrl(url) ? provider : undefined;
}

export function hasProvider(url: URL): boolean {
    return !!getProvider(url);
}
