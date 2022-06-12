/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion -- False positives throughout. */

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

    it('marks /source URLs as likely broken if original name is not "source"', async () => {
        fakeImu.mockImplementation((url, options) => {
            options.cb?.([{
                url: 'https://a1.mzstatic.com/us/r1000/063/Music114/v4/cc/fc/dc/ccfcdc3b-5d9b-6305-8d59-687db6c67fd2/source',
            }, {
                url: 'https://a1.mzstatic.com/us/r1000/063/Music114/v4/cc/fc/dc/ccfcdc3b-5d9b-6305-8d59-687db6c67fd2/20UMGIM63158.rgb.jpg',
            }] as unknown as maxurlResult[]);
        });

        const it = getMaximisedCandidates(new URL('https://is4-ssl.mzstatic.com/image/thumb/Music114/v4/cc/fc/dc/ccfcdc3b-5d9b-6305-8d59-687db6c67fd2/20UMGIM63158.rgb.jpg/1000x1000bb.webp'));
        let result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.href).toEndWith('/source');
        expect(result.value!.likely_broken).toBeTrue();

        result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.href).toEndWith('/20UMGIM63158.rgb.jpg');
        expect(result.value!.likely_broken).toBeFalsy();
    });

    it('does not mark /source URLs as likely broken if original name is "source"', async () => {
        fakeImu.mockImplementation((url, options) => {
            options.cb?.([{
                url: 'https://a1.mzstatic.com/us/r1000/063/Music114/v4/6e/ff/f5/6efff51c-17f2-1d8b-21f3-b8029fa28434/source',
            }, {
                url: 'https://is3-ssl.mzstatic.com/image/thumb/Music114/v4/6e/ff/f5/6efff51c-17f2-1d8b-21f3-b8029fa28434/source/999999999x0w-999.png',
            }] as unknown as maxurlResult[]);
        });

        const it = getMaximisedCandidates(new URL('https://is3-ssl.mzstatic.com/image/thumb/Music114/v4/6e/ff/f5/6efff51c-17f2-1d8b-21f3-b8029fa28434/source/9999x9999-100.jpg'));
        const result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.href).toEndWith('/source');
        expect(result.value!.likely_broken).toBeFalsy();
    });

    it('marks /source URL as likely broken if smallurl is already maximised', async () => {
        fakeImu.mockImplementation((url, options) => {
            options.cb?.([{
                url: 'https://a1.mzstatic.com/us/r1000/063/Music111/v4/e1/dc/68/e1dc6808-6d55-1e38-a34d-a3807d488859/source',
            }] as unknown as maxurlResult[]);
        });

        const it = getMaximisedCandidates(new URL('https://a1.mzstatic.com/us/r1000/063/Music111/v4/e1/dc/68/e1dc6808-6d55-1e38-a34d-a3807d488859/191061355977.jpg'));
        const result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.href).toEndWith('/source');
        expect(result.value!.likely_broken).toBeTrue();
    });
});

describe('maximising Jamendo images', () => {
    it('returns width=0 image', async () => {
        const it = getMaximisedCandidates(new URL('https://usercontent.jamendo.com/?cid=1632996942&type=album&id=453609&width=300'));
        const result = await it.next();

        expect(result.done).toBeFalse();
        expect(result.value!.url.href).toBe('https://usercontent.jamendo.com/?cid=1632996942&type=album&id=453609&width=0');

        await expect(it.next()).resolves.toHaveProperty('done', true);
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
