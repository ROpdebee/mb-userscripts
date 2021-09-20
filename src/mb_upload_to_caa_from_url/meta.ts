import type { UserscriptMetadata } from 'userscriptMetadata.js';

import { transformMBMatchURL } from '../lib/util/metadata.js';

const metadata: UserscriptMetadata = {
    name: 'MB: Upload to CAA From URL',
    version: '2021.6.14',
    description: 'Upload covers to the CAA by pasting a URL! Workaround for MBS-4641.',
    'run-at': 'document-load',
    match: [
        'release/*/add-cover-art',
    ].map(transformMBMatchURL),
    grant: ['GM_xmlhttpRequest'],
    connect: '*',
};

export default metadata;
