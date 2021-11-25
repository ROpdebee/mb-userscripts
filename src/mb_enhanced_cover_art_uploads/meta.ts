import type { UserscriptMetadata } from 'userscriptMetadata';

import { transformMBMatchURL } from '../lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: Enhanced Cover Art Uploads',
    description: 'Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!',
    'run-at': 'document-end',
    match: [
        'release/*/add-cover-art',
        'release/*/add-cover-art?*',
    ].map(transformMBMatchURL).concat([
        '*://atisket.pulsewidth.org.uk/*',
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

    matchedUrlExamples: [
        'https://musicbrainz.org/release/3a179b58-6be9-476a-b36e-63461c93992f/add-cover-art',
        'https://beta.musicbrainz.org/release/3a179b58-6be9-476a-b36e-63461c93992f/add-cover-art',
        'https://beta.musicbrainz.org/release/83a3f2c0-3ca7-4e6e-9de8-f740a1eb8990/add-cover-art?x_seed.image.0.url=https%3A%2F%2Fopen.spotify.com%2Falbum%2F1eyWP34kB2qZ1CrH5LGTmp&x_seed.origin=https%3A%2F%2Fatisket.pulsewidth.org.uk%2F%3Fcached%3D884501818353-d_6097061-s_1eyWP34kB2qZ1CrH5LGTmp-i_578168980',
        'https://atisket.pulsewidth.org.uk/?preferred_countries=US&spf_id=1eyWP34kB2qZ1CrH5LGTmp&preferred_vendor=spf',
        'https://atisket.pulsewidth.org.uk/atasket.php?self_id=884501818353-d_6097061-s_1eyWP34kB2qZ1CrH5LGTmp-i_578168980&release_mbid=83a3f2c0-3ca7-4e6e-9de8-f740a1eb8990',
        'https://vgmdb.net/album/47808',
    ],
    unmatchedUrlExamples: [
        'https://beta.musicbrainz.org/release/3a179b58-6be9-476a-b36e-63461c93992f/cover-art',
        'https://atisket.pulsewidth.org.uk',
    ],
};

export default metadata;
