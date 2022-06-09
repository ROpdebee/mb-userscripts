import type { UserscriptMetadata } from '@lib/util/metadata';
import { transformMBMatchURL } from '@lib/util/metadata';

const mbMatchedUrls = [
    'release/*/add-cover-art',
    'release/*/add-cover-art?*',
    'release/*/cover-art',
].map(transformMBMatchURL);

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
    require: ['https://github.com/qsniyg/maxurl/blob/4b8661ee2d7a856dc6c4a9b910664584b397d45a/userscript.user.js?raw=true'],
    resource: ['amazonFavicon https://www.amazon.com/favicon.ico'],
};

export default metadata;
