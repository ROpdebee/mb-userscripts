import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { itBehavesLike } from '@test-utils/shared_behaviour';
import { urlMatchingSpec } from './url_matching_spec';
import { BeatportProvider } from '@src/mb_enhanced_cover_art_uploads/providers/beatport';

describe('beatport provider', () => {
    const pollyContext = setupPolly();
    const provider = new BeatportProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'album URLs',
            url: 'https://www.beatport.com/release/osa-ep/1778814',
            id: '1778814',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://www.beatport.com/artist/mark-storie/27940',
        }, {
            desc: 'label URLs',
            url: 'https://www.beatport.com/label/20-20-ldn-recordings/51248',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    it('grabs cover for release', async () => {
        const covers = await provider.findImages(new URL('https://www.beatport.com/release/osa-ep/1778814'));

        expect(covers).toBeArrayOfSize(1);
        expect(covers[0].url.pathname).toContain('e638a042-973b-4822-8478-7470d30064d5');
        expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(covers[0].comment).toBeUndefined();
    });

    it('throws on 404 releases', async () => {
        pollyContext.polly.configure({
            recordFailedRequests: true,
        });

        await expect(provider.findImages(new URL('https://www.beatport.com/release/osa-ep/1778')))
            .rejects.toThrowWithMessage(Error, 'HTTP error 404: Not Found');
    });
});
