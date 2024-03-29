import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { MonstercatProvider } from '@src/mb_enhanced_cover_art_uploads/providers/monstercat';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('monstercat provider', () => {
    const provider = new MonstercatProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'release URLs with catalog number',
            url: 'https://www.monstercat.com/release/MCEP270',
            id: 'MCEP270',
        }, {
            description: 'release URLs with EAN',
            url: 'https://www.monstercat.com/release/742779546449',
            id: '742779546449',
        }, {
            description: 'player URLs with catalog number',
            url: 'https://player.monstercat.app/release/MCEP270',
            id: 'MCEP270',
        }, {
            description: 'player URLs with EAN',
            url: 'https://player.monstercat.app/release/742779546449',
            id: '742779546449',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://www.monstercat.com/artist/lewis-thompson',
        }, {
            description: 'player artist URLs',
            url: 'https://player.monstercat.app/artist/godlands',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'release',
            url: 'https://www.monstercat.com/release/MCEP270',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'https://www.monstercat.com/release/MCEP270/cover',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            description: 'player release',
            url: 'https://player.monstercat.app/release/742779546449',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'https://www.monstercat.com/release/742779546449/cover',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://www.monstercat.com/release/BLABLA270',
        }, {
            description: 'non-existent player release',
            url: 'https://player.monstercat.app/release/3342342757272',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
