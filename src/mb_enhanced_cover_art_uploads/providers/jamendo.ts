import { HeadMetaPropertyProvider } from './base';

export class JamendoProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['jamendo.com'];
    favicon = 'https://www.jamendo.com/Client/assets/toolkit/images/icon/favicon-32x32.png';
    name = 'Jamendo';
    urlRegex = /album\/(\d+)\/?/;
}
