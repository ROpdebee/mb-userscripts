import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { YoutubeProvider } from '@src/mb_enhanced_cover_art_uploads/providers/youtube';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('youtube provider', () => {
    const provider = new YoutubeProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'video URLs',
            url: 'https://www.youtube.com/watch?v=Py21QCndbxc',
            id: 'Py21QCndbxc',
        }];

        const unsupportedUrls = [{
            desc: 'channel URLs',
            url: 'https://www.youtube.com/@NanashiMumei',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'music video',
            url: 'https://www.youtube.com/watch?v=Py21QCndbxc',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'Py21QCndbxc/maxresdefault',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        // Failure case test doesn't currently work because YouTube seems to redirect
        // to a consent page on missing releases, which blocks the test.
        /*
        const extractionFailedCases = [{
            desc: 'non-existent video',
            url: 'https://www.youtube.com/watch?v=py21QCndbXc',
        }];
        */

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases: [] });
    });
});
