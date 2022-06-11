import { HeadMetaPropertyProvider } from './base';

export class JamendoProvider extends HeadMetaPropertyProvider {
    public readonly supportedDomains = ['jamendo.com'];
    public readonly favicon = 'https://www.jamendo.com/Client/assets/toolkit/images/icon/favicon-32x32.png';
    public readonly name = 'Jamendo';
    protected readonly urlRegex = /album\/(\d+)\/?/;
}
