import { HeadMetaPropertyProvider } from './base';

export class DeezerProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['deezer.com']
    favicon = 'https://e-cdns-files.dzcdn.net/cache/images/common/favicon/favicon-16x16.526cde4edf20647be4ee32cdf35c1c13.png'
    name = 'Deezer'
    urlRegex = /(?:\w{2}\/)?album\/(\d+)/
}
