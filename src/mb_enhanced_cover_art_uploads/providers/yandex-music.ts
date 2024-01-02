import { HeadMetaPropertyProvider } from './base';

export class YandexMusicProvider extends HeadMetaPropertyProvider {
    public readonly supportedDomains = [
        'music.yandex.com', 'music.yandex.ru', 'music.yandex.by',
        'music.yandex.uz', 'music.yandex.kz', // music.yandex.com.tr doesn't exist.
    ];

    public readonly favicon = 'https://music.yandex.com/favicon32.png';
    public readonly name = 'Yandex Music';
    protected readonly urlRegex = /album\/(\d+)/;
}
