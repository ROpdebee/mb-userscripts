import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { assertDefined } from '@lib/util/assert';
import { blobToDigest } from '@lib/util/blob';
import { parseDOM, qs, qsMaybe } from '@lib/util/dom';

import type { CoverArt, FetchedImage } from '../types';
import { CoverArtProvider } from './base';

export class DatPiffProvider extends CoverArtProvider {
    public readonly supportedDomains = ['datpiff.com'];
    public readonly favicon = 'http://hw-static.datpiff.com/favicon.ico';
    public readonly name = 'DatPiff';
    // Case insensitive because DatPiff seems to add the "mixtape" if the title
    // doesn't end in "mixtape", but if the title does end in "mixtape", it
    // keeps the original capitalisaton.
    protected readonly urlRegex = /mixtape\.(\d+)\.html/i;

    // Placeholders are just the DatPiff logo.
    private static readonly placeholderDigests = [
        '259b065660159922c881d242701aa64d4e02672deba437590a2014519e7caeec', // small
        'ef406a25c3ffd61150b0658f3fe4863898048b4e54b81289e0e53a0f00ad0ced', // medium
        'a2691bde8f4a5ced9e5b066d4fab0675b0ceb80f1f0ab3c4d453228549560048', // large
    ];

    public async findImages(url: URL): Promise<CoverArt[]> {
        const respDocument = parseDOM(await this.fetchPage(url), url.href);

        // DatPiff does not return 404 on non-existent releases, but a 200 page
        // with an error banner.
        if (respDocument.title === 'Mixtape Not Found') {
            throw new Error(this.name + ' release does not exist');
        }

        const coverCont = qs<HTMLDivElement>('.tapeBG', respDocument);
        const frontCoverUrl = coverCont.dataset.front;
        const backCoverUrl = coverCont.dataset.back;
        // If there's no back cover, this element won't be present but the
        // data-back attribute would still be set with a bad URL.
        const hasBackCover = qsMaybe('#screenshot', coverCont) !== null;

        assertDefined(frontCoverUrl, 'No front image found in DatPiff release');

        const covers = [{
            url: new URL(frontCoverUrl),
            types: [ArtworkTypeIDs.Front],
        }];
        if (hasBackCover) {
            assertDefined(backCoverUrl, 'No back cover found in DatPiff release, even though there should be one');
            covers.push({
                url: new URL(backCoverUrl),
                types: [ArtworkTypeIDs.Back],
            });
        }

        return covers;
    }

    public override async postprocessImage(image: FetchedImage): Promise<FetchedImage | null> {
        const digest = await blobToDigest(image.content);
        if (DatPiffProvider.placeholderDigests.includes(digest)) {
            LOGGER.warn(`Skipping "${image.fetchedUrl}" as it matches a placeholder cover`);
            return null;
        } else {
            return image;
        }
    }
}
