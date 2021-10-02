import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
// @ts-expect-error rewired
import { VGMdbProvider, __get__ } from '@src/mb_enhanced_cover_art_uploads/providers/vgmdb';

describe('vgmdb provider', () => {
    const pollyContext = setupPolly();
    const provider = new VGMdbProvider();

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
            caption: string
            expected: {
                type: ArtworkTypeIDs[]
                comment: string
            }
        }

        it.each`
            caption | expected
            ${'Front'} | ${{type: [ArtworkTypeIDs.Front], comment: ''}}
            ${'Back'} | ${{type: [ArtworkTypeIDs.Back], comment: ''}}
            ${'Jacket Front'} | ${{type: [ArtworkTypeIDs.Front], comment: ''}}
            ${'Jacket Front & Back'} | ${{type: [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine], comment: ''}}
            ${'Disc 1'} | ${{type: [ArtworkTypeIDs.Medium], comment: '1'}}
            ${'Cassette Front'} | ${{type: [ArtworkTypeIDs.Medium], comment: 'Front'}}
            ${'Vinyl A-side'} | ${{type: [ArtworkTypeIDs.Medium], comment: 'A-side'}}
            ${'Tray'} | ${{type: [ArtworkTypeIDs.Tray], comment: ''}}
            ${'Back'} | ${{type: [ArtworkTypeIDs.Back], comment: ''}}
            ${'Obi'} | ${{type: [ArtworkTypeIDs.Obi], comment: ''}}
            ${'Box'} | ${{type: [ArtworkTypeIDs.Other], comment: 'Box'}}
            ${'Box Front'} | ${{type: [ArtworkTypeIDs.Other], comment: 'Box Front'}}
            ${'Card'} | ${{type: [ArtworkTypeIDs.Other], comment: 'Card'}}
            ${'Sticker'} | ${{type: [ArtworkTypeIDs.Sticker], comment: ''}}
            ${'Slipcase'} | ${{type: [ArtworkTypeIDs.Other], comment: 'Slipcase'}}
            ${'Digipack Outer Left'} | ${{type: [ArtworkTypeIDs.Other], comment: 'Digipack Outer Left'}}
            ${'Insert'} | ${{type: [ArtworkTypeIDs.Other], comment: 'Insert'}}
            ${'Case'} | ${{type: [ArtworkTypeIDs.Other], comment: 'Case'}}
            ${'Contents'} | ${{type: [ArtworkTypeIDs.Raw], comment: ''}}
        `('should map $caption to the correct type', ({ caption, expected }: ItemType) => {
            const [key, ...rest] = caption.split(' ');

            expect(caption_type_mapping[key.toLowerCase()](rest.join(' ')))
                .toStrictEqual(expected);
        });
    });
});
