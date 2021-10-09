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

const PROVIDER_DISPATCH: Map<string, CoverArtProvider> = new Map();

function add_provider(provider: CoverArtProvider): void {
    provider.supportedDomains
        .forEach((domain) => PROVIDER_DISPATCH.set(domain, provider));
}

add_provider(new AmazonProvider());
add_provider(new AmazonMusicProvider());
add_provider(new AppleMusicProvider());
add_provider(new BandcampProvider());
add_provider(new DeezerProvider());
add_provider(new DiscogsProvider());
add_provider(new QobuzProvider());
add_provider(new SpotifyProvider());
add_provider(new TidalProvider());
add_provider(new VGMdbProvider());

function extractDomain(url: URL): string {
    let domain = url.hostname;
    // Deal with bandcamp subdomains
    if (domain.endsWith('bandcamp.com')) domain = 'bandcamp.com';
    domain = domain.replace(/^www\./, '');
    return domain;
}

export function getProvider(url: URL): CoverArtProvider | undefined {
    const provider = PROVIDER_DISPATCH.get(extractDomain(url));
    return provider?.supportsUrl(url) ? provider : undefined;
}

export function hasProvider(url: URL): boolean {
    return !!getProvider(url);
}
