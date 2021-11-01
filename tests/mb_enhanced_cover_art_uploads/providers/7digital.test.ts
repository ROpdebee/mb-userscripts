import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { itBehavesLike } from '@test-utils/shared_behaviour';
import { urlMatchingSpec } from './url_matching_spec';
import { SevenDigitalProvider } from '@src/mb_enhanced_cover_art_uploads/providers/7digital';

describe('7digital provider', () => {
    // eslint-disable-next-line jest/require-hook
    const pollyContext = setupPolly();
    const provider = new SevenDigitalProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'release URLs',
            url: 'https://ca.7digital.com/artist/green-day/release/oh-yeah-10901051',
            id: '10901051',
        }, {
            desc: 'release URLs with special characters',
            url: 'https://de.7digital.com/artist/tu-ves-ovnis/release/curva-al-final-del-t%C3%BAnel-14385941',
            id: '14385941',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://de.7digital.com/artist/tu-ves-ovnis',
        }, {
            desc: 'feature URLs',
            url: 'https://de.7digital.com/features/VGoltyoAAKgA0eUV/highlights-der-woche',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    it('grabs cover for release', async () => {
        const covers = await provider.findImages(new URL('https://de.7digital.com/artist/mnek/release/language-explicit-8354116'));

        expect(covers).toBeArrayOfSize(1);
        expect(covers[0].url.href).toInclude('0008354116');
        expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(covers[0].comment).toBeUndefined();
    });

    it('throws if release does not exist', async () => {
        pollyContext.polly.configure({
            recordFailedRequests: true,
        });

        await expect(provider.findImages(new URL('https://de.7digital.com/artist/mnek/release/language-elicit-8354116')))
            .rejects.toThrowWithMessage(Error, 'HTTP error 404: Not Found');
    });

    it('does not filter out legit images', async () => {
        const fetchResults = [{
            fetchedUrl: new URL('https://artwork-cdn.7static.com/static/img/sleeveart/00/083/541/0008354116_800.jpg'),
        }];
        // @ts-expect-error: Lazy
        const afterFetch = provider.postprocessImages(fetchResults);

        expect(afterFetch).not.toBeEmpty();
    });

    it('filters out placeholder images', async () => {
        const fetchResults = [{
            fetchedUrl: new URL('https://artwork-cdn.7static.com/static/img/sleeveart/00/000/000/0000000016_800.jpg'),
        }];
        // @ts-expect-error: Lazy
        const afterFetch = provider.postprocessImages(fetchResults);

        expect(afterFetch).toBeEmpty();
    });
});
