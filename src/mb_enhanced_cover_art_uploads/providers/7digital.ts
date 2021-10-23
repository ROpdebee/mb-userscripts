import { HeadMetaPropertyProvider } from './base';

// Technically, the cover URL is very predictable from the release ID. However,
// we can also grab it from the <head> element metadata, which is a lot less
// effort, and we get the added benefit of redirect safety.
export class SevenDigitalProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['*.7digital.com'];
    favicon = 'https://css-cdn.7digital.com/static/build/images/favicons/7digital/touch-ipad-retina.png';
    name = '7digital';
    urlRegex = /release\/.*-(\d+)(?:\/|$)/;
}
