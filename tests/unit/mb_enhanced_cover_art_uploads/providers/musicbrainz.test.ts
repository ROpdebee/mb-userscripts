import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { CoverArtArchiveProvider, MusicBrainzProvider } from '@src/mb_enhanced_cover_art_uploads/providers/musicbrainz';
import { setupPolly } from '@test-utils/pollyjs';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

const pollyContext = setupPolly();


describe('musicbrainz provider', () => {
    const provider = new MusicBrainzProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'release URLs',
            url: 'https://musicbrainz.org/release/3a179b58-6be9-476a-b36e-63461c93992f',
            id: '3a179b58-6be9-476a-b36e-63461c93992f',
        }, {
            description: 'release URLs on beta',
            url: 'https://beta.musicbrainz.org/release/3a179b58-6be9-476a-b36e-63461c93992f',
            id: '3a179b58-6be9-476a-b36e-63461c93992f',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://musicbrainz.org/artist/75336c3d-2833-46cb-8037-b835cd7d646d',
        }, {
            description: 'release group URLs',
            url: 'https://beta.musicbrainz.org/release-group/84ed9e3e-10d2-4719-856c-69efe4d965bb',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'release',
            url: 'https://musicbrainz.org/release/8dd38d9f-eae6-47a7-baa8-eaa467042687',
            imageCount: 9,
            expectedImages: [{
                index: 0,
                urlPart: 'mbid-8dd38d9f-eae6-47a7-baa8-eaa467042687-11059679162.jpg',
                types: [ArtworkTypeIDs.Front],
                comment: '',
            }, {
                index: 8,
                urlPart: 'mbid-8dd38d9f-eae6-47a7-baa8-eaa467042687-11059689534.jpg',
                types: [ArtworkTypeIDs.Obi],
                comment: '',
            }],
        }, {
            description: 'release with complex artwork types',
            url: 'https://musicbrainz.org/release/02cd52d7-2d0c-41a4-bf9c-59894bebab8c/cover-art',
            imageCount: 7,
            expectedImages: [{
                index: 5,
                urlPart: '02cd52d7-2d0c-41a4-bf9c-59894bebab8c-37108049319.png',
                types: [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine, ArtworkTypeIDs['Raw/Unedited']],
                comment: '',
            }, {
                index: 6,
                urlPart: '02cd52d7-2d0c-41a4-bf9c-59894bebab8c-37108051684.png',
                types: [ArtworkTypeIDs['Raw/Unedited']],
                comment: '',
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://musicbrainz.org/release/8dd38d9f-eae6-47a7-baa8-eaa46687',
            errorMessage: 'Empty IA metadata, item might not exist',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases, pollyContext });
    });
});

describe('coverartarchive provider', () => {
    const provider = new CoverArtArchiveProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'release URLs',
            url: 'https://coverartarchive.org/release/3a179b58-6be9-476a-b36e-63461c93992f',
            id: '3a179b58-6be9-476a-b36e-63461c93992f',
        }];

        const unsupportedUrls = [{
            description: 'direct image URLs',
            url: 'https://coverartarchive.org/release/e276296d-0e1a-40bb-ac14-7a95f1ca7ff0/31558457789-1200.jpg',
        }, {
            description: 'release group URLs',
            url: 'https://coverartarchive.org/release-group/84ed9e3e-10d2-4719-856c-69efe4d965bb',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls, pollyContext });
    });
});
