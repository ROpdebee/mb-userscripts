import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { ArchiveProvider } from '@src/mb_enhanced_cover_art_uploads/providers/archive';
import { setupPolly } from '@test-utils/pollyjs';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

const pollyContext = setupPolly();

describe('archive provider', () => {
    const provider = new ArchiveProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'item details URLs',
            url: 'https://archive.org/details/20010917Fantmas-MagicStickDetroitMIUSA',
            id: '20010917Fantmas-MagicStickDetroitMIUSA',
        }, {
            description: 'item metadata URLs',
            url: 'https://archive.org/metadata/20010917Fantmas-MagicStickDetroitMIUSA',
            id: '20010917Fantmas-MagicStickDetroitMIUSA',
        }, {
            description: 'item file metadata URLs',
            url: 'https://archive.org/metadata/20010917Fantmas-MagicStickDetroitMIUSA/files',
            id: '20010917Fantmas-MagicStickDetroitMIUSA',
        }, {
            description: 'item download URLs',
            url: 'https://archive.org/download/20010917Fantmas-MagicStickDetroitMIUSA',
            id: '20010917Fantmas-MagicStickDetroitMIUSA',
        }];

        const unsupportedUrls = [{
            description: 'search URLs',
            url: 'https://archive.org/search.php?query=subject%3A%22Fantomas%22',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'item',
            url: 'https://archive.org/details/20010917Fantmas-MagicStickDetroitMIUSA',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: '/items/20010917Fantmas-MagicStickDetroitMIUSA/Front.jpg',
            }],
        }, {
            description: 'item with a filename that requires URL encoding',
            url: 'https://archive.org/details/skd815',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: '/items/skd815/%23cover.jpg',
            }],
        }, {
            description: 'item without images',
            url: 'https://archive.org/details/coverartarchive_audit_20210419',
            imageCount: 0,
            expectedImages: [],
        }, {
            description: 'CAA item',
            url: 'https://archive.org/details/mbid-e276296d-0e1a-40bb-ac14-7a95f1ca7ff0',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: '/items/mbid-e276296d-0e1a-40bb-ac14-7a95f1ca7ff0/mbid-e276296d-0e1a-40bb-ac14-7a95f1ca7ff0-31558457789.jpg',
                types: [ArtworkTypeIDs.Front],
                comment: '',
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://archive.org/details/e3e23e23r32r32',
            errorMessage: 'Empty IA metadata, item might not exist',
        }, {
            description: 'darkened release',
            url: 'https://archive.org/details/mbid-3c556c47-110d-4782-a607-c93e486bccf8',
            errorMessage: 'Cannot access IA metadata: This item is darkened',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases, pollyContext });
    });
});
