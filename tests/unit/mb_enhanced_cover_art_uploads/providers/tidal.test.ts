import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { CONFIG } from '@src/mb_enhanced_cover_art_uploads/config';
import { TidalProvider } from '@src/mb_enhanced_cover_art_uploads/providers/tidal';
import { setupPolly } from '@test-utils/pollyjs';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('tidal provider', () => {
    const provider = new TidalProvider();
    const pollyContext = setupPolly();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'listen.tidal.com album URLs',
            url: 'https://listen.tidal.com/album/151193605',
            id: '151193605',
        }, {
            description: 'store.tidal.com album URLs with country',
            url: 'https://store.tidal.com/us/album/175441105',
            id: '175441105',
        }, {
            description: 'store.tidal.com album URLs without country',
            url: 'https://store.tidal.com/album/175441105',
            id: '175441105',
        }, {
            description: 'tidal.com browse album URLs',
            url: 'https://tidal.com/browse/album/175441105',
            id: '175441105',
        }, {
            description: 'tidal.com album URLs',
            url: 'https://tidal.com/album/175441105',
            id: '175441105',
        }];

        const unsupportedUrls = [{
            description: 'tidal.com track URLs',
            url: 'https://tidal.com/browse/track/175441106',
        }, {
            description: 'tidal.com artist URLs',
            url: 'https://tidal.com/browse/artist/23736224',
        }, {
            description: 'listen.tidal.com artist URLs',
            url: 'https://listen.tidal.com/artist/10789784',
        }, {
            description: 'store.tidal.com artist URLs',
            url: 'https://store.tidal.com/nl/artist/23736224',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const expectedResult = {
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: '/images/c61b75cd/0159/4b63/9f25/27b3d6cedd63/origin.jpg',
                types: [ArtworkTypeIDs.Front],
            }],
        };

        const extractionCases = [{
            description: 'listen.tidal.com release',
            url: 'https://listen.tidal.com/album/175441105',
            ...expectedResult,
        }, {
            description: 'store.tidal.com release',
            url: 'https://store.tidal.com/album/175441105',
            ...expectedResult,
        }, {
            description: 'tidal.com release',
            url: 'https://tidal.com/album/175441105',
            ...expectedResult,
        }, {
            description: 'release with video cover',
            url: 'https://listen.tidal.com/album/171032759',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: '/images/72c1e674/70ca/4442/a530/0f00b0ef354a/origin.jpg',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://listen.tidal.com/album/1',
            errorMessage: 'Tidal release does not exist or is not available in your country',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases, pollyContext });

        describe('searching other country APIs', () => {
            const configSpy = jest.spyOn(CONFIG.tidal.checkAllCountries, 'get');

            beforeEach(() => {
                pollyContext.polly.configure({
                    recordFailedRequests: true,
                });
            });

            afterEach(() => {
                configSpy.mockReset();
            });

            it('finds existing release in another country if configured to do so', async () => {
                configSpy.mockResolvedValue(true);

                // This release shouldn't be available in my country, but is available in one of the other countries.
                const results = await provider.findImages(new URL('https://tidal.com/album/496065886'));

                expect(results).toBeArrayOfSize(1);
            });

            it('does not search other countries if configured not to', async () => {
                configSpy.mockResolvedValue(false);

                // This release shouldn't be available in my country, but is available in one of the other countries.
                const results = provider.findImages(new URL('https://tidal.com/album/496065886'));

                await expect(results).toReject();
            });

            it('does not find non-existent release in another country', async () => {
                configSpy.mockResolvedValue(true);

                // This release shouldn't be available in my country, but is available in one of the other countries.
                const results = provider.findImages(new URL('https://listen.tidal.com/album/1'));

                await expect(results).toReject();
            });
        });
    });
});
