/* eslint-disable sonarjs/no-duplicate-string */
import { ConfigProperty } from '@lib/config';

async function _or(...promises: Array<Promise<boolean>>): Promise<boolean> {
    const booleans = await Promise.all(promises);
    return booleans.some(Boolean);
}

export const CONFIG = {
    fetchFrontOnly: new ConfigProperty('fetchFrontOnly', 'Fetch front image only', false),
    skipTrackImagesProperty: new ConfigProperty('skipTrackImages', 'Skip extracting track images', false),

    get skipTrackImages(): Promise<boolean> {
        return _or(CONFIG.fetchFrontOnly.get(), CONFIG.skipTrackImagesProperty.get());
    },

    // Provider-specific configurations
    bandcamp: {
        skipTrackImagesProperty: new ConfigProperty('bandcamp.skipTrackImages', 'Skip extracting track images', false),
        get skipTrackImages(): Promise<boolean> {
            return _or(CONFIG.skipTrackImages, CONFIG.bandcamp.skipTrackImagesProperty.get());
        },
        squareCropFirst: new ConfigProperty('bandcamp.squareCropFirst', 'Place square cropped artwork before original artwork', false),
    },

    soundcloud: {
        skipTrackImagesProperty: new ConfigProperty('soundcloud.skipTrackImages', 'Skip extracting track images', false),
        get skipTrackImages(): Promise<boolean> {
            return _or(CONFIG.skipTrackImages, CONFIG.soundcloud.skipTrackImagesProperty.get());
        },
    },

    vgmdb: {
        keepEntireComment: new ConfigProperty('vgmdb.keepEntireComment', 'Keep entire cover art comment', false),
    },
} as const;
