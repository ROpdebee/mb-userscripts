import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
// @ts-expect-error rewired
import { convertCaptions, VGMdbProvider, __get__ } from '@src/mb_enhanced_cover_art_uploads/providers/vgmdb';

import { setupPolly } from '@test-utils/pollyjs';
import { itBehavesLike } from '@test-utils/shared_behaviour';

import { urlMatchingSpec } from './url_matching_spec';
import { findImagesSpec } from './find_images_spec';

describe('vgmdb provider', () => {
    const pollyContext = setupPolly();
    const provider = new VGMdbProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'album URLs',
            url: 'https://vgmdb.net/album/79',
            id: '79',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://vgmdb.net/artist/77',
        }, {
            desc: 'organisation URLs',
            url: 'https://vgmdb.net/org/186',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('mapping jacket types', () => {
        const mapJacketType = __get__('mapJacketType');

        const simpleJacketCases = [
            ['Front', ArtworkTypeIDs.Front],
            ['Back', ArtworkTypeIDs.Back],
            ['Spine', ArtworkTypeIDs.Spine],
        ];

        it.each(simpleJacketCases)('should map simple jacket type with %s', (caption, expected) => {
            expect(mapJacketType(caption)).toStrictEqual({
                type: [expected],
                comment: ''
            });
        });

        it('should map to full jacket when no caption is present', () => {
            expect(mapJacketType('')).toStrictEqual({
                type: [
                    ArtworkTypeIDs.Front,
                    ArtworkTypeIDs.Back,
                    ArtworkTypeIDs.Spine
                ],
                comment: ''
            });
        });

        it('should include spine when front and back are present', () => {
            expect(mapJacketType('Front, Back')).toStrictEqual({
                type: [
                    ArtworkTypeIDs.Front,
                    ArtworkTypeIDs.Back,
                    ArtworkTypeIDs.Spine
                ],
                comment: ''
            });
        });

        it('should retain other comments', () => {
            expect(mapJacketType('Front and Back colorised')).toStrictEqual({
                type: [
                    ArtworkTypeIDs.Front,
                    ArtworkTypeIDs.Back,
                    ArtworkTypeIDs.Spine
                ],
                comment: 'colorised'
            });
        });
    });

    describe('caption type mapping', () => {
        const mappingCases: Array<[string, ArtworkTypeIDs[], string]> = [
            ['Front', [ArtworkTypeIDs.Front], ''],
            ['Back', [ArtworkTypeIDs.Back], ''],
            ['Jacket Front', [ArtworkTypeIDs.Front], ''],
            ['Jacket Front & Back', [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine], ''],
            ['Jacket Front & Back', [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine], ''],
            ['Disc 1', [ArtworkTypeIDs.Medium], '1'],
            ['Cassette Front', [ArtworkTypeIDs.Medium], 'Front'],
            ['Vinyl A-side', [ArtworkTypeIDs.Medium], 'A-side'],
            ['Tray', [ArtworkTypeIDs.Tray], ''],
            ['Back', [ArtworkTypeIDs.Back], ''],
            ['Obi', [ArtworkTypeIDs.Obi], ''],
            ['Box', [ArtworkTypeIDs.Other], 'Box'],
            ['Box Front', [ArtworkTypeIDs.Other], 'Box Front'],
            ['Card', [ArtworkTypeIDs.Other], 'Card'],
            ['Sticker', [ArtworkTypeIDs.Sticker], ''],
            ['Slipcase', [ArtworkTypeIDs.Other], 'Slipcase'],
            ['Digipack Outer Left', [ArtworkTypeIDs.Other], 'Digipack Outer Left'],
            ['Insert', [ArtworkTypeIDs.Other], 'Insert'],
            ['Case', [ArtworkTypeIDs.Other], 'Case'],
            ['Contents', [ArtworkTypeIDs.Raw], ''],
        ];

        it.each(mappingCases)('should map %s to the correct type', (caption, expectedTypes, expectedComment) => {
            expect(convertCaptions({ url: 'https://example.com/', caption }))
                .toMatchObject({
                    types: expectedTypes,
                    comment: expectedComment,
                    url: {
                        href: 'https://example.com/',
                    },
                });
        });

        it('does not map types if there is no caption', async () => {
            expect(convertCaptions({ url: 'https://example.com/', caption: '' }))
                .toMatchObject({
                    url: {
                        href: 'https://example.com/',
                    },
                });
        });

        it('does not map types if the caption type is unknown', async () => {
            // Cannot find a real-life example of this, so let's mock a fake one
            expect(convertCaptions({ url: 'https://example.com/', caption: 'not a correct caption' }))
                .toMatchObject({
                    comment: 'not a correct caption',
                    url: {
                        href: 'https://example.com/',
                    },
                });
        });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release where all images are public',
            url: 'https://vgmdb.net/album/96418',
            numImages: 2,
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
            desc: 'release without cover, but with picture',
            url: 'https://vgmdb.net/album/90871',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '/albums/17/90871/90871-1569448344.jpg',
                types: [ArtworkTypeIDs.Front],
                comment: '',
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
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
