import { parseDOM, qs } from '@lib/util/dom';
import { gmxhr } from '@lib/util/xhr';

export interface CoverArtProvider {
    /**
     * Domains supported by the provider, without www.
     */
    supportedDomains: string[]
    /**
     * URL of the provider's favicon, for use in import buttons.
     */
    favicon: string
    /**
     * Provider name, used in import buttons.
     */
    name: string

    /**
     * Find the provider's images.
     *
     * @param      {string}     url     The URL to the release. Guaranteed to have passed validation.
     * @return     {Promise<CoverArt[]>  List of cover arts that should be imported.
     */
    findImages(url: URL): Promise<CoverArt[]>

    /**
     * Check whether the provider supports the given URL.
     *
     * @param      {URL}    url     The provider URL.
     * @return     {boolean}  Whether images can be extracted for this URL.
     */
    supportsUrl(url: URL): boolean
}

export interface CoverArt {
    /**
     * URL to fetch.
     */
    url: URL
    /**
     * Artwork types to set. May be empty or undefined.
     */
    types?: ArtworkTypeIDs[]
    /**
     * Comment to set. May be empty or undefined.
     */
    comment?: string
}

export enum ArtworkTypeIDs {
    Back = 2,
    Booklet = 3,
    Front = 1,
    Liner = 12,
    Medium = 4,
    Obi = 5,
    Other = 8,
    Poster = 11,
    Raw = 14,  // Raw/Unedited
    Spine = 6,
    Sticker = 10,
    Track = 7,
    Tray = 9,
    Watermark = 13,
}

export abstract class HeadMetaPropertyProvider implements CoverArtProvider {
    // Providers for which the cover art can be retrieved from the head
    // og:image property and maximised using maxurl

    async findImages(url: URL): Promise<CoverArt[]> {
        // Find an image link from a HTML head meta property, maxurl will
        // maximize it for us. Don't want to use the API because of OAuth.
        const resp = await gmxhr(url);
        const respDocument = parseDOM(resp.responseText);
        const coverElmt = qs<HTMLMetaElement>('head > meta[property="og:image"]', respDocument);
        return [{
            url: new URL(coverElmt.content),
            types: [ArtworkTypeIDs.Front],
        }];
    }

    abstract supportsUrl(url: URL): boolean
    abstract supportedDomains: string[]
    abstract favicon: string
    abstract name: string
}
