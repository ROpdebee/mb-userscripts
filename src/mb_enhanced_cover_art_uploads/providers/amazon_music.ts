import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

export class AmazonMusicProvider extends CoverArtProvider {
    public readonly supportedDomains = [
        'music.amazon.ca', 'music.amazon.de', 'music.amazon.es',
        'music.amazon.fr', 'music.amazon.in', 'music.amazon.it',
        'music.amazon.co.jp', 'music.amazon.co.uk', 'music.amazon.com',
        'music.amazon.com.au', 'music.amazon.com.br', 'music.amazon.com.mx'];

    public readonly favicon = 'https://d5fx445wy2wpk.cloudfront.net/icons/amznMusic_favicon.png';
    public readonly name = 'Amazon Music';
    protected readonly urlRegex = /\/albums\/([A-Za-z\d]{10})(?:\/|$)/;

    public async findImages(): Promise<CoverArt[]> {
        // Amazon made it really difficult to extract images from these sort
        // of pages, so we don't support it for now.
        throw new Error('Amazon Music releases are currently not supported. Please use a different provider or copy the image URL manually.');
    }
}
