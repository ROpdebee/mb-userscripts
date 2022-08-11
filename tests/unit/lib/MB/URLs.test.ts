import { getReleaseIDsForURL, getURLsForRelease } from '@lib/MB/URLs';
import { setupPolly } from '@test-utils/pollyjs';

// Using polly here so we don't have to manually save the MB output. This runs
// the risk of the tests being flaky if the requests are being passed through
// after an edit is made on MB, but on the other hand, if something changes in
// the API, we'll know it too.
const pollyContext = setupPolly();

describe('getting URLs for release', () => {
    it('retrieves all URLs', async () => {
        const urls = await getURLsForRelease('83a3f2c0-3ca7-4e6e-9de8-f740a1eb8990');

        expect(urls).toBeArrayOfSize(3);
        expect(urls.map((url) => url.href)).toIncludeSameMembers([
            'https://open.spotify.com/album/1eyWP34kB2qZ1CrH5LGTmp',
            'https://www.deezer.com/album/6097061',
            'https://music.apple.com/us/album/578168980',
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

describe('getting releases for URLs', () => {
    it('returns empty list when URL does not exist', async () => {
        pollyContext.polly.configure({
            recordFailedRequests: true,
        });

        await expect(getReleaseIDsForURL('https://example.com'))
            .resolves.toBeEmpty();
    });

    it('returns empty list when no release is attached to URL', async () => {
        await expect(getReleaseIDsForURL('https://www.discogs.com/artist/5788865'))
            .resolves.toBeEmpty();
    });

    it('returns release ID for URL', async () => {
        await expect(getReleaseIDsForURL('https://www.discogs.com/release/12620800'))
            .resolves.toStrictEqual(['06ac3e39-54fb-46eb-b40b-9345b7d2a23d']);
    });
});
