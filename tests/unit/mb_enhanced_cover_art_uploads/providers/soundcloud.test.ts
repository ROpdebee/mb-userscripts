import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { CONFIG } from '@src/mb_enhanced_cover_art_uploads/config';
import { SoundCloudProvider } from '@src/mb_enhanced_cover_art_uploads/providers/soundcloud';
import { setupPolly } from '@test-utils/pollyjs';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

jest.mock('@lib/logging/logger');
// eslint-disable-next-line jest/unbound-method
const mockLoggerError = LOGGER.error as unknown as jest.Mock<void, [string, unknown]>;

afterEach(() => {
    mockLoggerError.mockReset();
});

describe('soundcloud provider', () => {
    const provider = new SoundCloudProvider();
    const pollyContext = setupPolly();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'track URLs',
            url: 'https://soundcloud.com/michalmenert/rust',
            id: 'michalmenert/rust',
        }, {
            description: 'set URLs',
            url: 'https://soundcloud.com/imnotfromlondonrecords/sets/circle-of-light-the-album',
            id: 'imnotfromlondonrecords/sets/circle-of-light-the-album',
        }, {
            description: 'private set URLs',
            url: 'https://soundcloud.com/jonnypalding/sets/talk-21/s-Oeb9wlaKWyl',
            id: 'jonnypalding/sets/talk-21/s-Oeb9wlaKWyl',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://soundcloud.com/imnotfromlondonrecords/',
        }, {
            description: 'artist album URLs',
            url: 'https://soundcloud.com/imnotfromlondonrecords/albums',
        }, {
            description: 'artist sets URLs',
            url: 'https://soundcloud.com/imnotfromlondonrecords/sets',
        }, {
            description: 'set likes URLs',
            url: 'https://soundcloud.com/imnotfromlondonrecords/sets/circle-of-light-the-album/likes',
        }, {
            description: 'recommended track URLs',
            url: 'https://soundcloud.com/imnotfromlondonrecords/cold-ft-zera-tonin-neo-hannan/recommended',
        }, {
            description: 'stream URLs',
            url: 'https://soundcloud.com/stream',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'single track release',
            url: 'https://soundcloud.com/michalmenert/rust',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: '000021595021-v5yamr',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            description: 'set release',
            url: 'https://soundcloud.com/imnotfromlondonrecords/sets/circle-of-light-the-album',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'jG8ffb1D9ES0WV2M-CdzgdA',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            description: 'set release with track images',
            url: 'https://soundcloud.com/officialpandaeyes/sets/isolationep',
            imageCount: 5,
            expectedImages: [{
                index: 0,
                urlPart: '000358407327-4e29ur',
                types: [ArtworkTypeIDs.Front],
            }, {
                index: 2,
                urlPart: '000358401699-8a5h44',
                types: [ArtworkTypeIDs.Track],
                comment: 'Track 2',
            }],
        }, {
            description: 'set release with >5 track images and backdrop images',
            // This one is not really an album, but there are albums with separate
            // backdrops. They're just hard to find.
            url: 'https://soundcloud.com/soundcloud/sets/i-am-other-vol-2',
            // Front
            // 17 track images (tracks 5, 7, 17 have no track images, the images displayed on the page are artist images)
            // 2 backdrop images
            imageCount: 20,
            expectedImages: [{
                index: 0,
                urlPart: 'waWa9GoBmtNTbqo1-pwoMvA',
                types: [ArtworkTypeIDs.Front],
            }, {
                index: 1,
                urlPart: 'yKWEoE0xZS11dixW-tVPxNA',
                types: [ArtworkTypeIDs.Track],
                comment: 'Track 1',
            }, {
                index: 3,
                urlPart: '9b0d4395-cc72-4aa9-84e1-17b807264e2f',
                types: [ArtworkTypeIDs.Track],
                comment: 'SoundCloud backdrop for tracks 2, 4, 6, 8, 10, 18, 20',
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent track',
            url: 'https://soundcloud.com/404/404',
            errorMessage: /release may have been removed/,
        }, {
            description: 'non-existent set',
            url: 'https://soundcloud.com/officialpandaeyes/sets/isolationep404',
            errorMessage: /release may have been removed/,
        }, {
            description: 'release for which metadata cannot be extracted',
            // Not a correct release URL, so the required metadata isn't present.
            url: 'https://soundcloud.com/upload',
            errorMessage: /Could not extract metadata/,
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases, pollyContext });

        // eslint-disable-next-line jest/no-disabled-tests -- TODO! Requires more efficient track image duplicate detection, otherwise the test recording will be huge.
        it.skip('grabs track images for sets with more than 50 tracks', async () => {
            const covers = await provider.findImages(new URL('https://soundcloud.com/user-367170376/sets/skyrim-sleep'));

            expect(covers).toBeArrayOfSize(89);
        });

        it('grabs no track images if they will not be used', async () => {
            const spy = jest.spyOn(CONFIG.soundcloud, 'skipTrackImages', 'get');
            spy.mockResolvedValueOnce(true);

            const covers = await provider.findImages(new URL('https://soundcloud.com/officialpandaeyes/sets/isolationep'));

            expect(covers).toBeArrayOfSize(1);
            expect(covers[0]).toMatchCoverArt({
                urlPart: '000358407327-4e29ur',
                types: [ArtworkTypeIDs.Front],
            });
        });

        it('grabs no images if track has no image', async () => {
            // Make sure it doesn't grab artist image instead.
            const covers = await provider.findImages(new URL('https://soundcloud.com/imnotfromlondonrecords/try-hard-or-die-hard'));

            expect(covers).toBeEmpty();
        });

        it('deduplicates track images', async () => {
            const covers = await provider.findImages(new URL('https://soundcloud.com/officialpandaeyes/sets/keep-going-remix-contest-ep-winners'));

            expect(covers).toBeArrayOfSize(1);
        });

        it('does not load all track images if some could not be loaded', async () => {
            pollyContext.polly.server
                .get('https://api-v2.soundcloud.com/tracks')
                .intercept((_request, response) => {
                    response.sendStatus(500);
                });

            const covers = await provider.findImages(new URL('https://soundcloud.com/soundcloud/sets/i-am-other-vol-2'));

            expect(covers).toBeArrayOfSize(6);
            expect(mockLoggerError).toHaveBeenCalledWith('Failed to load SoundCloud track data, some track images may be missed', expect.any(Error));
        });

        it('attempts to refresh client ID', async () => {
            pollyContext.polly.configure({
                recordFailedRequests: true,
            });
            localStorage.setItem('ROpdebee_ECAU_SC_ID', 'invalid!');

            const covers = await provider.findImages(new URL('https://soundcloud.com/soundcloud/sets/i-am-other-vol-2'));

            expect(covers).toBeArrayOfSize(20);
        });
    });
});
