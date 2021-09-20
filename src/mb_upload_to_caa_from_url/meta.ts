import type { UserscriptMetadata } from 'userscriptMetadata.js';

import { transformMBMatchURL } from '../lib/util/metadata.js';

const metadata: UserscriptMetadata = {
    name: 'MB: Upload to CAA From URL',
    version: '2021.6.14',
    description: 'Upload covers to the CAA by pasting a URL! Workaround for MBS-4641.',
    'run-at': 'document-load',
    match: [
        'release/*/add-cover-art',
    ].map(transformMBMatchURL).concat(
        ['*://atisket.pulsewidth.org.uk/*']),
    exclude: ['*://atisket.pulsewidth.org.uk/'],
    grant: [
        'GM_xmlhttpRequest',
        // We don't actually use GM_getValue, but it needs to be exposed so that
        // maxurl exports its interface in userscripts.
        'GM_getValue',
    ],
    connect: '*',
    require: ['https://github.com/qsniyg/maxurl/blob/master/userscript.user.js?raw=true']
};

export default metadata;
