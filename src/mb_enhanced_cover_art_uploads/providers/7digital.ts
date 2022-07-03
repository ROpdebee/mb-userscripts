import { LOGGER } from '@lib/logging/logger';

import type { FetchedImage } from '../fetch';
import { HeadMetaPropertyProvider } from './base';

// Technically, the cover URL is very predictable from the release ID. However,
// we can also grab it from the <head> element metadata, which is a lot less
// effort, and we get the added benefit of redirect safety.
export class SevenDigitalProvider extends HeadMetaPropertyProvider {
    public readonly supportedDomains = ['*.7digital.com'];
    public readonly favicon = 'https://css-cdn.7digital.com/static/build/images/favicons/7digital/touch-ipad-retina.png';
    public readonly name = '7digital';
    protected readonly urlRegex = /release\/.*-(\d+)(?:\/|$)/;

    public override async postprocessImage(image: FetchedImage): Promise<FetchedImage | null> {
        // Filter out images that either are, or were redirected to the cover
        // with ID 0000000016. This is a placeholder image.
        if (/\/0{8}16_\d+/.test(image.fetchedUrl.pathname)) {
            LOGGER.warn(`Skipping "${image.fetchedUrl}" as it matches a placeholder cover`);
            return null;
        }
        return image;
    }
}
