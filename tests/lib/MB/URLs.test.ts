import { getURLsForRelease } from '@lib/MB/URLs';
import HttpAdapter from '@pollyjs/adapter-node-http';
import { mockFetch, setupPolly } from '@test-utils/pollyjs';

// Using polly here so we don't have to manually save the MB output. This runs
// the risk of the tests being flaky if the requests are being passed through
// after an edit is made on MB, but on the other hand, if something changes in
// the API, we'll know it too.
// eslint-disable-next-line jest/require-hook
setupPolly({
    adapters: [HttpAdapter],
});

beforeAll(() => {
    mockFetch('https://musicbrainz.org');
});

describe('getting URLs for release', () => {
    it('retrieves all URLs', async () => {
        const urls = await getURLsForRelease('83a3f2c0-3ca7-4e6e-9de8-f740a1eb8990');

        expect(urls).toBeArrayOfSize(3);
        expect(urls.map((url) => url.href)).toIncludeSameMembers([
            'https://open.spotify.com/album/1eyWP34kB2qZ1CrH5LGTmp',
            'https://www.deezer.com/album/6097061',
            'https://music.apple.com/us/album/578168980'
        ]);
    });

    it('can omit URLs which are ended', async () => {
        const urls = await getURLsForRelease('7d0cf748-475e-4be6-b7f2-ef2d55f3f0f5', { excludeEnded: true });

        expect(urls).toBeArrayOfSize(2);
        expect(urls.map((url) => url.href))
            .not.toInclude('https://music.apple.com/us/album/1473205356');
    });

    it('can omit duplicate URLs', async () => {
        const urls = await getURLsForRelease('6393da26-1c2a-491c-8149-3ddaf5cc0d89', { excludeDuplicates: true });

        expect(urls).toBeArrayOfSize(1);
        expect(urls.map((url) => url.href))
            .toStrictEqual(['https://bulletproofmessenger.bandcamp.com/track/round-2']);
    });
});
