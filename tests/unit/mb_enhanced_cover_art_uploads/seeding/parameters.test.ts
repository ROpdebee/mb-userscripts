import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { SeedParameters } from '@src/mb_enhanced_cover_art_uploads/seeding/parameters';

describe('seed parameters', () => {
    const dummyImage = {
        url: new URL('https://example.com/test.jpg'),
    };
    const dummyImageWithTypeAndComment = {
        url: new URL('https://example.com/test.jpg'),
        comment: 'hello world',
        types: [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back],
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
            const seededUrl = new URL(params.createSeedURL('dummy-id'));

            expect(SeedParameters.decode(seededUrl.searchParams).images)
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
        expect(SeedParameters.decode(new URLSearchParams('')))
            .toHaveProperty('images', []);
    });

    it('should parse empty image list for search params without x-seed param', () => {
        expect(SeedParameters.decode(new URLSearchParams('?ref=123')))
            .toHaveProperty('images', []);
    });

    it('should filter out images without URL', () => {
        expect(SeedParameters.decode(new URLSearchParams('x_seed.image.0.comment=test')))
            .toHaveProperty('images', []);
    });

    it('should reject invalid properties', () => {
        const urlParams = new URLSearchParams('x_seed.image.0.url=https://example.com/1&x_seed.image.0.types=["abc"]');

        expect(SeedParameters.decode(urlParams))
            .toHaveProperty('images', [{
                url: new URL('https://example.com/1'),
            }]);
    });

    it('should ignore unknown seeding keys', () => {
        expect(SeedParameters.decode(new URLSearchParams('x_seed.image.0.fake=123')))
            .toHaveProperty('images', []);
    });

    it('should condense sparse arrays', () => {
        const urlParams = new URLSearchParams('x_seed.image.0.url=https://example.com/0&x_seed.image.123.url=https://example.com/123');

        expect(SeedParameters.decode(urlParams))
            .toHaveProperty('images', [{
                url: new URL('https://example.com/0'),
            }, {
                url: new URL('https://example.com/123'),
            }]);
    });

    describe('creating seeding URL', () => {
        const params = new SeedParameters([dummyImageWithTypeAndComment]);

        it('should default to main MB', () => {
            const url = params.createSeedURL('dummy-id');

            expect(new URL(url)).toHaveProperty('host', 'musicbrainz.org');
        });

        it('should be customisable', () => {
            const url = params.createSeedURL('dummy-id', 'custom.musicbrainz.instance.com');

            expect(new URL(url)).toHaveProperty('host', 'custom.musicbrainz.instance.com');
        });
    });
});
