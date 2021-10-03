// @ts-expect-error rewired
import { getMaximisedCandidates, __set__ } from '@src/mb_enhanced_cover_art_uploads/maximise';
import { DiscogsProvider } from '@src/mb_enhanced_cover_art_uploads/providers/discogs';

// Mock IMU. We can't mock out $$IMU_EXPORT$$, so we'll mock out the wrapped
// function instead.
const fakeImu = jest.fn();
__set__('maxurl', fakeImu);

describe('maximising images', () => {
    it('yields the maximised image', async () => {
        fakeImu.mockImplementation((_url, options) => options.cb?.([{ url: 'https://example.com/max' } as unknown as maxurlResult]));

        const result = await getMaximisedCandidates(new URL('https://example.com/')).next();

        expect(result.done).toBeFalse();
        expect(result.value.url.href).toBe('https://example.com/max');
    });

    it('skips bad images', async () => {
        fakeImu.mockImplementation((_url, options) => options.cb?.([{ bad: true } as unknown as maxurlResult]));

        const result = await getMaximisedCandidates(new URL('https://example.com/')).next();

        expect(result.done).toBeTrue();
        expect(result.value).toBeUndefined();
    });

    it('skips broken images', async () => {
        fakeImu.mockImplementation((_url, options) => options.cb?.([{ likely_broken: true } as unknown as maxurlResult]));

        const result = await getMaximisedCandidates(new URL('https://example.com/')).next();

        expect(result.done).toBeTrue();
        expect(result.value).toBeUndefined();
    });

    it('skips fake images', async () => {
        fakeImu.mockImplementation((_url, options) => options.cb?.([{ fake: true } as unknown as maxurlResult]));

        const result = await getMaximisedCandidates(new URL('https://example.com/')).next();

        expect(result.done).toBeTrue();
        expect(result.value).toBeUndefined();
    });

    it('eventually returns all images', async () => {
        fakeImu.mockImplementation((_url, options) => options.cb?.([{ url: 'https://example.com/max' }, { url: 'https://example.com/max2' }] as unknown as maxurlResult[]));

        const it = getMaximisedCandidates(new URL('https://example.com/'));
        let result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value.url.pathname).toBe('/max');

        result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value.url.pathname).toBe('/max2');

        result = await it.next();

        expect(result.done).toBeTrue();
    });
});

describe('maximising Discogs images', () => {
    // Mock Discogs maximisation, assume it works properly
    jest.spyOn(DiscogsProvider, 'maximiseImage').mockImplementationOnce(() => Promise.resolve(new URL('https://example.com/discogs')));

    it('special-cases Discogs images', async () => {
        const it = getMaximisedCandidates(new URL('https://img.discogs.com/husmGPLvKp_kDmwLCXA_fc75LcM=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-9892912-1579456707-2320.jpeg.jpg'));
        let result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value.url.href).toBe('https://example.com/discogs');

        result = await it.next();

        expect(result.done).toBeTrue();
    });
});
