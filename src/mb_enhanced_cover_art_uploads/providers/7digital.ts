import { HeadMetaPropertyProvider } from './base';
import type { CoverArt } from './base';
import type { FetchedImage } from '../fetch';

// Technically, the cover URL is very predictable from the release ID. However,
// we can also grab it from the <head> element metadata, which is a lot less
// effort, and we get the added benefit of redirect safety.
export class SevenDigitalProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['*.7digital.com'];
    favicon = 'https://css-cdn.7digital.com/static/build/images/favicons/7digital/touch-ipad-retina.png';
    name = '7digital';
    urlRegex = /release\/.*-(\d+)(?:\/|$)/;

    override postprocessImages(images: Array<[CoverArt, FetchedImage]>): Promise<FetchedImage[]> {
        return Promise.resolve(images
            // Filter out images that either are, or were redirected to the cover
            // with ID 0000000016. This is a placeholder image.
            .filter((pair) => !/\/0000000016_\d+/.test(pair[1].fetchedUrl.pathname))
            .map((pair) => pair[1]));
    }
}
