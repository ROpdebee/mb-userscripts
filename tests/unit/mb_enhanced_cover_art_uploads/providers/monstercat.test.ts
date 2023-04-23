import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { MonstercatProvider } from '@src/mb_enhanced_cover_art_uploads/providers/monstercat';
import { itBehavesLike } from '@test-utils/shared_behaviour';

import { findImagesSpec } from './find_images_spec';
import { urlMatchingSpec } from './url_matching_spec';

describe('monstercat provider', () => {
    const provider = new MonstercatProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'release URLs with catalog number',
            url: 'https://www.monstercat.com/release/MCEP270',
            id: 'MCEP270',
        }, {
            desc: 'release URLs with EAN',
            url: 'https://www.monstercat.com/release/742779546449',
            id: '742779546449',
        }, {
            desc: 'player URLs with catalog number',
            url: 'https://player.monstercat.app/release/MCEP270',
            id: 'MCEP270',
        }, {
            desc: 'player URLs with EAN',
            url: 'https://player.monstercat.app/release/742779546449',
            id: '742779546449',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://www.monstercat.com/artist/lewis-thompson',
        }, {
            desc: 'player artist URLs',
            url: 'https://player.monstercat.app/artist/godlands',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release',
            url: 'https://www.monstercat.com/release/MCEP270',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'https://www.monstercat.com/release/MCEP270/cover',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            desc: 'player release',
            url: 'https://player.monstercat.app/release/742779546449',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'https://www.monstercat.com/release/742779546449/cover',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://www.monstercat.com/release/BLABLA270',
        }, {
            desc: 'non-existent player release',
            url: 'https://player.monstercat.app/release/3342342757272',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
