import type { UserscriptMetadata } from 'userscriptMetadata';

import { transformMBMatchURL } from '../lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: Enhanced Cover Art Uploads',
    description: 'Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!',
    'run-at': 'document-load',
    match: [
        'release/*/add-cover-art',
        'release/*/add-cover-art?*',
    ].map(transformMBMatchURL).concat([
        '*://atisket.pulsewidth.org.uk/*'
    ]),
    exclude: ['*://atisket.pulsewidth.org.uk/'],
    grant: [
        'GM_xmlhttpRequest',
        // We don't actually use GM_getValue, but it needs to be exposed so that
        // maxurl exports its interface in userscripts.
        'GM_getValue',
        // Used for some favicons
        'GM_getResourceURL',
    ],
    connect: '*',
    require: ['https://github.com/qsniyg/maxurl/blob/563626fe3b7c5ed3f6dc19d90a356746c68b5b4b/userscript.user.js?raw=true'],
    resource: ['amazonFavicon https://www.amazon.com/favicon.ico'],
};

export default metadata;
