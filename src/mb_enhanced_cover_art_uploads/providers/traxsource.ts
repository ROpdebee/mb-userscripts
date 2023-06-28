import { HeadMetaPropertyProvider } from './base';

export class TraxsourceProvider extends HeadMetaPropertyProvider {
    public readonly supportedDomains = ['traxsource.com'];
    public readonly favicon = 'https://geo-static.traxsource.com/img/favicon-128x128.png';
    public readonly name = 'Traxsource';
    protected readonly urlRegex = /title\/(\d+)/;
}
