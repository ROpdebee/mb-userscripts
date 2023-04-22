import { HeadMetaPropertyProvider } from './base';

export class JunoDownloadProvider extends HeadMetaPropertyProvider {
    public readonly supportedDomains = ['junodownload.com'];
    public readonly favicon = 'https://wwwcdn.junodownload.com/14000200/images/digital/icons/favicon-32x32.png';
    public readonly name = 'Juno Download';
    protected readonly urlRegex = /products(?:\/.+)?\/(\d+-\d+)/;
}
