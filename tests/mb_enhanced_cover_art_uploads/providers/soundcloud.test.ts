import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { SoundcloudProvider } from '@src/mb_enhanced_cover_art_uploads/providers/soundcloud';

import { itBehavesLike } from '@test-utils/shared_behaviour';

import { urlMatchingSpec } from './url_matching_spec';
import { findImagesSpec } from './find_images_spec';

describe('soundcloud provider', () => {
    const provider = new SoundcloudProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'track URLs',
            url: 'https://soundcloud.com/michalmenert/rust',
            id: 'michalmenert/rust',
        }, {
            desc: 'set URLs',
            url: 'https://soundcloud.com/imnotfromlondonrecords/sets/circle-of-light-the-album',
            id: 'imnotfromlondonrecords/sets/circle-of-light-the-album',
        }, {
            desc: 'private set URLs',
            url: 'https://soundcloud.com/jonnypalding/sets/talk-21/s-Oeb9wlaKWyl',
            id: 'jonnypalding/sets/talk-21/s-Oeb9wlaKWyl',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://soundcloud.com/imnotfromlondonrecords/',
        }, {
            desc: 'artist album URLs',
            url: 'https://soundcloud.com/imnotfromlondonrecords/albums',
        }, {
            desc: 'artist sets URLs',
            url: 'https://soundcloud.com/imnotfromlondonrecords/sets',
        }, {
            desc: 'set likes URLs',
            url: 'https://soundcloud.com/imnotfromlondonrecords/sets/circle-of-light-the-album/likes',
        }, {
            desc: 'recommended track URLs',
            url: 'https://soundcloud.com/imnotfromlondonrecords/cold-ft-zera-tonin-neo-hannan/recommended',
        }, {
            desc: 'stream URLs',
            url: 'https://soundcloud.com/stream',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'single track release',
            url: 'https://soundcloud.com/michalmenert/rust',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '000021595021-v5yamr',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            desc: 'set release',
            url: 'https://soundcloud.com/imnotfromlondonrecords/sets/circle-of-light-the-album',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'jG8ffb1D9ES0WV2M-CdzgdA',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            desc: 'set release with track images',
            url: 'https://soundcloud.com/officialpandaeyes/sets/isolationep',
            numImages: 5,
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
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://soundcloud.com/404/404',
        }, {
            desc: 'release for which metadata cannot be extracted',
            // Not a correct release URL, so the required metadata isn't present.
            url: 'https://soundcloud.com/upload',
            errorMessage: /Could not extract metadata/,
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });

        it('grabs no track images if they will not be used', async () => {
            const covers = await provider.findImages(new URL('https://soundcloud.com/officialpandaeyes/sets/isolationep'), true);

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
    });
});
