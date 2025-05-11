import { safeParseJSON } from '@lib/util/json';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

interface AllMusicImage {
    // ID of the format (crop, type, etc.). 0 is original
    formatid: number;
    // ID of the image type. Seems like the IDs are always 0 ("unassigned") since
    // Rovi doesn't provide any specific types for music.
    // See http://prod-doc.rovicorp.com/mashery/index.php/ImageTypeIDs
    imageTypeId: number;
    url: string;
}

export class AllMusicProvider extends CoverArtProvider {
    public readonly supportedDomains = ['allmusic.com'];
    public readonly favicon = 'https://fastly-gce.allmusic.com/images/favicon/favicon-32x32.png';
    public readonly name = 'AllMusic';
    protected readonly urlRegex = /album\/release\/.*(mr\d+)(?:\/|$)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        // If the release does not exist, AllMusic redirects to the front page
        // (and sometimes to an album). The redirection check should figure that
        // out and raise an error.
        const page = await this.fetchPage(url);
        // Extracting from embedded JS which contains a JSON array of all images
        const galleryJson = /var imageGallery = (.+);$/m.exec(page)?.[1];
        // istanbul ignore if: Difficult to cover
        if (!galleryJson) {
            throw new Error('Failed to extract AllMusic images from embedded JS');
        }

        const gallery = safeParseJSON<AllMusicImage[]>(galleryJson);
        // istanbul ignore if: Difficult to cover
        if (!gallery) {
            throw new Error('Failed to parse AllMusic JSON gallery data');
        }

        return gallery.map((image) => {
            return {
                // Maximise to original format here already, generates less
                // edit note spam.
                url: new URL(image.url.replace(/&f=\d+$/, '&f=0')),
            };
        });
    }
}
