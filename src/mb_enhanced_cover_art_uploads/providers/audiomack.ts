import { HeadMetaPropertyProvider } from './base';

export class AudiomackProvider extends HeadMetaPropertyProvider {
    public readonly supportedDomains = ['audiomack.com'];
    public readonly name = 'Audiomack';
    public readonly favicon = 'https://audiomack.com/static/favicon-32x32.png';
    // /song/ URLs may or may not be singles. We'll include song or album in the
    // ID to prevent unsafe redirects from one to the other.
    protected readonly urlRegex = /\.com\/([^/]+\/(?:song|album)\/[^/?#]+)/;
}
