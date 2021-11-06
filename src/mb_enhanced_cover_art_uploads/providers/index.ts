import { DispatchMap } from '@lib/util/domain_dispatch';

import type { CoverArtProvider } from './base';

import { SevenDigitalProvider } from './7digital';
import { AmazonProvider } from './amazon';
import { AmazonMusicProvider } from './amazon_music';
import { AppleMusicProvider } from './apple_music';
import { BandcampProvider } from './bandcamp';
import { BeatportProvider } from './beatport';
import { DeezerProvider } from './deezer';
import { DiscogsProvider } from './discogs';
import { MelonProvider } from './melon';
import { MusicBrainzProvider } from './musicbrainz';
import { MusikSammlerProvider } from './musik_sammler';
import { QobuzProvider } from './qobuz';
import { QubMusiqueProvider } from './qub_musique';
import { SoundcloudProvider } from './soundcloud';
import { SpotifyProvider } from './spotify';
import { TidalProvider } from './tidal';
import { VGMdbProvider } from './vgmdb';

const PROVIDER_DISPATCH = new DispatchMap<CoverArtProvider>();

function addProvider(provider: CoverArtProvider): void {
    provider.supportedDomains
        .forEach((domain) => PROVIDER_DISPATCH.set(domain, provider));
}

addProvider(new AmazonProvider());
addProvider(new AmazonMusicProvider());
addProvider(new AppleMusicProvider());
addProvider(new BandcampProvider());
addProvider(new BeatportProvider());
addProvider(new DeezerProvider());
addProvider(new DiscogsProvider());
addProvider(new MelonProvider());
addProvider(new MusicBrainzProvider());
addProvider(new MusikSammlerProvider());
addProvider(new QobuzProvider());
addProvider(new QubMusiqueProvider());
addProvider(new SevenDigitalProvider());
addProvider(new SoundcloudProvider());
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
