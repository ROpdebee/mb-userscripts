import type { CoverArtProvider } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { RateYourMusicProvider } from '@src/mb_enhanced_cover_art_uploads/providers/rateyourmusic';
import { setupPolly } from '@test-utils/pollyjs';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('rateyourmusic provider', () => {
    const pollyContext = setupPolly();
    const provider: CoverArtProvider = new RateYourMusicProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'album URLs',
            url: 'https://rateyourmusic.com/release/album/fishmans/long-season.p/',
            id: 'album/fishmans/long-season.p',
        }, {
            desc: 'album buy URLs',
            url: 'https://rateyourmusic.com/release/album/fishmans/long-season.p/buy/',
            id: 'album/fishmans/long-season.p',
        }, {
            desc: 'single URLs',
            url: 'https://rateyourmusic.com/release/single/hot_dad/undertale/',
            id: 'single/hot_dad/undertale',
        }, {
            desc: 'single buy URLs',
            url: 'https://rateyourmusic.com/release/single/hot_dad/undertale/buy',
            id: 'single/hot_dad/undertale',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://rateyourmusic.com/artist/fishmans',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://rateyourmusic.com/release/album/fishmans/long/',
        }, {
            desc: 'release when not logged in',
            url: 'https://rateyourmusic.com/release/album/fishmans/long-season.p/',
            errorMessage: /requires being logged in/,
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases: [], extractionFailedCases, pollyContext });

        it('extracts covers for release when logged in', async () => {
            // Patch the actual response to mock being logged in.
            pollyContext.polly.server
                .get('https://rateyourmusic.com/release/album/fishmans/long-season.p/buy')
                .on('beforeResponse', (_request, response) => {
                    response.body = response.body
                        ?.replace(
                            '<div class="qq">You must be logged in to view the full-size cover art.</div>',
                            '<div class="qq"><b><a href="//e.snmc.io/i/fullres/w/dd6dc758bde2ed6dfeb5db2b486d97c1/7461038">View cover art</a></b></div><img id="amazon_img" alt="Fishmans - Long Season - album cover" src="//e.snmc.io/i/300/w/20903ab46ee429155c8aecb5d168f428/7461038" />')
                        .replace(
                            '<div class="header_profile_logged_out">',
                            '<div class="header_profile_logged_in">');
                });

            const covers = await provider.findImages(new URL('https://rateyourmusic.com/release/album/fishmans/long-season.p/'), false);

            expect(covers).toBeArrayOfSize(1);
            expect(covers[0]).toMatchCoverArt({
                urlPart: 'dd6dc758bde2ed6dfeb5db2b486d97c1/7461038',
                types: [ArtworkTypeIDs.Front],
                comment: undefined,
            });
        });
    });
});
