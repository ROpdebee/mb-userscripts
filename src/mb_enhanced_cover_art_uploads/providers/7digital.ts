import { LOGGER } from '@lib/logging/logger';

import type { FetchedImage } from '../fetch';
import { HeadMetaPropertyProvider } from './base';

// Technically, the cover URL is very predictable from the release ID. However,
// we can also grab it from the <head> element metadata, which is a lot less
// effort, and we get the added benefit of redirect safety.
export class SevenDigitalProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['*.7digital.com'];
    favicon = 'https://css-cdn.7digital.com/static/build/images/favicons/7digital/touch-ipad-retina.png';
    name = '7digital';
    urlRegex = /release\/.*-(\d+)(?:\/|$)/;

    override async postprocessImages(images: FetchedImage[]): Promise<FetchedImage[]> {
        return images
            // Filter out images that either are, or were redirected to the cover
            // with ID 0000000016. This is a placeholder image.
            .filter((image) => {
                if (/\/0{8}16_\d+/.test(image.fetchedUrl.pathname)) {
                    LOGGER.warn(`Skipping "${image.fetchedUrl}" as it matches a placeholder cover`);
                    return false;
                }
                return true;
            });
    }
}
