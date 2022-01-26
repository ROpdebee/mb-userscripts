import type { UserscriptMetadata } from '@lib/util/metadata';
import { transformMBMatchURL } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: Enhanced Cover Art Uploads',
    description: 'Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!',
    'run-at': 'document-end',
    match: [
        'release/*/add-cover-art',
        'release/*/add-cover-art?*',
        'release/*/cover-art',
    ].map(transformMBMatchURL).concat([
        '*://atisket.pulsewidth.org.uk/*',
        '*://etc.marlonob.info/atisket/*',
        '*://vgmdb.net/album/*',
    ]),
    exclude: ['*://atisket.pulsewidth.org.uk/'],
    grant: [
        'GM.xmlhttpRequest',
        // We don't actually use GM.getValue, but it needs to be exposed so that
        // maxurl exports its interface in userscripts.
        'GM.getValue',
        // Similarly, we don't use GM.setValue, but IMU doesn't properly test
        // whether it exists so it leads to an error.
        'GM.setValue',
        // Used for some favicons
        'GM.getResourceURL',
    ],
    connect: '*',
    require: ['https://github.com/qsniyg/maxurl/blob/563626fe3b7c5ed3f6dc19d90a356746c68b5b4b/userscript.user.js?raw=true'],
    resource: ['amazonFavicon https://www.amazon.com/favicon.ico'],
};

export default metadata;
