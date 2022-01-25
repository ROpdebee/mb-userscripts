import type { maxurlInterface, maxurlResult } from '@src/mb_enhanced_cover_art_uploads/maximise';
import * as libAsync from '@lib/util/async';
import { getMaximisedCandidates } from '@src/mb_enhanced_cover_art_uploads/maximise';
import { DiscogsProvider } from '@src/mb_enhanced_cover_art_uploads/providers/discogs';

const fakeImu = jest.fn<ReturnType<maxurlInterface>, Parameters<maxurlInterface>>();

function setIMUResult(results: maxurlResult[]): void {
    fakeImu.mockImplementation((_url, options) => {
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
        expect(result.value!.url.href).toBe('https://example.com/max');
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
        expect(result.value!.url.pathname).toBe('/max');

        result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.pathname).toBe('/max2');

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
        const it = getMaximisedCandidates(new URL('https://i.discogs.com/aRe2RbRXu0g4PvRjrPgQKb_YmFWO3Y0CYc098S8Q1go/rs:fit/g:sm/q:90/h:600/w:576/czM6Ly9kaXNjb2dz/LWltYWdlcy9SLTk4/OTI5MTItMTU3OTQ1/NjcwNy0yMzIwLmpw/ZWc.jpeg'));
        let result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.href).toBe('https://example.com/discogs');

        result = await it.next();

        expect(result.done).toBeTrue();
    });
});

describe('maximising Apple Music images', () => {
    beforeAll(() => {
        fakeImu.mockImplementation((url, options) => {
            options.cb?.([{ url } as unknown as maxurlResult]);
        });
    });

    it('transform Apple Music images to source URL', async () => {
        const it = getMaximisedCandidates(new URL('https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/58/34/98/58349857-55bb-62ae-81d4-4a2726e33528/5060786561909.png/999999999x0w-999.png'));
        const result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.href).toBe('https://a1.mzstatic.com/us/r1000/063/Music124/v4/58/34/98/58349857-55bb-62ae-81d4-4a2726e33528/5060786561909.png');
    });

    it('keeps original maximised URL as backup', async () => {
        const it = getMaximisedCandidates(new URL('https://is3-ssl.mzstatic.com/image/thumb/Music124/v4/73/bd/c8/73bdc8dc-9ab2-ce6e-e581-4bb3d9e559fc/190295474089.webp/999999999x0w-999.png'));
        let result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.href).toBe('https://a1.mzstatic.com/us/r1000/063/Music124/v4/73/bd/c8/73bdc8dc-9ab2-ce6e-e581-4bb3d9e559fc/190295474089.webp');

        result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.href).toBe('https://is3-ssl.mzstatic.com/image/thumb/Music124/v4/73/bd/c8/73bdc8dc-9ab2-ce6e-e581-4bb3d9e559fc/190295474089.webp/999999999x0w-999.png');

        result = await it.next();

        expect(result.done).toBeTrue();
    });

    it('maximises images', async () => {
        fakeImu.mockImplementationOnce((_url, options) => {
            options.cb?.([{ url: 'https://is4-ssl.mzstatic.com/image/thumb/Music115/v4/f1/e6/ad/f1e6adf1-fce1-a7fa-2f9c-e37e32738306/075679767103.jpg/999999999x0w-999.png' } as unknown as maxurlResult]);
        });

        const it = getMaximisedCandidates(new URL('https://is4-ssl.mzstatic.com/image/thumb/Music115/v4/f1/e6/ad/f1e6adf1-fce1-a7fa-2f9c-e37e32738306/075679767103.jpg/160x160bb-60.jpg'));
        let result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.href).toBe('https://a1.mzstatic.com/us/r1000/063/Music115/v4/f1/e6/ad/f1e6adf1-fce1-a7fa-2f9c-e37e32738306/075679767103.jpg');

        result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.href).toBe('https://is4-ssl.mzstatic.com/image/thumb/Music115/v4/f1/e6/ad/f1e6adf1-fce1-a7fa-2f9c-e37e32738306/075679767103.jpg/999999999x0w-999.png');

        result = await it.next();

        expect(result.done).toBeTrue();
        expect(fakeImu).toHaveBeenCalledOnce();
    });

    it('transforms old-style iTunes URLs into source images', async () => {
        const it = getMaximisedCandidates(new URL('https://is2-ssl.mzstatic.com/image/thumb/Music114/v4/61/67/d4/6167d478-a353-28be-75fa-0ebbc74808e2/source/999999999x0w-999.png'));
        const result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.href).toBe('https://a1.mzstatic.com/us/r1000/063/Music114/v4/61/67/d4/6167d478-a353-28be-75fa-0ebbc74808e2/source');
    });

    it('does not transform URLs that already point to source image', async () => {
        const it = getMaximisedCandidates(new URL('https://a1.mzstatic.com/us/r1000/063/Music114/v4/61/67/d4/6167d478-a353-28be-75fa-0ebbc74808e2/source'));
        let result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.href).toBe('https://a1.mzstatic.com/us/r1000/063/Music114/v4/61/67/d4/6167d478-a353-28be-75fa-0ebbc74808e2/source');

        result = await it.next();

        expect(result.done).toBeTrue();
    });
});

describe('maximising Jamendo images', () => {
    it('returns width=0 image', async () => {
        const it = getMaximisedCandidates(new URL('https://usercontent.jamendo.com/?cid=1632996942&type=album&id=453609&width=300'));
        const result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.href).toBe('https://usercontent.jamendo.com/?cid=1632996942&type=album&id=453609&width=0');

        expect((await it.next()).done).toBeTrue();
    });
});

describe('maximising DatPiff images', () => {
    it('returns large image first', async () => {
        const it = getMaximisedCandidates(new URL('https://hw-img.datpiff.com/m09a0c2c/Chief_Keef_Two_Zero_One_Seven-front.jpg'));
        const result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.href).toBe('https://hw-img.datpiff.com/m09a0c2c/Chief_Keef_Two_Zero_One_Seven-front-large.jpg');
    });

    it('includes smaller images as backup', async () => {
        const it = getMaximisedCandidates(new URL('https://hw-img.datpiff.com/m09a0c2c/Chief_Keef_Two_Zero_One_Seven-front.jpg'));
        let result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.pathname).toEndWith('-front-large.jpg');

        result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.pathname).toEndWith('-front-medium.jpg');

        result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.pathname).toEndWith('-front.jpg');

        result = await it.next();

        expect(result.done).toBeTrue();
    });

    it('removes existing suffix', async () => {
        const it = getMaximisedCandidates(new URL('https://hw-img.datpiff.com/m09a0c2c/Chief_Keef_Two_Zero_One_Seven-front-medium.jpg'));
        const result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.pathname).toEndWith('-front-large.jpg');
    });
});
