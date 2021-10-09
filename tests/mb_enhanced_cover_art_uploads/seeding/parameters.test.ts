import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { SeedParameters } from '@src/mb_enhanced_cover_art_uploads/seeding/parameters';

describe('seed parameters', () => {
    const dummyImage = {
        url: new URL('https://example.com/test.jpg'),
    };
    const dummyImageWithTypeAndComment = {
        url: new URL('https://example.com/test.jpg'),
        comment: 'hello world',
        type: [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back],
    };

    describe('encoding and decoding invariant', () => {
        it('should hold', () => {
            const params = new SeedParameters([dummyImage]);

            expect(SeedParameters.decode(params.encode()).images)
                .toStrictEqual([dummyImage]);
        });

        it('should hold with types and comments', () => {
            const params = new SeedParameters([dummyImageWithTypeAndComment]);

            expect(SeedParameters.decode(params.encode()).images)
                .toStrictEqual([dummyImageWithTypeAndComment]);
        });

        it('should hold for URL encoding', () => {
            const params = new SeedParameters([dummyImageWithTypeAndComment]);
            const seededUrl = params.createSeedURL('dummy-id');

            expect(SeedParameters.decode(new URL(seededUrl).search).images)
                .toStrictEqual([dummyImageWithTypeAndComment]);
        });

        it('should hold for multiple images', () => {
            const params = new SeedParameters([dummyImage, dummyImage]);

            expect(SeedParameters.decode(params.encode()).images)
                .toStrictEqual([dummyImage, dummyImage]);
        });

        it('should hold for added images', () => {
            const params = new SeedParameters();
            params.addImage(dummyImage);

            expect(SeedParameters.decode(params.encode()).images)
                .toStrictEqual([dummyImage]);
        });

        it('should hold for origin', () => {
            const params = new SeedParameters([], 'test');

            expect(SeedParameters.decode(params.encode()).origin)
                .toBe('test');
        });
    });

    it('should parse empty image list for empty search params', () => {
        expect(SeedParameters.decode(''))
            .toHaveProperty('images', []);
    });

    it('should parse empty image list for search params without x-seed param', () => {
        expect(SeedParameters.decode('?ref=123'))
            .toHaveProperty('images', []);
    });

    it('should filter out images without URL', () => {
        expect(SeedParameters.decode('x_seed.image.0.comment=test'))
            .toHaveProperty('images', []);
    });

    it('should reject invalid properties', () => {
        expect(SeedParameters.decode('x_seed.image.0.url=https://example.com/1&x_seed.image.0.type=["abc"]'))
            .toHaveProperty('images', [{
                url: new URL('https://example.com/1')
            }]);
    });

    it('should ignore unknown seeding keys', () => {
        expect(SeedParameters.decode('x_seed.image.0.fake=123'))
            .toHaveProperty('images', []);
    });

    it('should condense sparse arrays', () => {
        expect(SeedParameters.decode('x_seed.image.0.url=https://example.com/0&x_seed.image.123.url=https://example.com/123'))
            .toHaveProperty('images', [{
                url: new URL('https://example.com/0'),
            }, {
                url: new URL('https://example.com/123'),
            }]);
    });
});
