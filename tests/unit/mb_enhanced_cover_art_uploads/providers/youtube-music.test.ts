import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { YoutubeMusicProvider } from '@src/mb_enhanced_cover_art_uploads/providers/youtube-music';
import { itBehavesLike } from '@test-utils/shared-behaviour';

import { findImagesSpec } from './find-images-spec';
import { urlMatchingSpec } from './url-matching-spec';

describe('youtube music provider', () => {
    const provider = new YoutubeMusicProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            description: 'playlist album URLs',
            url: 'https://music.youtube.com/playlist?list=OLAK5uy_kteZkGqHfCQ1ZLJiitRSzKPunx3gZjpDA',
            id: 'OLAK5uy_kteZkGqHfCQ1ZLJiitRSzKPunx3gZjpDA',
        }, {
            description: 'album browse URLs',
            url: 'https://music.youtube.com/browse/MPREb_CYhkf9U6tXI',
            id: 'MPREb_CYhkf9U6tXI',
        }, {
            description: 'watch URLs',
            url: 'https://music.youtube.com/watch?v=CX3BKKxYTYw&list=RDAMVMCX3BKKxYTYw',
            id: 'CX3BKKxYTYw',
        }];

        const unsupportedUrls = [{
            description: 'artist URLs',
            url: 'https://music.youtube.com/channel/UC-GWJZkyivsS-0yMjKMH0AA',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            description: 'release from browse URL',
            url: 'https://music.youtube.com/browse/MPREb_CYhkf9U6tXI',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'yGlJPuWzIYUD_t82oj4ks6Vd2sh8BEmSC1yLhf1rmtV7_e-X8DNBr0hnj_hhi1lyRsIr9OE8RUNC9GA',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            description: 'release from playlist URL',
            url: 'https://music.youtube.com/playlist?list=OLAK5uy_nQz7CSR5A1-ZX_IrI1pbocN9LT051QEi4',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'yGlJPuWzIYUD_t82oj4ks6Vd2sh8BEmSC1yLhf1rmtV7_e-X8DNBr0hnj_hhi1lyRsIr9OE8RUNC9GA',
                types: [ArtworkTypeIDs.Front],
            }],
        }, {
            description: 'music video URL',
            url: 'https://music.youtube.com/watch?v=Py21QCndbxc',
            imageCount: 1,
            expectedImages: [{
                index: 0,
                urlPart: 'Py21QCndbxc/maxresdefault',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            description: 'non-album playlist',
            url: 'https://music.youtube.com/playlist?list=RDCLAK5uy_ltlS29HmNHZb3oCsEjfXmZhIGaWpaDZck&playnext=1&si=gZ48yau-46CbhdDg',
            errorMessage: 'Expected an album, got playlist instead',
        }, {
            description: 'non-existent playlist URL',
            // Slightly adapted from real URL
            url: 'https://music.youtube.com/playlist?list=OLAK5uy_NQz7CSR5A1-ZX_IrI1pbocN9LT051QEi4',
            errorMessage: 'Expected an album, got playlist instead',
        }, {
            description: 'non-existent browse URL',
            // Slightly adapted from real URL
            url: 'https://music.youtube.com/browse/MPREb_cYhkf9U6tXI',
            errorMessage: 'Failed to extract page information, non-existent release?',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
