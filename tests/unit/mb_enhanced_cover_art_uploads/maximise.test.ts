import * as libAsync from '@lib/util/async';
import { getMaximisedCandidates } from '@src/mb_enhanced_cover_art_uploads/maximise';
import { DiscogsProvider } from '@src/mb_enhanced_cover_art_uploads/providers/discogs';

const fakeImu = jest.fn() as unknown as jest.MockedFunction<typeof $$IMU_EXPORT$$>;

function setIMUResult(results: maxurlResult[]): void {
    fakeImu.mockImplementation(async (_url, options) => {
        options.cb?.(results);
    });
}

beforeAll(() => {
    // @ts-expect-error Mocking
    global.$$IMU_EXPORT$$ = fakeImu;
});

beforeEach(() => {
    fakeImu.mockClear();
});

describe('maximising images', () => {
    it('yields the maximised image', async () => {
        setIMUResult([{ url: 'https://example.com/max' } as unknown as maxurlResult]);

        const result = await getMaximisedCandidates(new URL('https://example.com/')).next();

        expect(result.done).toBeFalse();
        expect(result.value.url.href).toBe('https://example.com/max');
    });

    it('skips bad images', async () => {
        setIMUResult([{ bad: true } as unknown as maxurlResult]);

        const result = await getMaximisedCandidates(new URL('https://example.com/')).next();

        expect(result.done).toBeTrue();
        expect(result.value).toBeUndefined();
    });

    it('skips broken images', async () => {
        setIMUResult([{ likely_broken: true } as unknown as maxurlResult]);

        const result = await getMaximisedCandidates(new URL('https://example.com/')).next();

        expect(result.done).toBeTrue();
        expect(result.value).toBeUndefined();
    });

    it('skips fake images', async () => {
        setIMUResult([{ fake: true } as unknown as maxurlResult]);

        const result = await getMaximisedCandidates(new URL('https://example.com/')).next();

        expect(result.done).toBeTrue();
        expect(result.value).toBeUndefined();
    });

    it('eventually returns all images', async () => {
        setIMUResult([{ url: 'https://example.com/max' }, { url: 'https://example.com/max2' }] as unknown as maxurlResult[]);

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

    it('returns no images on IMU error', async () => {
        const spyRetryTimes = jest.spyOn(libAsync, 'retryTimes');
        spyRetryTimes.mockRejectedValueOnce(new Error('test'));

        const it = getMaximisedCandidates(new URL('https://example.com'));

        await expect(it.next()).resolves.toHaveProperty('done', true);
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

describe('maximising Apple Music images', () => {
    beforeAll(() => {
        fakeImu.mockImplementation(async (url, options) => {
            options.cb?.([{ url } as unknown as maxurlResult]);
        });
    });

    it('retains PNG format if original is PNG', async () => {
        const it = getMaximisedCandidates(new URL('https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/58/34/98/58349857-55bb-62ae-81d4-4a2726e33528/5060786561909.png/999999999x0w-999.png'));
        let result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value.url.href).toBe('https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/58/34/98/58349857-55bb-62ae-81d4-4a2726e33528/5060786561909.png/999999999x0w-999.png');

        result = await it.next();

        expect(result.done).toBeTrue();
    });

    it('uses JPEG format if original is JPEG', async () => {
        const it = getMaximisedCandidates(new URL('https://is3-ssl.mzstatic.com/image/thumb/Music124/v4/73/bd/c8/73bdc8dc-9ab2-ce6e-e581-4bb3d9e559fc/190295474089.jpg/999999999x0w-999.png'));
        const result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value.url.href).toBe('https://is3-ssl.mzstatic.com/image/thumb/Music124/v4/73/bd/c8/73bdc8dc-9ab2-ce6e-e581-4bb3d9e559fc/190295474089.jpg/999999999x0w-999.jpg');
    });

    it('uses PNG format as backup for JPEG', async () => {
        const it = getMaximisedCandidates(new URL('https://is3-ssl.mzstatic.com/image/thumb/Music124/v4/73/bd/c8/73bdc8dc-9ab2-ce6e-e581-4bb3d9e559fc/190295474089.jpg/999999999x0w-999.png'));
        let result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value.url.href).toBe('https://is3-ssl.mzstatic.com/image/thumb/Music124/v4/73/bd/c8/73bdc8dc-9ab2-ce6e-e581-4bb3d9e559fc/190295474089.jpg/999999999x0w-999.jpg');

        result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value.url.href).toBe('https://is3-ssl.mzstatic.com/image/thumb/Music124/v4/73/bd/c8/73bdc8dc-9ab2-ce6e-e581-4bb3d9e559fc/190295474089.jpg/999999999x0w-999.png');

        result = await it.next();

        expect(result.done).toBeTrue();
    });

    it('keeps original maximised URL if format is unknown', async () => {
        const it = getMaximisedCandidates(new URL('https://is3-ssl.mzstatic.com/image/thumb/Music124/v4/73/bd/c8/73bdc8dc-9ab2-ce6e-e581-4bb3d9e559fc/190295474089.webp/999999999x0w-999.png'));
        let result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value.url.href).toBe('https://is3-ssl.mzstatic.com/image/thumb/Music124/v4/73/bd/c8/73bdc8dc-9ab2-ce6e-e581-4bb3d9e559fc/190295474089.webp/999999999x0w-999.png');

        result = await it.next();

        expect(result.done).toBeTrue();
    });

    it('maximises images', async () => {
        fakeImu.mockImplementationOnce(async (_url, options) => {
            options.cb?.([{ url: 'https://is4-ssl.mzstatic.com/image/thumb/Music115/v4/f1/e6/ad/f1e6adf1-fce1-a7fa-2f9c-e37e32738306/075679767103.jpg/999999999x0w-999.png' } as unknown as maxurlResult]);
        });

        const it = getMaximisedCandidates(new URL('https://is4-ssl.mzstatic.com/image/thumb/Music115/v4/f1/e6/ad/f1e6adf1-fce1-a7fa-2f9c-e37e32738306/075679767103.jpg/160x160bb-60.jpg'));
        let result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value.url.href).toBe('https://is4-ssl.mzstatic.com/image/thumb/Music115/v4/f1/e6/ad/f1e6adf1-fce1-a7fa-2f9c-e37e32738306/075679767103.jpg/999999999x0w-999.jpg');

        result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value.url.href).toBe('https://is4-ssl.mzstatic.com/image/thumb/Music115/v4/f1/e6/ad/f1e6adf1-fce1-a7fa-2f9c-e37e32738306/075679767103.jpg/999999999x0w-999.png');

        result = await it.next();

        expect(result.done).toBeTrue();
        expect(fakeImu).toHaveBeenCalledOnce();
    });

    it('retains PNG for old-style iTunes URLs', async () => {
        const it = getMaximisedCandidates(new URL('https://is2-ssl.mzstatic.com/image/thumb/Music114/v4/61/67/d4/6167d478-a353-28be-75fa-0ebbc74808e2/source/999999999x0w-999.png'));
        let result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value.url.href).toBe('https://is2-ssl.mzstatic.com/image/thumb/Music114/v4/61/67/d4/6167d478-a353-28be-75fa-0ebbc74808e2/source/999999999x0w-999.png');

        result = await it.next();

        expect(result.done).toBeTrue();
    });
});


describe('maximising 7digital images', () => {
    it('returns 800x800 image first', async () => {
        const it = getMaximisedCandidates(new URL('https://artwork-cdn.7static.com/static/img/sleeveart/00/143/859/0014385941_350.jpg'));
        const result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value.url.href).toBe('https://artwork-cdn.7static.com/static/img/sleeveart/00/143/859/0014385941_800.jpg');
    });

    it('includes smaller images as backup', async () => {
        const it = getMaximisedCandidates(new URL('https://artwork-cdn.7static.com/static/img/sleeveart/00/143/859/0014385941_350.jpg'));
        let result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value.url.pathname).toEndWith('_800.jpg');

        result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value.url.pathname).toEndWith('_500.jpg');

        result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value.url.pathname).toEndWith('_350.jpg');

        result = await it.next();

        expect(result.done).toBeTrue();
    });
});
