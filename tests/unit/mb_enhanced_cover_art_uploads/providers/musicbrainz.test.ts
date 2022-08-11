import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { CoverArtArchiveProvider, MusicBrainzProvider } from '@src/mb_enhanced_cover_art_uploads/providers/musicbrainz';
import { setupPolly } from '@test-utils/pollyjs';
import { itBehavesLike } from '@test-utils/shared_behaviour';

import { findImagesSpec } from './find_images_spec';
import { urlMatchingSpec } from './url_matching_spec';

const pollyContext = setupPolly();


describe('musicbrainz provider', () => {
    const provider = new MusicBrainzProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'release URLs',
            url: 'https://musicbrainz.org/release/3a179b58-6be9-476a-b36e-63461c93992f',
            id: '3a179b58-6be9-476a-b36e-63461c93992f',
        }, {
            desc: 'release URLs on beta',
            url: 'https://beta.musicbrainz.org/release/3a179b58-6be9-476a-b36e-63461c93992f',
            id: '3a179b58-6be9-476a-b36e-63461c93992f',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://musicbrainz.org/artist/75336c3d-2833-46cb-8037-b835cd7d646d',
        }, {
            desc: 'release group URLs',
            url: 'https://beta.musicbrainz.org/release-group/84ed9e3e-10d2-4719-856c-69efe4d965bb',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release',
            url: 'https://musicbrainz.org/release/8dd38d9f-eae6-47a7-baa8-eaa467042687',
            numImages: 9,
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
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
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
            desc: 'release URLs',
            url: 'https://coverartarchive.org/release/3a179b58-6be9-476a-b36e-63461c93992f',
            id: '3a179b58-6be9-476a-b36e-63461c93992f',
        }];

        const unsupportedUrls = [{
            desc: 'direct image URLs',
            url: 'https://coverartarchive.org/release/e276296d-0e1a-40bb-ac14-7a95f1ca7ff0/31558457789-1200.jpg',
        }, {
            desc: 'release group URLs',
            url: 'https://coverartarchive.org/release-group/84ed9e3e-10d2-4719-856c-69efe4d965bb',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls, pollyContext });
    });
});
