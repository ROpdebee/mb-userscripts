import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
// @ts-expect-error rewired
import { VGMdbProvider, __get__ } from '@src/mb_enhanced_cover_art_uploads/providers/vgmdb';
import { HTTPResponseError } from '@lib/util/xhr';
import { itBehavesLike } from '@test-utils/shared_behaviour';
import { urlMatchingSpec } from './url_matching_spec';

describe('vgmdb provider', () => {
    const pollyContext = setupPolly();
    const provider = new VGMdbProvider();

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

    describe('mapping jacket types', () => {
        const mapJacketType = __get__('mapJacketType');

        it.each`
            caption | exp
            ${'Front'} | ${ArtworkTypeIDs.Front}
            ${'Back'} | ${ArtworkTypeIDs.Back}
            ${'Spine'} | ${ArtworkTypeIDs.Spine}
        `('should map simple jacket type with $caption', ({ caption, exp }: { caption: string; exp: ArtworkTypeIDs }) => {
            expect(mapJacketType(caption)).toStrictEqual({
                type: [exp],
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
        const caption_type_mapping = __get__('CAPTION_TYPE_MAPPING');

        interface ItemType {
            caption: string;
            expected: {
                types: ArtworkTypeIDs[];
                comment: string;
            };
        }

        it.each`
            caption | expected
            ${'Front'} | ${{types: [ArtworkTypeIDs.Front], comment: ''}}
            ${'Back'} | ${{types: [ArtworkTypeIDs.Back], comment: ''}}
            ${'Jacket Front'} | ${{types: [ArtworkTypeIDs.Front], comment: ''}}
            ${'Jacket Front & Back'} | ${{types: [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine], comment: ''}}
            ${'Disc 1'} | ${{types: [ArtworkTypeIDs.Medium], comment: '1'}}
            ${'Cassette Front'} | ${{types: [ArtworkTypeIDs.Medium], comment: 'Front'}}
            ${'Vinyl A-side'} | ${{types: [ArtworkTypeIDs.Medium], comment: 'A-side'}}
            ${'Tray'} | ${{types: [ArtworkTypeIDs.Tray], comment: ''}}
            ${'Back'} | ${{types: [ArtworkTypeIDs.Back], comment: ''}}
            ${'Obi'} | ${{types: [ArtworkTypeIDs.Obi], comment: ''}}
            ${'Box'} | ${{types: [ArtworkTypeIDs.Other], comment: 'Box'}}
            ${'Box Front'} | ${{types: [ArtworkTypeIDs.Other], comment: 'Box Front'}}
            ${'Card'} | ${{types: [ArtworkTypeIDs.Other], comment: 'Card'}}
            ${'Sticker'} | ${{types: [ArtworkTypeIDs.Sticker], comment: ''}}
            ${'Slipcase'} | ${{types: [ArtworkTypeIDs.Other], comment: 'Slipcase'}}
            ${'Digipack Outer Left'} | ${{types: [ArtworkTypeIDs.Other], comment: 'Digipack Outer Left'}}
            ${'Insert'} | ${{types: [ArtworkTypeIDs.Other], comment: 'Insert'}}
            ${'Case'} | ${{types: [ArtworkTypeIDs.Other], comment: 'Case'}}
            ${'Contents'} | ${{types: [ArtworkTypeIDs.Raw], comment: ''}}
        `('should map $caption to the correct type', ({ caption, expected }: ItemType) => {
            const [key, ...rest] = caption.split(' ');

            expect(caption_type_mapping[key.toLowerCase()](rest.join(' ')))
                .toStrictEqual(expected);
        });
    });

    describe('finding images', () => {
        it('finds all images if they are all public', async () => {
            const covers = await provider.findImages(new URL('https://vgmdb.net/album/96418'));

            expect(covers).toBeArrayOfSize(2);
            expect(covers[0].url.pathname).toBe('/albums/81/96418/96418-1581893265.jpg');
            expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
            expect(covers[0].comment).toBeEmpty();
            expect(covers[1].url.pathname).toBe('/albums/81/96418/96418-1581893266.jpg');
            expect(covers[1].types).toStrictEqual([ArtworkTypeIDs.Back]);
            expect(covers[1].comment).toBeEmpty();
        });

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

        it('uses picture if no covers are available', async () => {
            const covers = await provider.findImages(new URL('https://vgmdb.net/album/90871'));

            expect(covers).toBeArrayOfSize(1);
            expect(covers[0].url.pathname).toBe('/albums/17/90871/90871-1569448344.jpg');
            expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
            expect(covers[0].comment).toBeEmpty();
        });

        it('does not map types if there is no caption', async () => {
            // Cannot find a real-life example of this, so let's mock a fake one
            pollyContext.polly.server
                .get('https://vgmdb.info/album/123?format=json')
                .intercept((_req, res) => {
                    res.status(200).json({
                        covers: [{
                            full: 'https://example.com/test',
                            name: ''
                        }],
                        picture_full: 'https://example.com/test',
                        link: 'album/123',
                    });
                });

            const covers = await provider.findImages(new URL('https://vgmdb.net/album/123'));

            expect(covers).toBeArrayOfSize(1);
            expect(covers[0].url.pathname).toBe('/test');
            expect(covers[0].types).toBeUndefined();
            expect(covers[0].comment).toBeUndefined();
        });

        it('does not map types if the caption type is unknown', async () => {
            // Cannot find a real-life example of this, so let's mock a fake one
            pollyContext.polly.server
                .get('https://vgmdb.info/album/123?format=json')
                .intercept((_req, res) => {
                    res.status(200).json({
                        covers: [{
                            full: 'https://example.com/test',
                            name: 'not a correct caption'
                        }],
                        picture_full: 'https://example.com/test',
                        link: 'album/123',
                    });
                });

            const covers = await provider.findImages(new URL('https://vgmdb.net/album/123'));

            expect(covers).toBeArrayOfSize(1);
            expect(covers[0].url.pathname).toBe('/test');
            expect(covers[0].types).toBeUndefined();
            expect(covers[0].comment).toBe('not a correct caption');
        });

        it('includes picture if it is absent from the covers', async () => {
            // Cannot find a real-life example of this, so let's mock a fake one
            pollyContext.polly.server
                .get('https://vgmdb.info/album/123?format=json')
                .intercept((_req, res) => {
                    res.status(200).json({
                        covers: [{
                            full: 'https://example.com/test',
                            name: 'Back'
                        }],
                        picture_full: 'https://example.com/othertest',
                        link: 'album/123',
                    });
                });

            const covers = await provider.findImages(new URL('https://vgmdb.net/album/123'));

            expect(covers).toBeArrayOfSize(2);
            expect(covers[0].url.pathname).toBe('/othertest');
            expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
            expect(covers[0].comment).toBeEmpty();
            expect(covers[1].url.pathname).toBe('/test');
            expect(covers[1].types).toStrictEqual([ArtworkTypeIDs.Back]);
            expect(covers[1].comment).toBeEmpty();
        });

        it('throws if release does not exist', async () => {
            // Cannot find a real-life example of this, so let's mock a fake one
            pollyContext.polly.server
                .get('https://vgmdb.info/album/404?format=json')
                .intercept((_req, res) => {
                    res.status(404);
                });

            await expect(provider.findImages(new URL('https://vgmdb.net/album/404')))
                .rejects.toBeInstanceOf(HTTPResponseError);
        });
    });
});
