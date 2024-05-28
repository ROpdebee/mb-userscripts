import { DispatchMap } from '@lib/util/domain-dispatch';

import type { CoverArtProvider } from './base';
import { SevenDigitalProvider } from './7digital';
import { AllMusicProvider } from './allmusic';
import { AmazonProvider } from './amazon';
import { AmazonMusicProvider } from './amazon-music';
import { AppleMusicProvider } from './apple-music';
import { ArchiveProvider } from './archive';
import { AudiomackProvider } from './audiomack';
import { BandcampProvider } from './bandcamp';
import { BeatportProvider } from './beatport';
import { BoothProvider } from './booth';
import { BugsProvider } from './bugs';
import { DatPiffProvider } from './datpiff';
import { DeezerProvider } from './deezer';
import { DiscogsProvider } from './discogs';
import { JamendoProvider } from './jamendo';
import { JunoDownloadProvider } from './junodownload';
import { MelonProvider } from './melon';
import { MonstercatProvider } from './monstercat';
import { CoverArtArchiveProvider, MusicBrainzProvider } from './musicbrainz';
import { MusikSammlerProvider } from './musik-sammler';
import { NetEaseProvider } from './netease';
import { QobuzProvider } from './qobuz';
import { RateYourMusicProvider } from './rateyourmusic';
import { RockipediaProvider } from './rockipedia';
import { SoundCloudProvider } from './soundcloud';
import { SpotifyProvider } from './spotify';
import { TidalProvider } from './tidal';
import { TraxsourceProvider } from './traxsource';
import { VGMdbProvider } from './vgmdb';
import { VKMusicProvider } from './vk-music';
import { YandexMusicProvider } from './yandex-music';
import { YoutubeProvider } from './youtube';
import { YoutubeMusicProvider } from './youtube-music';

const PROVIDER_DISPATCH = new DispatchMap<CoverArtProvider>();

function addProvider(provider: CoverArtProvider): void {
    for (const domain of provider.supportedDomains) {
        PROVIDER_DISPATCH.set(domain, provider);
    }
}

addProvider(new AllMusicProvider());
addProvider(new AmazonProvider());
addProvider(new AmazonMusicProvider());
addProvider(new AppleMusicProvider());
addProvider(new ArchiveProvider());
addProvider(new AudiomackProvider());
addProvider(new BandcampProvider());
addProvider(new BeatportProvider());
addProvider(new BoothProvider());
addProvider(new BugsProvider());
addProvider(new CoverArtArchiveProvider());
addProvider(new DatPiffProvider());
addProvider(new DeezerProvider());
addProvider(new DiscogsProvider());
addProvider(new JamendoProvider());
addProvider(new JunoDownloadProvider());
addProvider(new MelonProvider());
addProvider(new MonstercatProvider());
addProvider(new MusicBrainzProvider());
addProvider(new MusikSammlerProvider());
addProvider(new NetEaseProvider());
addProvider(new QobuzProvider());
addProvider(new RateYourMusicProvider());
addProvider(new RockipediaProvider());
addProvider(new SevenDigitalProvider());
addProvider(new SoundCloudProvider());
addProvider(new SpotifyProvider());
addProvider(new TidalProvider());
addProvider(new TraxsourceProvider());
addProvider(new VGMdbProvider());
addProvider(new VKMusicProvider());
addProvider(new YandexMusicProvider());
addProvider(new YoutubeMusicProvider());
addProvider(new YoutubeProvider());

function extractDomain(url: URL): string {
    return url.hostname.replace(/^www\./, '');
}

export function getProvider(url: URL): CoverArtProvider | undefined {
    const provider = getProviderByDomain(url);
    return provider?.supportsUrl(url) ? provider : undefined;
}

export function getProviderByDomain(url: URL): CoverArtProvider | undefined {
    return PROVIDER_DISPATCH.get(extractDomain(url));
}
