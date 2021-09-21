import type { CoverArt, CoverArtProvider } from './providers/base';
import { AppleMusicProvider } from './providers/apple_music';
import { DeezerProvider } from './providers/deezer';
import { DiscogsProvider } from './providers/discogs';
import { SpotifyProvider } from './providers/spotify';
import { TidalProvider } from './providers/tidal';

const PROVIDER_DISPATCH: Record<string, CoverArtProvider | undefined> = {};

function add_provider(provider: CoverArtProvider): void {
    provider.supportedDomains
        .forEach((domain) => PROVIDER_DISPATCH[domain] = provider);
}

add_provider(new AppleMusicProvider());
add_provider(new DeezerProvider());
add_provider(new DiscogsProvider());
add_provider(new SpotifyProvider());
add_provider(new TidalProvider());


export async function findImages(url: string): Promise<CoverArt[] | undefined> {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace(/^www\./, '');

    const provider = PROVIDER_DISPATCH[domain];
    if (!provider || !provider.supportsUrl(urlObj)) {
        return;
    }

    return provider.findImages(url);
}
