import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { itBehavesLike } from '@test-utils/shared_behaviour';
import { urlMatchingSpec } from './url_matching_spec';
import { SoundcloudProvider } from '@src/mb_enhanced_cover_art_uploads/providers/soundcloud';

describe('soundcloud provider', () => {
    const pollyContext = setupPolly();
    const provider = new SoundcloudProvider();

    const supportedUrls = [{
        desc: 'track URLs',
        url: 'https://soundcloud.com/michalmenert/rust',
        id: 'michalmenert/rust',
    }, {
        desc: 'set URLs',
        url: 'https://soundcloud.com/imnotfromlondonrecords/sets/circle-of-light-the-album',
        id: 'imnotfromlondonrecords/sets/circle-of-light-the-album',
    }, {
        desc: 'private set URLs',
        url: 'https://soundcloud.com/jonnypalding/sets/talk-21/s-Oeb9wlaKWyl',
        id: 'jonnypalding/sets/talk-21/s-Oeb9wlaKWyl',
    }];

    const unsupportedUrls = [{
        desc: 'artist URLs',
        url: 'https://soundcloud.com/imnotfromlondonrecords/',
    }, {
        desc: 'artist album URLs',
        url: 'https://soundcloud.com/imnotfromlondonrecords/albums',
    }, {
        desc: 'artist sets URLs',
        url: 'https://soundcloud.com/imnotfromlondonrecords/sets',
    }, {
        desc: 'set likes URLs',
        url: 'https://soundcloud.com/imnotfromlondonrecords/sets/circle-of-light-the-album/likes',
    }, {
        desc: 'recommended track URLs',
        url: 'https://soundcloud.com/imnotfromlondonrecords/cold-ft-zera-tonin-neo-hannan/recommended',
    }, {
        desc: 'stream URLs',
        url: 'https://soundcloud.com/stream',
    }];

    // eslint-disable-next-line jest/require-hook
    itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });

    it('grabs images for single tracks', async () => {
        const covers = await provider.findImages(new URL('https://soundcloud.com/michalmenert/rust'));

        expect(covers).toBeArrayOfSize(1);
        expect(covers[0].url.href).toContain('000021595021-v5yamr');
        expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(covers[0].comment).toBeUndefined();
    });

    it('grabs images for sets', async () => {
        const covers = await provider.findImages(new URL('https://soundcloud.com/imnotfromlondonrecords/sets/circle-of-light-the-album'));

        expect(covers).toBeArrayOfSize(1);
        expect(covers[0].url.href).toContain('jG8ffb1D9ES0WV2M-CdzgdA');
        expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(covers[0].comment).toBeUndefined();
    });

    it('grabs track images for sets', async () => {
        const covers = await provider.findImages(new URL('https://soundcloud.com/officialpandaeyes/sets/isolationep'));

        expect(covers).toBeArrayOfSize(5);
        expect(covers[0].url.href).toContain('000358407327-4e29ur');
        expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
        expect(covers[0].comment).toBeUndefined();
        // Checking sample.
        expect(covers[2].url.href).toContain('000358401699-8a5h44');
        expect(covers[2].types).toStrictEqual([ArtworkTypeIDs.Track]);
        expect(covers[2].comment).toBe('Track 2');
    });

    it('grabs no images if track has no image', async () => {
        // Make sure it doesn't grab artist image instead.
        const covers = await provider.findImages(new URL('https://soundcloud.com/imnotfromlondonrecords/try-hard-or-die-hard'));

        expect(covers).toBeEmpty();
    });

    it('deduplicates track images', async () => {
        const covers = await provider.findImages(new URL('https://soundcloud.com/officialpandaeyes/sets/keep-going-remix-contest-ep-winners'));

        expect(covers).toBeArrayOfSize(1);
    });

    it('throws if release does not exist', async () => {
        pollyContext.polly.configure({
            recordFailedRequests: true,
        });

        await expect(provider.findImages(new URL('https://soundcloud.com/404/404')))
            .rejects.toThrowWithMessage(Error, 'HTTP error 404: Not Found');
    });

    it('throws if metadata cannot be extracted', async () => {
        // Not a correct release URL, so the required metadata isn't present.
        await expect(provider.findImages(new URL('https://soundcloud.com/upload')))
            .rejects.toThrowWithMessage(Error, /Could not extract metadata/);
    });
});
