import { HeadMetaPropertyProvider } from './base';
import type { CoverArt } from './base';
import type { FetchedImage } from '../fetch';

export class DeezerProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['deezer.com'];
    favicon = 'https://e-cdns-files.dzcdn.net/cache/images/common/favicon/favicon-16x16.526cde4edf20647be4ee32cdf35c1c13.png';
    name = 'Deezer';
    urlRegex = /(?:\w{2}\/)?album\/(\d+)/;

    override postprocessImages(images: Array<[CoverArt, FetchedImage]>): Promise<FetchedImage[]> {
        return Promise.resolve(images
            // Filter out placeholder images by SHA-256 sum, since we're not sure
            // whether it's always the same URL. This won't work on old browsers
            // or on HTTP, since we can't calculate SHA-256 there.
            .filter((pair) => pair[1].digest !== '2a16c47b2769e6f8414c3f8e39333b46f9b61a766e1dfccc2b814767d3b662cb')
            .map((pair) => pair[1]));
    }
}
