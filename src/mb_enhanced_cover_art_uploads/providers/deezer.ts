import { LOGGER } from '@lib/logging/logger';

import type { CoverArt } from '../types';
import { HeadMetaPropertyProvider } from './base';

export class DeezerProvider extends HeadMetaPropertyProvider {
    public readonly supportedDomains = ['deezer.com'];
    public readonly favicon = 'https://cdn-files.dzcdn.net/cache/images/common/favicon/favicon-16x16.1e6ae1b5b7794f3e00c0.png';
    public readonly name = 'Deezer';
    protected readonly urlRegex = /(?:\w{2}\/)?album\/(\d+)/;

    public override async findImages(url: URL): Promise<CoverArt[]> {
        const covers = await super.findImages(url);

        // Filter out placeholder images
        return covers.filter((cover) => {
            // Placeholder covers all use the same URLs, since the URL cover "ID"
            // is actually its MD5 sum. See https://github.com/ROpdebee/mb-userscripts/issues/172
            if (cover.url.pathname.includes('d41d8cd98f00b204e9800998ecf8427e')) {
                LOGGER.warn('Ignoring placeholder cover in Deezer release');
                return false;
            }
            return true;
        });
    }
}
