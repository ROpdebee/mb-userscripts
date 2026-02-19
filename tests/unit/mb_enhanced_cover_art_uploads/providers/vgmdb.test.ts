import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { CONFIG } from '@src/mb_enhanced_cover_art_uploads/config';
import { convertCaptions, VGMdbProvider } from '@src/mb_enhanced_cover_art_uploads/providers/vgmdb';
import { setupPolly } from '@test-utils/pollyjs';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('vgmdb provider', () => {
    const pollyContext = setupPolly();
    const provider = new VGMdbProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'album URLs',
            url: 'https://vgmdb.net/album/79',
            id: '79',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://vgmdb.net/artist/77',
        }, {
            description: 'organisation URLs',
            url: 'https://vgmdb.net/org/186',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('caption type mapping', () => {
        const configPropertySpy = jest.spyOn(CONFIG.vgmdb.keepEntireComment, 'get');

        afterEach(() => {
            configPropertySpy.mockReset();
        });

        const mappingCases: Array<[string, ArtworkTypeIDs[], string]> = [
            ['Front', [ArtworkTypeIDs.Front], ''],
            ['Back', [ArtworkTypeIDs.Back], ''],
            ['Jacket', [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine], ''],
            ['Jacket Front', [ArtworkTypeIDs.Front], ''],
            ['Jacket Front & Back', [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine], ''],
            ['Jacket Front, Back', [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine], ''],
            ['Jacket Front & Back colorised', [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine], 'colorised'],
            ['Disc', [ArtworkTypeIDs.Medium], ''],
            ['Disc 1', [ArtworkTypeIDs.Medium], 'Disc 1'],
            ['DVD', [ArtworkTypeIDs.Medium], 'DVD'],
            ['CD', [ArtworkTypeIDs.Medium], 'CD'],
            ['Disc (reverse)', [ArtworkTypeIDs['Matrix/Runout']], ''],
            ['Disc (Back)', [ArtworkTypeIDs['Matrix/Runout']], ''],
            ['Disc 1 (Back)', [ArtworkTypeIDs['Matrix/Runout']], 'Disc 1'],
            ['Cassette Front', [ArtworkTypeIDs.Medium], 'Front'],
            ['Vinyl A-side', [ArtworkTypeIDs.Medium], 'A-side'],
            ['Tray', [ArtworkTypeIDs.Tray], ''],
            ['Back', [ArtworkTypeIDs.Back], ''],
            ['Obi', [ArtworkTypeIDs.Obi], ''],
            ['Obi Front', [ArtworkTypeIDs.Obi], 'Front'],
            ['Box', [ArtworkTypeIDs.Front], 'Box'],
            ['Box Front', [ArtworkTypeIDs.Front], 'Box'],
            ['Card', [ArtworkTypeIDs.Other], 'Card'],
            ['Card Front', [ArtworkTypeIDs.Other], 'Card Front'],
            ['Sticker', [ArtworkTypeIDs.Sticker], ''],
            ['Slipcase', [ArtworkTypeIDs.Front], 'Slipcase'],
            ['Slipcase Front', [ArtworkTypeIDs.Front], 'Slipcase'],
            ['Slipcase Bottom', [ArtworkTypeIDs.Bottom], 'Slipcase'],
            ['Digipack Outer Left', [ArtworkTypeIDs.Other], 'Digipak Outer Left'],
            ['Digipack Front & Back', [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine], 'Digipak'],
            ['Digipack Interior', [ArtworkTypeIDs.Tray], 'Digipak'],
            ['Insert', [ArtworkTypeIDs.Other], 'Insert'],
            ['Case', [ArtworkTypeIDs.Front], 'Case'],
            ['Case: Back', [ArtworkTypeIDs.Back], 'Case'],
            ['Case: Inside', [ArtworkTypeIDs.Tray], 'Case'],
            ['Contents', [ArtworkTypeIDs['Raw/Unedited']], ''],
            [' Booklet Front & Back', [ArtworkTypeIDs.Booklet], 'Front & Back'],
            ['Booklet: Interview', [ArtworkTypeIDs.Booklet], 'Interview'],
            // ['Back Tray', [ArtworkTypeIDs.Tray], 'Back'],  // FIXME
            // ['Front Tray', [ArtworkTypeIDs.Tray], 'Front'],  // FIXME
            ['Case Side', [ArtworkTypeIDs.Spine], 'Case'],
            ['Box Side', [ArtworkTypeIDs.Spine], 'Box'],
            ['Disc Front', [ArtworkTypeIDs.Medium], ''],
            ['Blu-ray', [ArtworkTypeIDs.Medium], 'Blu‐ray'],
            ['Sleeve Front', [ArtworkTypeIDs.Front], 'Sleeve'],
            ['Sleeve Back', [ArtworkTypeIDs.Back], 'Sleeve'],
            ['Sleeve Interior', [ArtworkTypeIDs.Tray], 'Sleeve'], // Might be wrong.
        ];

        it.each(mappingCases)('should map %s to the correct type', async (caption, expectedTypes, expectedComment) => {
            await expect(convertCaptions({ url: 'https://example.com/', caption }))
                .resolves.toMatchObject({
                    types: expectedTypes,
                    comment: expectedComment,
                    url: {
                        href: 'https://example.com/',
                    },
                });
        });

        it.each(mappingCases)('should map %s to the correct type but keep caption intact if it contains just the type', async (caption, expectedTypes, convertedCaption) => {
            configPropertySpy.mockResolvedValue(true);

            await expect(convertCaptions({ url: 'https://example.com/', caption }))
                .resolves.toMatchObject({
                    types: expectedTypes,
                    comment: convertedCaption === '' ? '' : caption,
                    url: {
                        href: 'https://example.com/',
                    },
                });
        });

        it('does not map types if there is no caption', async () => {
            await expect(convertCaptions({ url: 'https://example.com/', caption: '' }))
                .resolves.toMatchObject({
                    url: {
                        href: 'https://example.com/',
                    },
                });
        });

        it('does not map types if the caption type is unknown', async () => {
            // Cannot find a real-life example of this, so let's mock a fake one
            await expect(convertCaptions({ url: 'https://example.com/', caption: 'not a correct caption' }))
                .resolves.toMatchObject({
                    comment: 'not a correct caption',
                    url: {
                        href: 'https://example.com/',
                    },
                });
        });

        it('removes unnecessary parentheses', async () => {
            await expect(convertCaptions({ url: 'https://example.com/', caption: 'Disc (CD1)' }))
                .resolves.toMatchObject({
                    types: [ArtworkTypeIDs.Medium],
                    comment: 'CD1',
                    url: {
                        href: 'https://example.com/',
                    },
                });
        });

        it('removes unnecessary dashes', async () => {
            await expect(convertCaptions({ url: 'https://example.com/', caption: 'Disc - CD1' }))
                .resolves.toMatchObject({
                    types: [ArtworkTypeIDs.Medium],
                    comment: 'CD1',
                    url: {
                        href: 'https://example.com/',
                    },
                });
        });

        it('keeps captions with parentheses when property is set', async () => {
            configPropertySpy.mockResolvedValueOnce(true);

            await expect(convertCaptions({ url: 'https://example.com/', caption: 'Disc (CD1)' }))
                .resolves.toMatchObject({
                    types: [ArtworkTypeIDs.Medium],
                    comment: 'Disc (CD1)',
                    url: {
                        href: 'https://example.com/',
                    },
                });
        });

        it('keeps captions with dashes when property is set', async () => {
            configPropertySpy.mockResolvedValueOnce(true);

            await expect(convertCaptions({ url: 'https://example.com/', caption: 'Disc - CD1' }))
                .resolves.toMatchObject({
                    types: [ArtworkTypeIDs.Medium],
                    comment: 'Disc - CD1',
                    url: {
                        href: 'https://example.com/',
                    },
                });
        });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'release where all images are public',
            url: 'https://vgmdb.net/album/96418',
            imageCount: 2,
            expectedImages: [{
                index: 0,
                urlPart: '/albums/81/96418/96418-1581893265.jpg',
                types: [ArtworkTypeIDs.Front],
                comment: '',
            }, {
                index: 1,
                urlPart: '/albums/81/96418/96418-1581893266.jpg',
                types: [ArtworkTypeIDs.Back],
                comment: '',
            }],
        }, {
            description: 'release without cover, but with picture',
            url: 'https://vgmdb.net/album/90871',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: '/albums/17/90871/90871-1569448344.jpg',
                types: [ArtworkTypeIDs.Front],
                comment: '',
            }],
        }, {
            description: 'release without any cover or picture',
            url: 'https://vgmdb.net/album/111880',
            imageCount: 0,
            expectedImages: [],
        }, {
            // FIXME: This should actually be able to extract the NSFW image by
            // sending a cookie.
            description: 'release with NSFW cover',
            url: 'https://vgmdb.net/album/103079',
            imageCount: 0,
            expectedImages: [],
        }];

        const extractionFailedCases = [{
            description: 'non-existent release',
            url: 'https://vgmdb.net/album/44324252',
            errorMessage: 'VGMdb returned an error',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases, pollyContext });

        it('does not find all images if some are not public', async () => {
            // This may seem like a useless test case, but if it starts working
            // all of a sudden, I'd like to know about it. Although the response
            // is cached by pollyjs, we might periodically run these tests in
            // passthrough mode, in which case a more up-to-date response will
            // be fetched.
            const covers = await provider.findImages(new URL('https://vgmdb.net/album/79'));

            expect(covers).toBeArray();
            expect(covers).not.toBeArrayOfSize(18);
        });
    });

    describe('extracting images from API', () => {
        it('extracts images for release where all images are public', async () => {
            const covers = await provider.findImagesWithApi(new URL('https://vgmdb.net/album/96418'));

            expect(covers).toBeArrayOfSize(2);
            expect(covers[0]).toMatchCoverArt({
                urlPart: '/albums/81/96418/96418-1581893265.jpg',
                types: [ArtworkTypeIDs.Front],
                comment: '',
            });
            expect(covers[1]).toMatchCoverArt({
                urlPart: '/albums/81/96418/96418-1581893266.jpg',
                types: [ArtworkTypeIDs.Back],
                comment: '',
            });
        });

        it('extracts images for release without cover, but with picture', async () => {
            const covers = await provider.findImagesWithApi(new URL('https://vgmdb.net/album/90871'));

            expect(covers).toBeArrayOfSize(1);
            expect(covers[0]).toMatchCoverArt({
                urlPart: '/albums/17/90871/90871-1569448344.jpg',
                types: [ArtworkTypeIDs.Front],
                comment: '',
            });
        });
    });
});

// 2026-02: Test cases failing due to Cloudflare captcha, cannot check manually as VGMdb just goes into a captcha loop.
//          Seems like the site might be misconfigured?
