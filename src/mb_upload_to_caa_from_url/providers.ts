import type { CoverArt, CoverArtProvider } from './providers/base';
import { AppleMusicProvider } from './providers/apple_music';
import { DeezerProvider } from './providers/deezer';
import { DiscogsProvider } from './providers/discogs';
import { SpotifyProvider } from './providers/spotify';
import { TidalProvider } from './providers/tidal';
import { BandcampProvider } from './providers/bandcamp';

const PROVIDER_DISPATCH: Record<string, CoverArtProvider | undefined> = {};

function add_provider(provider: CoverArtProvider): void {
    provider.supportedDomains
        .forEach((domain) => PROVIDER_DISPATCH[domain] = provider);
}

add_provider(new AppleMusicProvider());
add_provider(new BandcampProvider());
add_provider(new DeezerProvider());
add_provider(new DiscogsProvider());
add_provider(new SpotifyProvider());
add_provider(new TidalProvider());

function urlToProvider(url: URL): CoverArtProvider | undefined {
    let domain = url.hostname;
    // Deal with bandcamp subdomains
    if (domain.endsWith('bandcamp.com')) domain = 'bandcamp.com';
    domain = domain.replace(/^www\./, '');

    return PROVIDER_DISPATCH[domain];
}


export async function findImages(url: string): Promise<CoverArt[] | undefined> {
    const urlObj = new URL(url);

    const provider = urlToProvider(urlObj);
    if (!provider || !provider.supportsUrl(urlObj)) {
        return;
    }

    return provider.findImages(url);
}
