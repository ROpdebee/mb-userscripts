import dedent from 'ts-dedent';

import type { UserscriptMetadata } from '@lib/util/metadata';
import { transformMBMatchURL } from '@lib/util/metadata';

const mbMatchedUrls = [
    'release/*/add-cover-art',
    'release/*/add-cover-art?*',
    'release/*/cover-art',
].map((url) => transformMBMatchURL(url));

const metadata: UserscriptMetadata = {
    name: 'MB: Enhanced Cover Art Uploads',
    description: 'Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!',
    'run-at': 'document-end',
    match: [
        ...mbMatchedUrls,
        '*://atisket.pulsewidth.org.uk/*',
        '*://etc.marlonob.info/atisket/*',
        '*://vgmdb.net/album/*',
    ],
    exclude: ['*://atisket.pulsewidth.org.uk/'],
    grant: [
        'GM.xmlhttpRequest',
        // Used for some favicons
        'GM.getResourceURL',
    ],
    connect: '*',
    require: ['https://github.com/qsniyg/maxurl/blob/87bbca876f8d6ae9bdc4b4d3f85bbbc36b238d23/userscript.user.js?raw=true'],
    resource: ['amazonFavicon https://www.amazon.com/favicon.ico'],
    blurb: dedent`
      Enhance the cover art uploader!

      In a nutshell:

      * Upload directly from an image URL
      * One-click import artwork from Discogs/Spotify/Apple Music/... attached to the release (or, alternatively, paste the URL)
      * Automatically retrieve the largest version of an image through [ImageMaxURL](https://github.com/qsniyg/maxurl)
      * Seed the cover art upload form from a-tisket.

      Full list of supported artwork providers [here](src/mb_enhanced_cover_art_uploads/docs/supported_providers.md).
    `,
};

export default metadata;
