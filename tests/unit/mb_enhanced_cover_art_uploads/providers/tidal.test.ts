import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { TidalProvider } from '@src/mb_enhanced_cover_art_uploads/providers/tidal';
import { itBehavesLike } from '@test-utils/shared_behaviour';

import { findImagesSpec } from './find_images_spec';
import { urlMatchingSpec } from './url_matching_spec';

describe('tidal provider', () => {
    const provider = new TidalProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'listen.tidal.com album URLs',
            url: 'https://listen.tidal.com/album/151193605',
            id: '151193605',
        }, {
            desc: 'store.tidal.com album URLs with country',
            url: 'https://store.tidal.com/us/album/175441105',
            id: '175441105',
        }, {
            desc: 'store.tidal.com album URLs without country',
            url: 'https://store.tidal.com/album/175441105',
            id: '175441105',
        }, {
            desc: 'tidal.com browse album URLs',
            url: 'https://tidal.com/browse/album/175441105',
            id: '175441105',
        }, {
            desc: 'tidal.com album URLs',
            url: 'https://tidal.com/album/175441105',
            id: '175441105',
        }];

        const unsupportedUrls = [{
            desc: 'tidal.com track URLs',
            url: 'https://tidal.com/browse/track/175441106',
        }, {
            desc: 'tidal.com artist URLs',
            url: 'https://tidal.com/browse/artist/23736224',
        }, {
            desc: 'listen.tidal.com artist URLs',
            url: 'https://listen.tidal.com/artist/10789784',
        }, {
            desc: 'store.tidal.com artist URLs',
            url: 'https://store.tidal.com/nl/artist/23736224',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const expectedResult = {
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '/images/c61b75cd/0159/4b63/9f25/27b3d6cedd63/origin.jpg',
                types: [ArtworkTypeIDs.Front],
            }],
        };

        const extractionCases = [{
            desc: 'listen.tidal.com release',
            url: 'https://listen.tidal.com/album/175441105',
            ...expectedResult,
        }, {
            desc: 'store.tidal.com release',
            url: 'https://store.tidal.com/album/175441105',
            ...expectedResult,
        }, {
            desc: 'tidal.com release',
            url: 'https://tidal.com/album/175441105',
            ...expectedResult,
        }, {
            desc: 'release with video cover',
            url: 'https://listen.tidal.com/album/171032759',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '/images/72c1e674/70ca/4442/a530/0f00b0ef354a/origin.jpg',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://listen.tidal.com/album/1',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
