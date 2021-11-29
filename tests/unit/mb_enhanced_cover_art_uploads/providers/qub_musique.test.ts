import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { QubMusiqueProvider } from '@src/mb_enhanced_cover_art_uploads/providers/qub_musique';

import { itBehavesLike } from '@test-utils/shared_behaviour';

import { urlMatchingSpec } from './url_matching_spec';
import { findImagesSpec } from './find_images_spec';

describe('qub musique provider', () => {
    const provider = new QubMusiqueProvider();

    describe('url matching', () => {
        const supportedUrls = [{
            desc: 'album URLs',
            url: 'https://www.qub.ca/musique/album/normal-de-l-est-w2l52wh19l0ib',
            id: 'w2l52wh19l0ib',
        }, {
            desc: 'album URLs with numbers',
            url: 'https://www.qub.ca/musique/album/rapelles-saison-1-ysyh4e97276hc',
            id: 'ysyh4e97276hc',
        }, {
            desc: 'dirty album URLs',
            url: 'https://www.qub.ca/musique/album/rapelles-saison-1-ysyh4e97276hc?test=123',
            id: 'ysyh4e97276hc',
        }];

        const unsupportedUrls = [{
            desc: 'artist URLs',
            url: 'https://www.qub.ca/musique/artiste/multi-artistes-3662940',
        }, {
            desc: 'radio URLs',
            url: 'https://www.qub.ca/radio/balado/benoit-dutrizac',
        }, {
            desc: 'article URLs',
            url: 'https://www.qub.ca/article/jean-charest-defend-le-regime-de-pekin-1058978600',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(urlMatchingSpec, { provider, supportedUrls, unsupportedUrls });
    });

    describe('extracting images', () => {
        const extractionCases = [{
            desc: 'release',
            url: 'https://www.qub.ca/musique/album/pour-le-plug-dbssxi6nl5fuc',
            numImages: 1,
            expectedImages: [{
                index: 0,
                urlPart: '/images/covers/uc/5f/dbssxi6nl5fuc_org.jpg',
                types: [ArtworkTypeIDs.Front],
            }],
        }];

        const extractionFailedCases = [{
            desc: 'non-existent release',
            url: 'https://www.qub.ca/musique/album/pour-le-plug-dbssx',
        }];

        // eslint-disable-next-line jest/require-hook
        itBehavesLike(findImagesSpec, { provider, extractionCases, extractionFailedCases });
    });
});
