import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { FreeMusicArchiveProvider } from '@src/mb_enhanced_cover_art_uploads/providers/freemusicarchive';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

jest.mock('@lib/logging/logger');

describe('free music archive provider', () => {
    const provider = new FreeMusicArchiveProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'album URLs',
            url: 'https://freemusicarchive.org/music/holiznacc0/a-lo-fi-christmas-special',
            id: 'holiznacc0/a-lo-fi-christmas-special',
        }, {
            description: 'track URLs',
            url: 'https://freemusicarchive.org/music/holiznacc0/winter-lofi/snow-drift/',
            id: 'holiznacc0/winter-lofi/snow-drift',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://freemusicarchive.org/music/holiznacc0/',
        }, {
            description: 'genre URLs',
            url: 'https://freemusicarchive.org/genre/Chill-out/',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        // eslint-disable-next-line jest/unbound-method
        const mockLoggerWarn = LOGGER.warn as unknown as jest.Mock<void, [string, unknown]>;

        afterEach(() => {
            mockLoggerWarn.mockReset();
        });

        const extractionCases = [{
            description: 'album',
            url: 'https://freemusicarchive.org/music/holiznacc0/a-lo-fi-christmas-special',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'dqeE5Wy0pQhhjlxpNyyFRCOtQli50jt3pb1ET6kX',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            description: 'track',
            url: 'https://freemusicarchive.org/music/vme/single/moonbeam/',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'KfvARqyS0jw3lCVyxiedwDZGYHZ8CPi1nvEw0rFb',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://freemusicarchive.org/music/holiznacc0/winter-test',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });

        it('warns about non-standalone track releases', async () => {
            const results = await provider.findImages(new URL('https://freemusicarchive.org/music/holiznacc0/winter-lofi/snow-drift/'));

            expect(results).toBeArrayOfSize(1);
            expect(mockLoggerWarn).toHaveBeenCalledWith(expect.stringContaining('part of an album'));
        });
    });
});
