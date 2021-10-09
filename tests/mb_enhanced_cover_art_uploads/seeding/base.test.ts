import { registerSeeder, seederFactory, seederSupportsURL } from '@src/mb_enhanced_cover_art_uploads/seeding/base';

const FakeSeeder = {
    supportedDomains: ['example.com'],
    supportedRegexes: [/\.com\/example_path/],

    insertSeedLinks: jest.fn(),
};

const SecondFakeSeeder = {
    supportedDomains: ['example.com'],
    supportedRegexes: [/\.com\/example/],

    insertSeedLinks: jest.fn(),
};

describe('seeder', () => {
    it('supports URLs with correct domain and path', () => {
        expect(seederSupportsURL(FakeSeeder, new URL('https://example.com/example_path/test')))
            .toBeTrue();
    });

    it.each`
        url | desc
        ${'https://example.com/other_path'} | ${'correct domain but wrong path'}
        ${'https://otherexample.com/'} | ${'wrong domain'}
        ${'https://otherexample.com/example_path'} | ${'wrong domain but correct path'}
    `('does not support URLs with $desc', ({ url }: { url: string }) => {
        expect(seederSupportsURL(FakeSeeder, new URL(url)))
            .toBeFalse();
    });
});

describe('seeder factory', () => {
    registerSeeder(FakeSeeder);
    registerSeeder(SecondFakeSeeder);

    it('returns the first matching seeder if URL is supported', () => {
        expect(seederFactory(new URL('https://example.com/example_path')))
            .toBe(FakeSeeder);
    });

    it('returns no seeder if URL is not supported', () => {
        expect(seederFactory(new URL('https://otherexample.com/')))
            .toBeUndefined();
    });
});
