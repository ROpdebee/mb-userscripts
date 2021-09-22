import type { CoverArt, CoverArtProvider } from './providers/base';
import { AppleMusicProvider } from './providers/apple_music';
import { DeezerProvider } from './providers/deezer';
import { DiscogsProvider } from './providers/discogs';
import { SpotifyProvider } from './providers/spotify';
import { TidalProvider } from './providers/tidal';
import { BandcampProvider } from './providers/bandcamp';

const PROVIDER_DISPATCH: Map<string, CoverArtProvider> = new Map();

function add_provider(provider: CoverArtProvider): void {
    provider.supportedDomains
        .forEach((domain) => PROVIDER_DISPATCH.set(domain, provider));
}

add_provider(new AppleMusicProvider());
add_provider(new BandcampProvider());
add_provider(new DeezerProvider());
add_provider(new DiscogsProvider());
add_provider(new SpotifyProvider());
add_provider(new TidalProvider());

function extractDomain(url: URL): string {
    let domain = url.hostname;
    // Deal with bandcamp subdomains
    if (domain.endsWith('bandcamp.com')) domain = 'bandcamp.com';
    domain = domain.replace(/^www\./, '');
    return domain;
}

export function getProvider(url: URL): CoverArtProvider | undefined {
    return PROVIDER_DISPATCH.get(extractDomain(url));
}

export function hasProvider(url: URL): boolean {
    return PROVIDER_DISPATCH.has(extractDomain(url));
}

export async function findImages(url: URL): Promise<CoverArt[] | undefined> {
    const provider = getProvider(url);
    if (!provider || !provider.supportsUrl(url)) {
        return;
    }

    return provider.findImages(url);
}
